import os from "node:os";
import { join } from "node:path";
import { pipeline } from "@xenova/transformers";
import "@xenova/transformers/dist/ort-wasm-simd.wasm";

const classifier = await pipeline(
  "image-to-text",
  "Xenova/vit-gpt2-image-captioning",
  {
    cache_dir: join(os.tmpdir(), "models"),
  }
);

export async function handler(event, context) {
  let text;
  try {
    if (event.httpMethod === "GET") {
      text = event.queryStringParameters.text;
    } else if (event.httpMethod === "POST") {
      text = event.body;
    }
    if (!text?.length) {
      return {
        statusCode: 400,
        body: "Please provide text to summarize",
      };
    }
    if (!text.startsWith("https://")) {
      return {
        statusCode: 400,
        body: "Please provide a valid URL",
      };
    }
    const url = new URL(text);
    console.log(url.toString());
    console.time("embed");

    const data = await classifier(url.toString());

    console.timeEnd("embed");

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
