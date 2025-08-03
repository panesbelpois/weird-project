import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wishes = pgTable("wishes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  wish: text("wish").notNull(),
  createdAt: varchar("created_at").default(sql`now()`),
});

export const grades = pgTable("grades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subjects: json("subjects").notNull(), // Array of grade objects
  createdAt: varchar("created_at").default(sql`now()`),
});

export const insertWishSchema = createInsertSchema(wishes).omit({
  id: true,
  createdAt: true,
});

export const insertGradeSchema = createInsertSchema(grades).omit({
  id: true,
  createdAt: true,
});

export type InsertWish = z.infer<typeof insertWishSchema>;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type Wish = typeof wishes.$inferSelect;
export type Grade = typeof grades.$inferSelect;
