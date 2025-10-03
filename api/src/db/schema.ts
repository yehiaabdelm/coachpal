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
  email: text().unique().notNull(),
  hashedPassword: text().notNull(),
  dateOfBirth: date(),
  biologicalSex: biologicalSexEnum(),
  timezone: text(),
  avatarFileId: uuid().references((): AnyPgColumn => files.id),
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
  imageFileId: uuid().references(() => files.id),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
});

export const roles = pgTable("roles", {
  name: varchar({ length: 40 }).notNull().primaryKey(),
  description: text().notNull(),
});

export const userOrganization = pgTable("user_organization", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id, { onDelete: "cascade" }),
  organizationId: uuid().references(() => organizations.id, {
    onDelete: "cascade",
  }).notNull(),
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

export const invitationTypeEnum = pgEnum("invitation_type", [
  "organization",
  "athlete",
]);

export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
]);

export const invitations = pgTable("invitations", {
  id: uuid().primaryKey().defaultRandom(),
  invitedByUserId: uuid()
    .references(() => users.id, { onDelete: "set null" })
    .notNull(),
  organizationId: uuid()
    .references(() => organizations.id, {
      onDelete: "cascade",
    })
    .notNull(),
  email: text().notNull(),
  firstName: text(),
  lastName: text(),
  role: varchar({ length: 40 }).references(() => roles.name), // for org invites
  type: invitationTypeEnum().notNull(),
  token: text().notNull(),
  acceptedByUserId: uuid().references(() => users.id, { onDelete: "set null" }),
  status: invitationStatusEnum().default("pending").notNull(),
  message: text(),
  expiresAt: timestamp({ mode: "date", withTimezone: true }),
  acceptedAt: timestamp({ mode: "date", withTimezone: true }),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
});

export const verificationTypeEnum = pgEnum("verification_type", [
  "email",
  "phone",
]);

export const verificationCodes = pgTable("verification_codes", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id, { onDelete: "cascade" }),
  type: verificationTypeEnum().notNull(),
  code: text().notNull(),
  consumedAt: timestamp({ mode: "date", withTimezone: true }),
  expiresAt: timestamp({ mode: "date", withTimezone: true }).notNull(),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
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

