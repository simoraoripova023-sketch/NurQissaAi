/**
 * Simple in-memory rate limiter for serverless / edge runtime
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

/**
 * Checks if an action is within rate limits.
 * @param key Unique key (e.g. `sms_send:998901234567` or `otp_verify:998901234567`)
 * @param limit Max allowed attempts in the window
 * @param windowMs Time window in milliseconds
 * @returns { allowed: boolean, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || record.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}

/**
 * Resets a rate limit counter (e.g. after successful OTP verification)
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}
