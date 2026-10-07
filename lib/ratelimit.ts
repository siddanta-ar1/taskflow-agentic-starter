import "server-only"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// 5 requests per minute per key (e.g. per IP). Falls back to "allow" when
// Redis isn't configured, so local dev works without an Upstash account.
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, "1 m"), prefix: "taskflow" })
    : null

export async function isRateLimited(key: string) {
  if (!ratelimit) return false
  const { success } = await ratelimit.limit(key)
  return !success
}
