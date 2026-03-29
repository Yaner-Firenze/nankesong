import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const passes = pgTable(
  "passes",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    submissionKey: varchar("submission_key", { length: 64 }),
    type: varchar("type", { length: 24 }).notNull(),
    status: varchar("status", { length: 24 }).notNull(),
    name: text("name"),
    teamName: text("team_name"),
    contactName: text("contact_name").notNull(),
    contactInfo: text("contact_info").notNull(),
    role: text("role").notNull(),
    projectName: text("project_name").notNull(),
    projectSummary: text("project_summary").notNull(),
    teamSize: integer("team_size"),
    userNote: text("user_note"),
    internalNote: text("internal_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    submissionKeyIdx: uniqueIndex("passes_submission_key_idx").on(
      table.submissionKey
    ),
  })
);

export const adminLoginAttempts = pgTable("admin_login_attempts", {
  ip: varchar("ip", { length: 128 }).primaryKey(),
  failCount: integer("fail_count").notNull().default(0),
  lockUntil: timestamp("lock_until", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Pass = typeof passes.$inferSelect;
export type NewPass = typeof passes.$inferInsert;
export type AdminLoginAttempt = typeof adminLoginAttempts.$inferSelect;
