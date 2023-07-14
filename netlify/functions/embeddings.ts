import { pipeline } from "@xenova/transformers";
import os from "node:os";

export async function handler(event, context) {
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
      "multi-qa-MiniLM-L6-cos-v1",
      {
        cache_dir: os.tmpdir(),
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
