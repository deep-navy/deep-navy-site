import { build } from "esbuild";

await build({
  entryPoints: ["src/platform-api-client.ts"],
  outfile: "assets/js/platform-api-client.js",
  bundle: true,
  charset: "utf8",
  format: "iife",
  globalName: "deepNavyGeneratedClient",
  legalComments: "none",
  minify: true,
  platform: "browser",
  sourcemap: false,
  target: ["es2022"]
});