export const workoutTemplateExerciseGroup = pgTable(
  "workout_template_exercise_group",
  {
    id: uuid().primaryKey().defaultRandom(),
    workoutTemplateId: uuid().references(() => workoutTemplates.id, {
      onDelete: "cascade",
    }),
    name: varchar({ length: 100 }),
    notes: text(),
    groupOrder: integer().notNull(),
    createdAt: timestamp({ mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp({ mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(now),
  }
);

export const workoutTemplateExercises = pgTable("workout_template_exercises", {
  id: uuid().primaryKey().defaultRandom(),
  workoutTemplateId: uuid().references(() => workoutTemplates.id, {
    onDelete: "cascade",
  }),
  groupId: integer().notNull(),
  groupOrder: integer().notNull(),
  exerciseOrder: integer().notNull(),
  notes: text(),

  setsMin: integer(),
  setsMax: integer(),

  repsMin: integer(),
  repsMax: integer(),

  restMin: integer(),
  restMax: integer(),

  tempoMin: integer(),
  tempoMax: integer(),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
});

export const workouts = pgTable("workouts", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id, { onDelete: "cascade" }),
  assignedByUserId: uuid().references(() => users.id, { onDelete: "set null" }),
  organizationId: uuid().references(() => organizations.id, {
    onDelete: "set null",
  }),
  name: varchar({ length: 100 }),
  notes: text(),
  scheduledAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  startedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  finishedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
});

export const workoutExerciseGroups = pgTable("workout_exercise_groups", {
  id: uuid().primaryKey().defaultRandom(),
  workoutId: uuid().references(() => workouts.id, {
    onDelete: "cascade",
  }),
  name: varchar({ length: 100 }),
  notes: text(),
  groupOrder: integer().notNull(),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
});

export const workoutExercises = pgTable("workout_exercises", {
  id: uuid().primaryKey().defaultRandom(),
  workoutId: uuid().references(() => workouts.id, {
    onDelete: "cascade",
  }),
  exerciseId: uuid().references(() => exercises.id, {
    onDelete: "restrict",
  }),
  groupId: integer().notNull(),
  groupOrder: integer().notNull(),
  exerciseOrder: integer().notNull(),
  notes: text(),

  setsMin: integer(),
  setsMax: integer(),

  repsMin: integer(),
  repsMax: integer(),

  restMin: integer(),
  restMax: integer(),

  tempoMin: integer(),
  tempoMax: integer(),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
});

export const workoutExerciseSets = pgTable("workout_exercise_sets", {
  id: uuid().primaryKey().defaultRandom(),
  workoutExerciseId: uuid().references(() => workoutExercises.id, {
    onDelete: "cascade",
  }),

  setIndex: integer(),
  weight: integer(),

  reps: integer(),
  rest: integer(),
  tempo: integer(),

  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(now),
});

export const exerciseCategories = pgTable("exercise_categories", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 100 }),
  description: text(),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: uuid().primaryKey().defaultRandom(),
  createdByUserId: uuid().references(() => users.id, { onDelete: "set null" }),
  organizationId: uuid().references(() => organizations.id, {
    onDelete: "set null",
  }),
  name: varchar({ length: 100 }),
  muscleGroup: varchar({ length: 100 }),
  description: text(),
  videoFileId: uuid().references(() => files.id, { onDelete: "restrict" }),
  externalVideoUrl: text(),
  categoryId: uuid().references(() => exerciseCategories.id, {
    onDelete: "restrict",
  }),
  archived: boolean().default(false),
  isPublic: boolean().default(false),
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

// Relations
export const userRelations = relations(users, ({ many, one }) => ({
  heightEntries: many(heightEntries),
  weightEntries: many(weightEntries),
  workouts: many(workouts),
  organizations: many(userOrganization),
  coachAthletesAsCoach: many(coachAthlete, { relationName: "coach" }),
  coachAthletesAsAthlete: many(coachAthlete, { relationName: "athlete" }),
  workoutSplits: many(workoutSplits),
  workoutTemplates: many(workoutTemplates),
  exercises: many(exercises),
  files: many(files),
  invitationsSent: many(invitations, { relationName: "invitedBy" }),
  invitationsAccepted: many(invitations, { relationName: "acceptedBy" }),
  verificationCodes: many(verificationCodes),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedByUserId],
    references: [users.id],
    relationName: "invitedBy",
  }),
  acceptedBy: one(users, {
    fields: [invitations.acceptedByUserId],
    references: [users.id],
    relationName: "acceptedBy",
  }),
  role: one(roles, {
    fields: [invitations.role],
    references: [roles.name],
  }),
}));

export const verificationCodesRelations = relations(
  verificationCodes,
  ({ one }) => ({
    user: one(users, {
      fields: [verificationCodes.userId],
      references: [users.id],
    }),
  })
);

export const weightEntriesRelations = relations(weightEntries, ({ one }) => ({
  user: one(users, { fields: [weightEntries.userId], references: [users.id] }),
}));

export const heightEntriesRelations = relations(heightEntries, ({ one }) => ({
  user: one(users, { fields: [heightEntries.userId], references: [users.id] }),
}));

export const organizationRelations = relations(
  organizations,
  ({ many, one }) => ({
    users: many(userOrganization),
    coaches: many(coachAthlete),
    workoutSplits: many(workoutSplits),
    workoutTemplates: many(workoutTemplates),
    workouts: many(workouts),
    exercises: many(exercises),
    imageFile: one(files, {
      fields: [organizations.imageFileId],
      references: [files.id],
    }),
  })
);

export const rolesRelations = relations(roles, ({ many }) => ({
  userOrganizations: many(userOrganization),
}));

export const userOrganizationRelations = relations(
  userOrganization,
  ({ one }) => ({
    user: one(users, {
      fields: [userOrganization.userId],
      references: [users.id],
    }),
    organization: one(organizations, {
      fields: [userOrganization.organizationId],
      references: [organizations.id],
    }),
    role: one(roles, {
      fields: [userOrganization.role],
      references: [roles.name],
    }),
  })
);

