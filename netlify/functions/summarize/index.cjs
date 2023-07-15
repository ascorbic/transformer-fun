exports.handler = async function (event, context) {
  const handle = await import("./lib.mjs");
  return handle.handler(event, context);
};
