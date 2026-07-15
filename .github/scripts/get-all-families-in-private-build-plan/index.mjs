import fs from "node:fs";
import toml from "@iarna/toml";

const tomlPath = new URL(
    "../../../private-build-plans.toml",
    import.meta.url,
);
const tomlContent = fs.readFileSync(tomlPath, "utf-8");
const parsedToml = toml.parse(tomlContent);

process.stdout.write(
    "fontFamilies=" + JSON.stringify(Object.keys(parsedToml.buildPlans)) + "\n",
);
