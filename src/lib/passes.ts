import { and, desc, eq, ilike, ne, or, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { passes, type Pass } from "@/lib/db/schema";
import { toPassInsert } from "@/lib/pass-mappers";
import { getEnv } from "@/lib/env";
import type { CreatePassInput } from "@/lib/validation/pass";

const memoryPasses = new Map<string, Pass>();
const memoryPassIdsBySubmissionKey = new Map<string, string>();

function useMemoryStore() {
  return getEnv().DATABASE_URL.startsWith("memory://");
}

export async function createPass(input: CreatePassInput) {
  const record = toPassInsert(input);

  if (useMemoryStore()) {
    if (record.submissionKey) {
      const existingId = memoryPassIdsBySubmissionKey.get(record.submissionKey);

      if (existingId) {
        return memoryPasses.get(existingId) as Pass;
      }
    }

    const createdAt = new Date();
    const memoryRecord: Pass = {
      id: record.id,
      submissionKey: record.submissionKey ?? null,
      type: record.type,
      status: record.status,
      name: record.name ?? null,
      teamName: record.teamName ?? null,
      contactName: record.contactName,
      contactInfo: record.contactInfo,
      role: record.role,
      projectName: record.projectName,
      projectSummary: record.projectSummary,
      teamSize: record.teamSize ?? null,
      userNote: record.userNote ?? null,
      internalNote: record.internalNote ?? null,
      createdAt,
      updatedAt: createdAt,
    };

    memoryPasses.set(record.id, memoryRecord);

    if (record.submissionKey) {
      memoryPassIdsBySubmissionKey.set(record.submissionKey, record.id);
    }

    return memoryRecord;
  }

  const db = getDb();

  if (record.submissionKey) {
    const existing = await getPassBySubmissionKey(record.submissionKey);

    if (existing) {
      return existing;
    }

    await db
      .insert(passes)
      .values(record)
      .onConflictDoNothing({ target: passes.submissionKey });

    return (await getPassBySubmissionKey(record.submissionKey)) as Pass;
  }

  await db.insert(passes).values(record);

  return (await getPassById(record.id)) as Pass;
}

async function getPassBySubmissionKey(submissionKey: string) {
  if (useMemoryStore()) {
    const existingId = memoryPassIdsBySubmissionKey.get(submissionKey);
    return existingId ? memoryPasses.get(existingId) : undefined;
  }

  const db = getDb();

  return db.query.passes.findFirst({
    where: eq(passes.submissionKey, submissionKey),
  });
}

export async function getPassById(id: string) {
  return getPassRecordById(id, { includeDeleted: false });
}

export async function getPassRecordById(
  id: string,
  options?: { includeDeleted?: boolean }
) {
  const includeDeleted = options?.includeDeleted ?? true;

  if (useMemoryStore()) {
    const record = memoryPasses.get(id);

    if (!record) {
      return undefined;
    }

    if (!includeDeleted && record.status === "deleted") {
      return undefined;
    }

    return record;
  }

  const db = getDb();

  return db.query.passes.findFirst({
    where: includeDeleted
      ? eq(passes.id, id)
      : and(eq(passes.id, id), ne(passes.status, "deleted")),
  });
}

export async function searchPasses(query?: string) {
  const keyword = query?.trim();

  if (useMemoryStore()) {
    const records = [...memoryPasses.values()].sort(
      (left, right) => right.createdAt.getTime() - left.createdAt.getTime()
    );

    if (!keyword) {
      return records.filter((record) => record.status !== "deleted").slice(0, 100);
    }

    const lowered = keyword.toLowerCase();

    return records
      .filter((record) =>
        record.status !== "deleted" &&
        [record.name, record.teamName, record.contactName, record.projectName]
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
        ? and(
            ne(passes.status, "deleted"),
            or(
              ilike(passes.name, `%${keyword}%`),
              ilike(passes.teamName, `%${keyword}%`),
              ilike(passes.contactName, `%${keyword}%`),
              ilike(passes.projectName, `%${keyword}%`)
            )
          )
        : ne(passes.status, "deleted")
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

  return getPassRecordById(id);
}

export async function deletePass(id: string) {
  if (useMemoryStore()) {
    const record = memoryPasses.get(id);

    if (!record) {
      return undefined;
    }

    const updatedRecord: Pass = {
      ...record,
      status: "deleted",
      updatedAt: new Date(),
    };

    memoryPasses.set(id, updatedRecord);
    return updatedRecord;
  }

  const db = getDb();

  await db
    .update(passes)
    .set({
      status: "deleted",
      updatedAt: sql`now()`,
    })
    .where(eq(passes.id, id));

  return getPassRecordById(id);
}
