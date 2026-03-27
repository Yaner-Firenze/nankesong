import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { passes } from "@/lib/db/schema";
import { toPassInsert } from "@/lib/pass-mappers";
import type { CreatePassInput } from "@/lib/validation/pass";

export async function createPass(input: CreatePassInput) {
  const db = getDb();
  const record = toPassInsert(input);

  await db.insert(passes).values(record);

  return record;
}

export async function getPassById(id: string) {
  const db = getDb();

  return db.query.passes.findFirst({
    where: eq(passes.id, id),
  });
}

export async function searchPasses(query?: string) {
  const db = getDb();
  const keyword = query?.trim();

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
