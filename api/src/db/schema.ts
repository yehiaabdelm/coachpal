import {
  pgTable,
  integer,
  text,
  timestamp,
  uuid,
  boolean,
  type AnyPgColumn,
  index,
  varchar,
  pgEnum,
  jsonb,
  uniqueIndex,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const now = () => new Date();

export const biologicalSexEnum = pgEnum("biological_sex", ["male", "female"]);

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  firstName: varchar({ length: 50 }),
  lastName: varchar({ length: 50 }),
  email: text().unique(),
  hashedPassword: text().notNull(),
  dateOfBirth: date(),
  biologicalSex: biologicalSexEnum(),
  timezone: varchar({ length: 64 }),
  emailVerifiedAt: timestamp({
    mode: "date",
    withTimezone: true,
  }),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
});

export const heightEntries = pgTable("height_entries", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id, { onDelete: "cascade" }),
  heightCm: integer().notNull(),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const weightEntries = pgTable("weight_entries", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id, { onDelete: "cascade" }),
  weightCm: integer().notNull(),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const organizations = pgTable("organizations", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  imageFileId: uuid()
    .notNull()
    .references(() => users.id),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
});

export const roles = pgTable("roles", {
  name: varchar({ length: 40 }).notNull(),
  description: text().notNull(),
});

export const userOrganization = pgTable("user_organization", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id, { onDelete: "cascade" }),
  organizationId: uuid().references(() => organizations.id, {
    onDelete: "cascade",
  }),
  role: varchar({ length: 40 })
    .notNull()
    .references(() => roles.name, { onDelete: "restrict" }),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
});

export const coachAthlete = pgTable("coach_athlete", {
  id: uuid().primaryKey().defaultRandom(),
  coachUserId: uuid().references(() => users.id, { onDelete: "set null" }),
  athleteUserId: uuid().references(() => users.id, {
    onDelete: "cascade",
  }),
  organizationId: uuid().references(() => organizations.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
});

export const workoutSplits = pgTable("workout_splits", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 100 }),
  createdByUserId: uuid().references(() => users.id, { onDelete: "set null" }),
  organizationId: uuid().references(() => organizations.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
});

export const workoutSplitDays = pgTable("workout_split_days", {
  id: uuid().primaryKey().defaultRandom(),
  workoutSplitId: uuid().references(() => workoutSplits.id),
  workoutTemplateId: uuid().references(() => workoutTemplates.id),
  dayIndex: integer(),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
});

export const workoutTemplates = pgTable("workout_templates", {
  id: uuid().primaryKey().defaultRandom(),
  createdByUserId: uuid().references(() => users.id, { onDelete: "set null" }),
  organizationId: uuid().references(() => organizations.id, {
    onDelete: "cascade",
  }),
  name: varchar({ length: 100 }),
  notes: text(),
  createdInSplitId: uuid().references(() => workoutSplits.id),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
});

export const files = pgTable("files", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id, { onDelete: "set null" }),
  key: text(),
  mimeType: text(),
  sizeBytes: integer(),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
});
