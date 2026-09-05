"use client";

import { GitHubCalendar } from "react-github-calendar";

export function GithubContribution({ username }: { username: string }) {
  const formatDay = (date: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));

  return (
    <div className="github-contribution">
      <div className="github-header">
        <p className="panel-label">GITHUB / ACTIVITY</p>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          github.com/{username} <span>↗</span>
        </a>
      </div>

      <GitHubCalendar
        username={username}
        colorScheme="dark"
        blockSize={11}
        blockMargin={4}
        fontSize={10}
        theme={{
          dark: ["#0a0c0a", "#202b11", "#4f6927", "#8ea950", "#d4e69c"],
        }}
        labels={{
          totalCount: "{{count}} contributions in the last year",
          legend: {
            less: "LESS",
            more: "MORE",
          },
        }}
        tooltips={{
          activity: {
            text: (activity) =>
              `${activity.count} contribution${
                activity.count === 1 ? "" : "s"
              } on ${formatDay(activity.date)}`,
          },
        }}
      />
    </div>
  );
}