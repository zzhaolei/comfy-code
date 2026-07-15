import fs from "node:fs";
import toml from "@iarna/toml";

const tomlPath = "../private-build-plans.toml";
const tomlContent = fs.readFileSync(tomlPath, "utf-8");
const parsedToml = toml.parse(tomlContent);

process.stdout.write(
    "fontFamilies=" + JSON.stringify(Object.keys(parsedToml.buildPlans)) + "\n"
);
