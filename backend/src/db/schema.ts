import { integer, jsonb, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const licenseCodes = pgTable("license_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  codeHash: varchar("code_hash", { length: 64 }).notNull().unique(),
  codePrefix: varchar("code_prefix", { length: 16 }).notNull(),
  maxDevices: integer("max_devices").notNull().default(2),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  buyerNote: varchar("buyer_note", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    licenseCodeId: uuid("license_code_id")
      .notNull()
      .references(() => licenseCodes.id, { onDelete: "cascade" }),
    sessionTokenHash: varchar("session_token_hash", { length: 64 }).notNull().unique(),
    deviceId: varchar("device_id", { length: 128 }).notNull(),
    deviceLabel: varchar("device_label", { length: 255 }),
    lastIp: varchar("last_ip", { length: 64 }).notNull().default("unknown"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("sessions_license_device_uidx").on(t.licenseCodeId, t.deviceId)]
);

export const activationLogs = pgTable("activation_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  licenseCodeId: uuid("license_code_id").references(() => licenseCodes.id, { onDelete: "set null" }),
  eventType: varchar("event_type", { length: 32 }).notNull(),
  ip: varchar("ip", { length: 64 }).notNull().default("unknown"),
  userAgent: varchar("user_agent", { length: 512 }),
  meta: jsonb("meta").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type LicenseCodeRow = typeof licenseCodes.$inferSelect;
export type SessionRow = typeof sessions.$inferSelect;
