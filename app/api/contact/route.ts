import { NextResponse } from "next/server";
import { Resend } from "resend";
import { profile } from "../../components/data";

// Very small in-memory rate limit: max 5 submissions per IP per hour.
// Resets on redeploy / cold start — acceptable for a low-traffic personal
// contact form, not meant to be bulletproof.
const submissions = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (submissions.get(ip) ?? []).filter(
    (t) => now - t < WINDOW_MS
  );
  timestamps.push(now);
  submissions.set(ip, timestamps);
  return timestamps.length > MAX_PER_WINDOW;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, company } = body as {
      name?: string;
      email?: string;
      message?: string;
      company?: string; // honeypot field — real users never fill this
    };

    // Honeypot: bots fill every field they find. If this hidden field has
    // anything in it, pretend success so the bot moves on, but send nothing.
    if (company) {
      return NextResponse.json({ ok: true });
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (name.length > 200 || email.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "That email address doesn't look right." },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages sent recently. Try again later." },
        { status: 429 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Message service is not configured yet." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "LABORATORY_07 <onboarding@resend.dev>",
      to: profile.email,
      replyTo: email,
      subject: `New transmission from ${name}`,
      text: `${message}\n\n—\nFrom: ${name} <${email}>`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send. Try again in a moment." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again in a moment." },
      { status: 500 }
    );
  }
}
