import { eq, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import {
  adminLoginAttempts,
  type AdminLoginAttempt,
} from "@/lib/db/schema";
import { getEnv } from "@/lib/env";

const WINDOW_MS = 10 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

const memoryAttempts = new Map<string, AdminLoginAttempt>();

function useMemoryStore() {
  return getEnv().DATABASE_URL.startsWith("memory://");
}

function now() {
  return new Date();
}

function toRetryAfterSeconds(lockUntil: Date | null | undefined) {
  if (!lockUntil) {
    return 0;
  }

  return Math.max(0, Math.ceil((lockUntil.getTime() - now().getTime()) / 1000));
}

async function getAttempt(ip: string) {
  if (useMemoryStore()) {
    return memoryAttempts.get(ip);
  }

  return getDb().query.adminLoginAttempts.findFirst({
    where: eq(adminLoginAttempts.ip, ip),
  });
}

export function getClientIp(forwardedFor: string | null | undefined) {
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

export async function checkAdminLoginAllowed(ip: string) {
  const attempt = await getAttempt(ip);

  if (!attempt?.lockUntil || attempt.lockUntil <= now()) {
    return { allowed: true as const, retryAfterSeconds: 0 };
  }

  return {
    allowed: false as const,
    retryAfterSeconds: toRetryAfterSeconds(attempt.lockUntil),
  };
}

export async function clearAdminLoginAttempts(ip: string) {
  if (useMemoryStore()) {
    memoryAttempts.delete(ip);
    return;
  }

  await getDb()
    .delete(adminLoginAttempts)
    .where(eq(adminLoginAttempts.ip, ip));
}

export async function registerFailedAdminLogin(ip: string) {
  const existing = await getAttempt(ip);
  const currentTime = now();

  const nextFailCount =
    !existing || currentTime.getTime() - existing.updatedAt.getTime() > WINDOW_MS
      ? 1
      : existing.failCount + 1;

  const nextLockUntil =
    nextFailCount >= MAX_FAILURES
      ? new Date(currentTime.getTime() + LOCK_MS)
      : null;

  if (useMemoryStore()) {
    memoryAttempts.set(ip, {
      ip,
      failCount: nextFailCount,
      lockUntil: nextLockUntil,
      updatedAt: currentTime,
    });
    return;
  }

  await getDb()
    .insert(adminLoginAttempts)
    .values({
      ip,
      failCount: nextFailCount,
      lockUntil: nextLockUntil,
      updatedAt: currentTime,
    })
    .onConflictDoUpdate({
      target: adminLoginAttempts.ip,
      set: {
        failCount: nextFailCount,
        lockUntil: nextLockUntil,
        updatedAt: sql`now()`,
      },
    });
}
