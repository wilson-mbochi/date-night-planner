const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
if (!fs.existsSync(envPath)) {
  console.log("No .env.local found");
  process.exit(0);
}

const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
let changed = false;
const out = lines.map((line) => {
  if (!line || line.startsWith("#")) return line;
  const eq = line.indexOf("=");
  if (eq === -1) return line;
  const key = line.slice(0, eq);
  const value = line.slice(eq + 1).trim();
  if (value !== line.slice(eq + 1)) changed = true;
  return `${key}=${value}`;
});

if (changed) {
  fs.writeFileSync(envPath, out.join("\n") + "\n", "utf8");
  console.log("Trimmed whitespace in .env.local");
} else {
  console.log(".env.local already clean");
}
