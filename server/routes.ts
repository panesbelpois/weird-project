import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWishSchema, insertGradeSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Submit a wish
  app.post("/api/wishes", async (req, res) => {
    try {
      const wishData = insertWishSchema.parse(req.body);
      const wish = await storage.createWish(wishData);
      res.json(wish);
    } catch (error) {
      res.status(400).json({ message: "Invalid wish data" });
    }
  });

  // Submit grades
  app.post("/api/grades", async (req, res) => {
    try {
      const gradeData = insertGradeSchema.parse(req.body);
      const grade = await storage.createGrade(gradeData);
      res.json(grade);
    } catch (error) {
      res.status(400).json({ message: "Invalid grade data" });
    }
  });

  // Get all wishes
  app.get("/api/wishes", async (req, res) => {
    const wishes = await storage.getWishes();
    res.json(wishes);
  });

  // Get all grades
  app.get("/api/grades", async (req, res) => {
    const grades = await storage.getGrades();
    res.json(grades);
  });

  const httpServer = createServer(app);
  return httpServer;
}
