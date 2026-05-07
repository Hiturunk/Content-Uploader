/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  serverDependenciesToBundle: [/.*/],
  browserNodeBuiltinsPolyfill: {
    modules: { events: true, child_process: true, path: true, buffer: true },
  },
  ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}"],
  postcss: true,
  serverModuleFormat: "cjs",
  tailwind: true,
  esbuild: {
    external: ["valtio/vanilla"],
  },
};
