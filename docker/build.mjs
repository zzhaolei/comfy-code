import fs from "node:fs";
import { spawnSync } from "node:child_process";
import * as toml from "@iarna/toml";

const mode = process.argv[2] ?? "preview";
const targets = { preview: "ttf-unhinted", unhinted: "ttf-unhinted", full: "contents" };
if (!Object.hasOwn(targets, mode) || process.argv.length > 3) {
  console.error("Usage: docker compose run --build --rm fonts [preview|unhinted|full]");
  process.exit(1);
}

const jobs = Number(process.env.BUILD_JOBS ?? 2);
if (!Number.isSafeInteger(jobs) || jobs < 1) {
  console.error("BUILD_JOBS must be a positive integer.");
  process.exit(1);
}

const config = toml.parse(fs.readFileSync("/work/private-build-plans.toml", "utf8"));
const plan = config.buildPlans?.ComfyCode;
if (!plan) throw new Error("Missing buildPlans.ComfyCode in private-build-plans.toml.");

let family = "ComfyCode";
if (mode === "preview") {
  family = "ComfyCodePreview";
  config.buildPlans = {
    [family]: {
      ...plan,
      family: `${plan.family} Preview`,
      weights: { Regular: { shape: 400, menu: 400, css: 400 } },
    },
  };
}

// Only the container's copies are changed; the mounted configuration is read-only.
fs.writeFileSync("private-build-plans.toml", toml.stringify(config));
fs.copyFileSync("/work/private-parameters.toml", "params/private-parameters.toml");
const target = `${targets[mode]}::${family}`;
console.log(`Building ${target} with ${jobs} concurrent jobs.`);
const result = spawnSync("npm", ["run", "build", "--", target, `--jCmd=${jobs}`], {
  stdio: "inherit",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

console.log(`Fonts written to dist/docker/${family}/ on the host.`);
