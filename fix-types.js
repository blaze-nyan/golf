/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

// Ensure types directory exists
const typesDir = path.join(__dirname, "types");
if (!fs.existsSync(typesDir)) {
  fs.mkdirSync(typesDir);
}

// Create minimal long.d.ts file
const longTypePath = path.join(typesDir, "long.d.ts");
fs.writeFileSync(longTypePath, 'declare module "long";');

console.log("Created types/long.d.ts successfully");
