import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const passes = pgTable("passes", {
  id: varchar("id", { length: 64 }).primaryKey(),
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
});

export type Pass = typeof passes.$inferSelect;
export type NewPass = typeof passes.$inferInsert;
