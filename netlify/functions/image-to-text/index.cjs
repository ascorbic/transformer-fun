exports.handler = async function (event, context) {
  const handle = await import("./lib.mjs");
  return handle.handler(event, context);
};
// This is so that the bundler knows to include the wasm file in the bundle
require.resolve("@xenova/transformers/dist/ort-wasm-simd.wasm");
