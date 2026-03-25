import { build } from "vite";
import esbuild from "esbuild";

// Build client
await build();

// Build server
await esbuild.build({
  entryPoints: ["server/index.ts"],
  outfile: "dist/index.cjs",
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  external: [
    "@neondatabase/serverless",
    "ws",
  ],
});

console.log("Build complete");
