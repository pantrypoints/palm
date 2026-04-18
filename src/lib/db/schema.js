import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  passwordHash: text('password_hash').notNull(),
  avatar: text('avatar'),
  kind: text('kind'), // admin or not
  gender: text('gender').notNull(),
  dateOfBirth: text('date_of_birth'),
  job: text('job'),
  handed: text('handed'), // l or r
  leftPalmUrl: text('left_palm_url'),
  rightPalmUrl: text('right_palm_url'),
  dateCreated: text('date_created').default(sql`(CURRENT_TIMESTAMP)`),
  dateModified: text('date_modified').default(sql`(CURRENT_TIMESTAMP)`)
});

export const questions = sqliteTable('questions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  userId: integer('user_id').notNull().references(() => user.id),
  dateCreated: text('date_created').default(sql`(CURRENT_TIMESTAMP)`),
  dateModified: text('date_modified').default(sql`(CURRENT_TIMESTAMP)`)
});

export const answers = sqliteTable('answers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  qid: integer('qid').notNull().references(() => questions.id),
  dateCreated: text('date_created').default(sql`(CURRENT_TIMESTAMP)`),
  dateModified: text('date_modified').default(sql`(CURRENT_TIMESTAMP)`)
});
