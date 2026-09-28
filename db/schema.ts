import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const siteConfig = pgTable("site_config", {
  id: serial().primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const guests = pgTable("guests", {
  id: serial().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  note: text("note").default("").notNull(),
  category: text("category").default("tamu").notNull(),
  invitationCount: integer("invitation_count").default(1).notNull(),
  maxSurat: integer("max_surat").default(1).notNull(),
  isOpen: boolean("is_open").default(true).notNull(),
  openedAt: timestamp("opened_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rsvps = pgTable("rsvps", {
  id: serial().primaryKey(),
  guestSlug: text("guest_slug"),
  guestName: text("guest_name").notNull(),
  attendance: text("attendance").notNull(),
  guestCount: integer("guest_count").default(1).notNull(),
  message: text("message").default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SiteConfigRow = typeof siteConfig.$inferSelect;
export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
export type Rsvp = typeof rsvps.$inferSelect;
export type NewRsvp = typeof rsvps.$inferInsert;
