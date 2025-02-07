import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScoreSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.get("/api/scores", async (_req, res) => {
    const scores = await storage.getTopScores(10);
    res.json(scores);
  });

  app.post("/api/scores", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Must be logged in to save scores" });
    }

    const result = insertScoreSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid score data" });
    }

    const score = await storage.createScore(result.data, req.user.id);
    res.json(score);
  });

  const httpServer = createServer(app);
  return httpServer;
}