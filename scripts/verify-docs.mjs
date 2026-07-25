import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
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

for (const repositoryFile of ["README.md", "MANIFEST.md", "AGENTS.md", "docs/android/getting-started.md", "sdk/sdk-android-contract.md"]) {
  requireText(repositoryFile, /https:\/\/github\.com\/FernandoGHe\/kodenix-verify-otp-android/, "enlace al repositorio Android");
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
