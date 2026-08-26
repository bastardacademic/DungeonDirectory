import Redis from "ioredis";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import helmet from "helmet";

export const redisClient = new Redis(process.env.REDIS_URL);

// ---------- Rate‑limit ----------
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) })
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts. Try again later." },
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) })
});

// ---------- Helmet ----------
export const securityHeaders = helmet({
  hsts: { maxAge: 31536000, preload: true },
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": ["'strict-dynamic'"],
      "object-src": ["'none'"],
      "base-uri"  : ["'none'"]
    }
  },
  referrerPolicy: { policy: "same-origin" }
});
