// Re-source CurseForge-pinned packwiz files to Modrinth wherever Modrinth
// hosts the byte-identical jar (matched by sha1, so no version drift).
// See "Mod sources" in the root README for why the fork wants this.
//
// Usage: bun automation/scripts/src/prefer-modrinth.js
// Run `packwiz refresh` afterwards.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..", "..", "..");
const SCAN_DIRS = ["mods", "resourcepacks", "shaderpacks"];
const USER_AGENT = "cramt/Craftoria (fork tooling)";

const DOWNLOAD_RE =
  /\[download\]\nhash-format = "sha1"\nhash = "(?<sha1>[0-9a-f]{40})"\nmode = "metadata:curseforge"\n/;
const UPDATE_RE =
  /\[update\]\n\[update\.curseforge\]\nfile-id = \d+\nproject-id = \d+\n/;

const candidates = [];
for (const dir of SCAN_DIRS) {
  for (const name of readdirSync(join(REPO_ROOT, dir))) {
    if (!name.endsWith(".pw.toml")) continue;
    const path = join(REPO_ROOT, dir, name);
    const text = readFileSync(path, "utf8");
    const download = text.match(DOWNLOAD_RE);
    if (!download) continue;
    if (!UPDATE_RE.test(text)) {
      console.warn(`skip (unrecognized [update] shape): ${dir}/${name}`);
      continue;
    }
    candidates.push({ path, rel: `${dir}/${name}`, text, sha1: download.groups.sha1 });
  }
}
console.log(`${candidates.length} CurseForge-pinned files to check against Modrinth`);

const bySha1 = {};
for (let i = 0; i < candidates.length; i += 100) {
  const chunk = candidates.slice(i, i + 100);
  const res = await fetch("https://api.modrinth.com/v2/version_files", {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": USER_AGENT },
    body: JSON.stringify({ hashes: chunk.map((c) => c.sha1), algorithm: "sha1" }),
  });
  if (!res.ok) throw new Error(`Modrinth version_files: HTTP ${res.status}`);
  Object.assign(bySha1, await res.json());
}

let converted = 0;
for (const c of candidates) {
  const version = bySha1[c.sha1];
  const file = version?.files.find((f) => f.hashes.sha1 === c.sha1);
  if (!file) continue;
  const next = c.text
    .replace(
      DOWNLOAD_RE,
      `[download]\nurl = "${file.url}"\nhash-format = "sha512"\nhash = "${file.hashes.sha512}"\n`,
    )
    .replace(
      UPDATE_RE,
      `[update]\n[update.modrinth]\nmod-id = "${version.project_id}"\nversion = "${version.id}"\n`,
    );
  writeFileSync(c.path, next);
  converted++;
  console.log(`-> modrinth: ${c.rel}`);
}
console.log(`${converted} converted, ${candidates.length - converted} stay on CurseForge`);
