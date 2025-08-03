import { type Wish, type InsertWish, type Grade, type InsertGrade } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createWish(wish: InsertWish): Promise<Wish>;
  createGrade(grade: InsertGrade): Promise<Grade>;
  getWishes(): Promise<Wish[]>;
  getGrades(): Promise<Grade[]>;
}

export class MemStorage implements IStorage {
  private wishes: Map<string, Wish>;
  private grades: Map<string, Grade>;

  constructor() {
    this.wishes = new Map();
    this.grades = new Map();
  }

  async createWish(insertWish: InsertWish): Promise<Wish> {
    const id = randomUUID();
    const wish: Wish = { 
      ...insertWish, 
      id,
      createdAt: new Date().toISOString()
    };
    this.wishes.set(id, wish);
    return wish;
  }

  async createGrade(insertGrade: InsertGrade): Promise<Grade> {
    const id = randomUUID();
    const grade: Grade = { 
      ...insertGrade, 
      id,
      createdAt: new Date().toISOString()
    };
    this.grades.set(id, grade);
    return grade;
  }

  async getWishes(): Promise<Wish[]> {
    return Array.from(this.wishes.values());
  }

  async getGrades(): Promise<Grade[]> {
    return Array.from(this.grades.values());
  }
}

export const storage = new MemStorage();
