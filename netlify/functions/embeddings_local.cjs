exports.handler = async function (event, context) {
  const handle = await import("../../embeddings.mjs");
  return handle.handler(event, context);
};
