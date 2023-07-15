import os from "node:os";
import { join } from "node:path";
import { pipeline } from "@xenova/transformers";

const classifier = await pipeline(
  "summarization",
  "Xenova/distilbart-cnn-6-6",
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

    console.time("embed");

    const data = await classifier(text);

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
