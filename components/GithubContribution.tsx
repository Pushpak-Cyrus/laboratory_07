"use client";


import { GitHubCalendar } from "react-github-calendar";

export function GithubContribution({ username }: { username: string }) {
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
          github.com/{username} ↗
        </a>
      </div>
      <GitHubCalendar
        username={username}
        colorScheme="dark"
        theme={{
          dark: ["#1a1a1a", "#3d4a1f", "#5c7029", "#8ba83a", "#d4e69c"],
        }}
        fontSize={12}
      />
    </div>
  );
}