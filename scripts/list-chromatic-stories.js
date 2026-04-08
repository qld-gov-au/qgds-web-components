#!/usr/bin/env node

import { execSync } from "node:child_process";
import process from "node:process";

const DEFAULT_CHROMATIC_APP_ID = ["6938b225", "545cd7b9", "6df35a84"].join("");

function run(command) {
  return execSync(command, {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
  }).trim();
}

function parseArgs(argv) {
  const args = {
    remote: "origin",
    appId: process.env.CHROMATIC_APP_ID ?? DEFAULT_CHROMATIC_APP_ID,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--remote") {
      args.remote = argv[i + 1] ?? "origin";
      i += 1;
      continue;
    }

    if (token === "--app-id") {
      args.appId = argv[i + 1] ?? args.appId;
      i += 1;
    }
  }

  return args;
}

function getRemoteBranches(remote) {
  const output = run(`git for-each-ref refs/remotes/${remote} --format='%(refname:lstrip=3)'`);

  if (!output) {
    return [];
  }

  return output
    .split("\n")
    .map((branch) => branch.trim())
    .filter((branch) => branch && branch !== "HEAD")
    .sort((a, b) => a.localeCompare(b));
}

function toChromaticUrl(branch, appId) {
  return `https://${branch}--${appId}.chromatic.com`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const branches = getRemoteBranches(args.remote);
  const uniqueBranches = [...new Set(branches)];
  const urls = uniqueBranches.map((branch) => toChromaticUrl(branch, args.appId));

  process.stdout.write(`${urls.join("\n")}\n`);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Failed to list Chromatic stories: ${message}\n`);
  process.exit(1);
}
