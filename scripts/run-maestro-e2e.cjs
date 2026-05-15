/**
 * Runs Maestro smoke tests. Prepends ~/.maestro/bin to PATH so Git Bash / Yarn
 * shells find the CLI after `curl ... | bash` install (common on Windows).
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const maestroBinDir = path.join(os.homedir(), ".maestro", "bin");
const env = { ...process.env };
if (fs.existsSync(maestroBinDir)) {
  const sep = path.delimiter;
  env.PATH = `${maestroBinDir}${sep}${env.PATH ?? ""}`;
}

const maestroArgs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["test", "e2e"];

const onPathProbe = spawnSync(
  process.platform === "win32" ? "where" : "command",
  process.platform === "win32" ? ["maestro"] : ["-v", "maestro"],
  { env, encoding: "utf8", shell: true }
);

if (onPathProbe.status !== 0) {
  console.error(`
Maestro CLI not found (or not on PATH for this shell).

Install (pick one):
  • https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli
  • Quick: curl -fsSL "https://get.maestro.mobile.dev" | bash
    Then ensure this directory is on PATH: ${maestroBinDir}
  • Git Bash (Yarn often uses it on Windows): add to ~/.bashrc
      export PATH="$PATH:$HOME/.maestro/bin"

Java 17+ required (JAVA_HOME).
`);
  process.exit(127);
}

const result = spawnSync("maestro", maestroArgs, {
  stdio: "inherit",
  env,
  shell: true,
});

process.exit(result.status ?? 1);
