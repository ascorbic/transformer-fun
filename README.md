# 🤗 Transformers.js on Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ascorbic/transformer-fun)

## Overview

This repo contains examples of using the transformers.js library to run Hugging Face models in Netlify functions. The examples are in the `netlify/functions` folder.

## Limitations

- Functions have a max execution time of 10 seconds. This includes downloading and caching the model on first run.
- Models need to be small enough to fit in the function's temporary directory, which is 512MB.
- Cold starts will be slower as it downloads the model into the cache. Subsequent invocations will be faster.

## Examples

**[Image classification demo](https://transformer-fun.netlify.app/)**

The `netlify/functions` folder contains examples showing:

- [Image classification](netlify/functions/image-classification/lib.mjs) - Classify an image with text labels.
- [Sentence embeddings](netlify/functions/embeddings/lib.mjs) - Encode text into vector embeddings.

Each example imports a small model from Hugging Face and shows how to call it in a Netlify function handler.

## Caching

To avoid downloading the model every invocation, the examples cache the model in the `/tmp` directory. The cached model is reused on subsequent invocations.

The cache is persisted across invocations, but not guaranteed to persist for long periods of time. Expect to re-download the model every few hours/days.

## Performance

First invocation will be slow (a few seconds) as it downloads and caches the model. After that invocations should complete very quickly.

Keep computation using the model lightweight to avoid timeout issues. Do as much preprocessing outside of the function handler.

## Additional Resources

- [Transformers.js documentation](https://huggingface.co/docs/transformers.js/index)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ascorbic/transformer-fun)
