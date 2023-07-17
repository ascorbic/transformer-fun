import os from "node:os";
import { join } from "node:path";
import { pipeline } from "@xenova/transformers";

const extractor = await pipeline(
  "feature-extraction",
  "Xenova/multi-qa-MiniLM-L6-cos-v1",
  {
    cache_dir: join(os.tmpdir(), "models"),
  }
);
export async function handler(event, context) {
  const texts = [];
  try {
    if (event.httpMethod === "GET") {
      texts.push(event.queryStringParameters.text);
    } else if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body);
      texts.push(...body.texts);
    }
    if (texts.length === 0) {
      return {
        statusCode: 400,
        body: "Please provide text to embed",
      };
    }

    console.time("embed");
    const results = [];
    for (const text of texts) {
      const { data } = await extractor(text, {
        pooling: "mean",
        normalize: true,
      });
      results.push(data);
    }
    console.timeEnd("embed");

    return {
      statusCode: 200,
      body: JSON.stringify(results),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