export const coachAthleteRelations = relations(coachAthlete, ({ one }) => ({
  coach: one(users, {
    fields: [coachAthlete.coachUserId],
    references: [users.id],
  }),
  athlete: one(users, {
    fields: [coachAthlete.athleteUserId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [coachAthlete.organizationId],
    references: [organizations.id],
  }),
}));

export const workoutSplitsRelations = relations(
  workoutSplits,
  ({ one, many }) => ({
    creator: one(users, {
      fields: [workoutSplits.createdByUserId],
      references: [users.id],
    }),
    organization: one(organizations, {
      fields: [workoutSplits.organizationId],
      references: [organizations.id],
    }),
    days: many(workoutSplitDays),
  })
);

export const workoutSplitDaysRelations = relations(
  workoutSplitDays,
  ({ one }) => ({
    workoutSplit: one(workoutSplits, {
      fields: [workoutSplitDays.workoutSplitId],
      references: [workoutSplits.id],
    }),
    workoutTemplate: one(workoutTemplates, {
      fields: [workoutSplitDays.workoutTemplateId],
      references: [workoutTemplates.id],
    }),
  })
);

export const workoutTemplatesRelations = relations(
  workoutTemplates,
  ({ one, many }) => ({
    creator: one(users, {
      fields: [workoutTemplates.createdByUserId],
      references: [users.id],
    }),
    organization: one(organizations, {
      fields: [workoutTemplates.organizationId],
      references: [organizations.id],
    }),
    createdInSplit: one(workoutSplits, {
      fields: [workoutTemplates.createdInSplitId],
      references: [workoutSplits.id],
    }),
    exerciseGroups: many(workoutTemplateExerciseGroup),
    exercises: many(workoutTemplateExercises),
    splitDays: many(workoutSplitDays),
  })
);

export const workoutTemplateExerciseGroupRelations = relations(
  workoutTemplateExerciseGroup,
  ({ one, many }) => ({
    workoutTemplate: one(workoutTemplates, {
      fields: [workoutTemplateExerciseGroup.workoutTemplateId],
      references: [workoutTemplates.id],
    }),
    exercises: many(workoutTemplateExercises),
  })
);

export const workoutTemplateExercisesRelations = relations(
  workoutTemplateExercises,
  ({ one }) => ({
    workoutTemplate: one(workoutTemplates, {
      fields: [workoutTemplateExercises.workoutTemplateId],
      references: [workoutTemplates.id],
    }),
  })
);

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  user: one(users, { fields: [workouts.userId], references: [users.id] }),
  assignedBy: one(users, {
    fields: [workouts.assignedByUserId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [workouts.organizationId],
    references: [organizations.id],
  }),
  exerciseGroups: many(workoutExerciseGroups),
}));

export const workoutExerciseGroupsRelations = relations(
  workoutExerciseGroups,
  ({ one, many }) => ({
    workout: one(workouts, {
      fields: [workoutExerciseGroups.workoutId],
      references: [workouts.id],
    }),
    exercises: many(workoutExercises),
  })
);

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one, many }) => ({
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id],
    }),
    sets: many(workoutExerciseSets),
  })
);

export const workoutExerciseSetsRelations = relations(
  workoutExerciseSets,
  ({ one }) => ({
    workoutExercise: one(workoutExercises, {
      fields: [workoutExerciseSets.workoutExerciseId],
      references: [workoutExercises.id],
    }),
  })
);

export const exerciseCategoriesRelations = relations(
  exerciseCategories,
  ({ many }) => ({
    exercises: many(exercises),
  })
);

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  creator: one(users, {
    fields: [exercises.createdByUserId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [exercises.organizationId],
    references: [organizations.id],
  }),
  category: one(exerciseCategories, {
    fields: [exercises.categoryId],
    references: [exerciseCategories.id],
  }),
  videoFile: one(files, {
    fields: [exercises.videoFileId],
    references: [files.id],
  }),
  workoutExercises: many(workoutExercises),
}));

export const filesRelations = relations(files, ({ one, many }) => ({
  user: one(users, { fields: [files.userId], references: [users.id] }),
  organizations: many(organizations),
  exercises: many(exercises),
}));
