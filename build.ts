#!/usr/bin/env bun

await Bun.build({
  entrypoints: ["./src/demo.ts"],
  outdir: "./public",
  minify: true,
  naming: "[dir]/[name].[ext]",
});

export {};
