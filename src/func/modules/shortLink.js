import LRUCache from 'lru-cache';
import crypto from 'crypto';
import nanoid from '../utils/nanoid';
import { redirectToNotFound } from '../utils/redirect';

const URL_TESTER =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&/=]*)/;

const cache = new LRUCache({
  max: 100,
  maxAge: 60 * 1000, // 1 min
  updateAgeOnGet: true,
});

const afterUrlGet = (ctx, url) => {
  if (url) {
    ctx.status = 302;
    ctx.redirect(url);
  } else {
    redirectToNotFound(ctx);
  }
};

export const jumpHandler = async (ctx) => {
  const { shortId } = ctx.params;
  if (!shortId) {
    redirectToNotFound(ctx);
  }
  const cached = cache.get(shortId);
  if (typeof cached !== 'undefined') {
    afterUrlGet(ctx, cached);
  } else {
    // get from kv
    const stored = await KV.get(shortId);
    afterUrlGet(ctx, stored);
    // set result to cache
    cache.set(shortId, stored);
  }
};

export const registerHandler = async (ctx) => {
  const { url } = ctx.request.body;
  if (!URL_TESTER.test(url)) {
    return new Response({
      body: {
        success: false,
        message: 'URL is invalid.',
      },
    });
  }
  const hash = crypto.createHash('md5').update(url).digest('hex');
  const cached = cache.get(hash);
  if (cached) {
    return new Response({
      body: {
        success: true,
        data: cached,
      },
    });
  } else {
    // check stored record
    const stored = await KV.get(hash);
    if (stored) {
      return new Response({
        body: {
          success: true,
          data: stored,
        },
      });
    } else {
      // set to kv
      const shortId = nanoid();
      await KV.set(shortId, url);
      await KV.set(hash, shortId);
      cache.set(hash, shortId);
      return new Response({
        body: {
          success: true,
          data: shortId,
        },
      });
    }
  }
};
