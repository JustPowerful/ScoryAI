import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  uuid,
  boolean,
  pgEnum,
  decimal,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";

// 0 1 or 2
export const distanceEnum = pgEnum("distance", ["0", "1", "2"]);
export const motivationEnum = pgEnum("motivation", ["0", "1", "2"]);
export const schoolTypeEnum = pgEnum("school_type", ["0", "1"]);
export const genderEnum = pgEnum("gender", ["0", "1"]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstname: varchar("firstname").notNull(),
  lastname: varchar("lastname").notNull(),
  email: varchar("email").notNull(),
  password: varchar("password").notNull(),
  parental_involvment: boolean("parental_involvment").notNull().default(false),
  distance_from_home: distanceEnum("distance_from_home").notNull().default("0"),
  sleep_hours: decimal("sleep_hours").notNull(),
  motivation_level: motivationEnum("motivation_level").notNull(),
  internet_access: boolean("internet_access").notNull().default(false),
  school_type: schoolTypeEnum("school_type").notNull(),
  gender: genderEnum("gender").notNull(),
  learning_disability: boolean("learning_disability").notNull().default(false),
});

export const subjectTable = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull(),
  title: varchar("title").notNull(),
});

export const subjectRelations = relations(subjectTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [subjectTable.userId],
    references: [usersTable.id],
  }),
}));

export const predictionTable = pgTable("predictions", {
  id: uuid("id").primaryKey().defaultRandom(),
  subject_id: uuid("subject_id").notNull(),
  hours_studied: decimal("hours_studied").notNull(),
  attendance: decimal("attendance").notNull(),
  access_to_ressource: decimal("access_to_ressource").notNull(),
  tutoring_sessions: decimal("tutoring_sessions").notNull(),
  predicted_score: decimal("predicted_score").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const predictionRelations = relations(predictionTable, ({ one }) => ({
  subject: one(subjectTable, {
    fields: [predictionTable.subject_id],
    references: [subjectTable.id],
  }),
}));

export const userInsertSchema = createInsertSchema(usersTable);
export const subjectInsertSchema = createInsertSchema(subjectTable);
export const predictionInsertSchema = createInsertSchema(predictionTable);
