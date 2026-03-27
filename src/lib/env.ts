import { z } from "zod";

const appUrlSchema = z.url();

const envSchema = z.object({
  DATABASE_URL: z.url(),
  APP_URL: z.url().optional(),
  ADMIN_PASSWORD: z.string().min(1),
  ADMIN_COOKIE_SECRET: z.string().min(1),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  return envSchema.parse(source);
}

export function getAppUrl(source: NodeJS.ProcessEnv = process.env) {
  if (source.APP_URL) {
    return appUrlSchema.parse(source.APP_URL).replace(/\/$/, "");
  }

  if (source.VERCEL_URL) {
    const vercelUrl = source.VERCEL_URL.startsWith("http")
      ? source.VERCEL_URL
      : `https://${source.VERCEL_URL}`;

    return appUrlSchema.parse(vercelUrl).replace(/\/$/, "");
  }

  return "http://localhost:3000";
}
