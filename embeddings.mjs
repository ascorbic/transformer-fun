import os from "node:os";
import { join } from "node:path";
import { pipeline } from "@xenova/transformers";

export async function handler(event, context) {
  console.log("tmp", os.tmpdir());
  try {
    const { text } = event.queryStringParameters;
    if (!text) {
      return {
        statusCode: 400,
        body: "Please provide text to embed",
      };
    }
    const extractor = await pipeline(
      "feature-extraction",
      "Xenova/multi-qa-MiniLM-L6-cos-v1",
      {
        cache_dir: join(os.tmpdir(), "models"),
      }
    );

    const result = await extractor(text, { pooling: "mean", normalize: true });

    return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
