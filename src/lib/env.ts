import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  APP_URL: z.url(),
  ADMIN_PASSWORD: z.string().min(1),
  ADMIN_COOKIE_SECRET: z.string().min(1),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  return envSchema.parse(source);
}
