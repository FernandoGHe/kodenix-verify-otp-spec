import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const failures = [];
const requireText = (file, pattern, label) => {
  if (!pattern.test(read(file))) failures.push(`${file}: falta ${label}`);
};

for (const file of ["README.md", "MANIFEST.md", "docs/16-published-documentation-surface.md"]) {
  requireText(file, /docs[\\/]android[\\/]getting-started|android\/getting-started/, "enlace a la guia Android");
}

for (const file of ["docs/android/getting-started.md"]) {
  requireText(file, /com\.kodenix\.verify:otp-core:0\.1\.0/, "coordenada otp-core");
  requireText(file, /com\.kodenix\.verify:otp-ui:0\.1\.0/, "coordenada otp-ui");
  requireText(file, /operationId/, "operationId");
  requireText(file, /sdkToken/, "sdkToken");
  requireText(file, /API key privada|API keys privadas|X-Kodenix-Api-Key/i, "prohibicion de API key privada");
}

for (const symbol of ["loadConfiguration", "updateTarget", "send", "resend", "verify", "cancel", "onTargetRequired", "onOtpSent", "onVerificationSuccess", "onError"]) {
  requireText("docs/android/getting-started.md", new RegExp(`\\b${symbol}\\b`), `simbolo publico ${symbol}`);
}

for (const repositoryFile of ["README.md", "MANIFEST.md", "docs/android/getting-started.md", "sdk/sdk-android-contract.md"]) {
  if (/https:\/\/github\.com\/[^\s)"']*android/i.test(read(repositoryFile))) {
    failures.push(`${repositoryFile}: no debe enlazar directamente al repositorio Android`);
  }
}

const androidRoot = process.env.KODENIX_ANDROID_SDK_PATH;
if (androidRoot) {
  const androidRead = relative => fs.readFileSync(path.join(androidRoot, relative), "utf8");
  const coreBuild = androidRead("otp-core/build.gradle.kts");
  const uiBuild = androidRead("otp-ui/build.gradle.kts");
  for (const [name, build] of [["otp-core", coreBuild], ["otp-ui", uiBuild]]) {
    const version = build.match(/version\s*=\s*"([^"]+)"/)?.[1];
    const artifact = build.match(/artifactId\s*=\s*"([^"]+)"/)?.[1];
    if (!version || !artifact) failures.push(`${name}: no se pudo leer Maven artifact/version`);
    else requireText("docs/android/getting-started.md", new RegExp(`com\\.kodenix\\.verify:${artifact}:${version.replaceAll(".", "\\.")}`), `coordenada vigente de ${name}`);
  }
  const publicApi = [
    "otp-core/src/main/java/com/kodenix/otp/api/KodenixOtpClient.kt",
    "otp-core/src/main/java/com/kodenix/otp/api/OtpCallbacks.kt",
  ].map(androidRead).join("\n");
  for (const symbol of ["loadConfiguration", "updateTarget", "send", "resend", "verify", "cancel", "onTargetRequired", "onOtpSent", "onVerificationSuccess", "onError"]) {
    if (!publicApi.includes(`${symbol}(`)) failures.push(`API publica Android: no existe ${symbol}`);
  }
}

const before = new Map();
for (const file of walk(path.join(root, "docs-html"))) before.set(file, digest(file));
const build = spawnSync(process.execPath, [path.join(root, "scripts/build-docs.mjs")], { cwd: root, encoding: "utf8" });
if (build.status !== 0) failures.push(`generador HTML: ${build.stderr || build.stdout}`);
for (const file of walk(path.join(root, "docs-html"))) {
  if (before.has(file) && before.get(file) !== digest(file)) failures.push(`docs-html desactualizado: ${path.relative(root, file)}`);
  before.delete(file);
}
for (const file of before.keys()) failures.push(`docs-html faltante tras generar: ${path.relative(root, file)}`);

for (const file of [path.join(root, "README.md"), path.join(root, "index.html"), ...walk(path.join(root, "docs-html")).filter(item => item.endsWith(".html"))]) {
  const contents = fs.readFileSync(file, "utf8");
  if (/href=["'][^"']*\.html(?:[?#][^"']*)?["']/i.test(contents)) {
    failures.push(`${path.relative(root, file)}: contiene una ruta publica no limpia`);
  }
}

const version = JSON.parse(read("version.json")).version;
if (!/^[a-f0-9]{12}$/.test(version)) failures.push("version.json: version de build invalida");
for (const extension of ["css", "js"]) {
  const asset = `docs-html/assets/docs.${version}.${extension}`;
  if (!fs.existsSync(path.join(root, asset))) failures.push(`${asset}: asset versionado faltante`);
}
for (const file of walk(path.join(root, "docs-html")).filter(item => item.endsWith(".html"))) {
  const contents = fs.readFileSync(file, "utf8");
  if (/docs\.(?:css|js)/.test(contents)) failures.push(`${path.relative(root, file)}: referencia un asset sin version`);
  for (const match of contents.matchAll(/docs\.([a-f0-9]{12})\.(?:css|js)/g)) {
    if (match[1] !== version) failures.push(`${path.relative(root, file)}: referencia asset de otra version`);
  }
}
requireText("docs-html/assets/docs.js", /cache:\s*['"]no-store['"]/, "consulta de version sin cache");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Android docs, links and generated HTML are synchronized${androidRoot ? " with the local SDK" : " internally"}.`);

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(item => {
    const file = path.join(directory, item.name);
    return item.isDirectory() ? walk(file) : [file];
  });
}
function digest(file) { return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"); }
