import esbuild from "esbuild";

// Bundle the API function with all server dependencies into a single file
await esbuild.build({
  entryPoints: ["api/index.ts"],
  outfile: "api/index.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
  external: [
    // Keep Node built-ins external
    "node:*",
    // Keep Vercel runtime external
    "@vercel/node",
  ],
});

console.log("API function bundled successfully");
