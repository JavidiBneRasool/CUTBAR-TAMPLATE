import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { fromZodError } from 'zod-validation-error';

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat API routes
  
  // Get all messages
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      
      // Transform to match frontend interface
      const formattedMessages = messages.map(msg => ({
        id: msg.id.toString(),
        content: msg.content,
        timestamp: formatTimestamp(msg.timestamp),
        author: msg.user.username,
        avatar: msg.user.avatar,
        color: msg.user.color
      }));
      
      res.json(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Create a new message
  app.post("/api/messages", async (req, res) => {
    try {
      const result = insertMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).message 
        });
      }

      const message = await storage.createMessage(result.data);
      const user = await storage.getUser(result.data.userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return formatted message
      const formattedMessage = {
        id: message.id.toString(),
        content: message.content,
        timestamp: formatTimestamp(message.timestamp),
        author: user.username,
        avatar: user.avatar,
        color: user.color
      };

      res.status(201).json(formattedMessage);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function formatTimestamp(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
