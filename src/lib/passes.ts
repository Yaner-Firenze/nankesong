import { desc, eq, ilike, or, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { passes, type Pass } from "@/lib/db/schema";
import { toPassInsert } from "@/lib/pass-mappers";
import { getEnv } from "@/lib/env";
import type { CreatePassInput } from "@/lib/validation/pass";

const memoryPasses = new Map<string, Pass>();

function useMemoryStore() {
  return getEnv().DATABASE_URL.startsWith("memory://");
}

export async function createPass(input: CreatePassInput) {
  const record = toPassInsert(input);

  if (useMemoryStore()) {
    const createdAt = new Date();
    const memoryRecord: Pass = {
      ...record,
      createdAt,
      updatedAt: createdAt,
    };

    memoryPasses.set(record.id, memoryRecord);
    return memoryRecord;
  }

  const db = getDb();
  await db.insert(passes).values(record);

  return (await getPassById(record.id)) as Pass;
}

export async function getPassById(id: string) {
  if (useMemoryStore()) {
    return memoryPasses.get(id);
  }

  const db = getDb();

  return db.query.passes.findFirst({
    where: eq(passes.id, id),
  });
}

export async function searchPasses(query?: string) {
  const keyword = query?.trim();

  if (useMemoryStore()) {
    const records = [...memoryPasses.values()].sort(
      (left, right) => right.createdAt.getTime() - left.createdAt.getTime()
    );

    if (!keyword) {
      return records.slice(0, 100);
    }

    const lowered = keyword.toLowerCase();

    return records
      .filter((record) =>
        [
          record.name,
          record.teamName,
          record.contactName,
          record.projectName,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(lowered))
      )
      .slice(0, 100);
  }

  const db = getDb();

  return db
    .select()
    .from(passes)
    .where(
      keyword
        ? or(
            ilike(passes.name, `%${keyword}%`),
            ilike(passes.teamName, `%${keyword}%`),
            ilike(passes.contactName, `%${keyword}%`),
            ilike(passes.projectName, `%${keyword}%`)
          )
        : undefined
    )
    .orderBy(desc(passes.createdAt))
    .limit(100);
}

export async function updateInternalNote(id: string, internalNote: string) {
  if (useMemoryStore()) {
    const record = memoryPasses.get(id);

    if (!record) {
      return undefined;
    }

    const updatedRecord: Pass = {
      ...record,
      internalNote,
      updatedAt: new Date(),
    };

    memoryPasses.set(id, updatedRecord);
    return updatedRecord;
  }

  const db = getDb();

  await db
    .update(passes)
    .set({
      internalNote,
      updatedAt: sql`now()`,
    })
    .where(eq(passes.id, id));

  return getPassById(id);
}
