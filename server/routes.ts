import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertPostSchema, insertCommentSchema } from "@shared/schema";
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

  // Posts API routes
  
  // Get all posts
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      
      // Transform to match frontend interface
      const formattedPosts = posts.map(post => ({
        id: post.id.toString(),
        title: post.title,
        content: post.content,
        timestamp: formatTimestamp(post.timestamp),
        author: post.user.username,
        avatar: post.user.avatar,
        color: post.user.color,
        likes: post.likes,
        commentCount: post.commentCount
      }));
      
      res.json(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  // Create a new post
  app.post("/api/posts", async (req, res) => {
    try {
      const result = insertPostSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).message 
        });
      }

      const post = await storage.createPost(result.data);
      const user = await storage.getUser(result.data.userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return formatted post
      const formattedPost = {
        id: post.id.toString(),
        title: post.title,
        content: post.content,
        timestamp: formatTimestamp(post.timestamp),
        author: user.username,
        avatar: user.avatar,
        color: user.color,
        likes: post.likes,
        commentCount: 0
      };

      res.status(201).json(formattedPost);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  // Get post by ID with comments
  app.get("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPostById(postId);
      
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const comments = await storage.getCommentsByPostId(postId);
      
      const formattedPost = {
        id: post.id.toString(),
        title: post.title,
        content: post.content,
        timestamp: formatTimestamp(post.timestamp),
        author: post.user.username,
        avatar: post.user.avatar,
        color: post.user.color,
        likes: post.likes,
        comments: comments.map(comment => ({
          id: comment.id.toString(),
          content: comment.content,
          timestamp: formatTimestamp(comment.timestamp),
          author: comment.user.username,
          avatar: comment.user.avatar,
          color: comment.user.color
        }))
      };

      res.json(formattedPost);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  // Add comment to post
  app.post("/api/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const result = insertCommentSchema.safeParse({
        ...req.body,
        postId
      });
      
      if (!result.success) {
        return res.status(400).json({ 
          error: fromZodError(result.error).message 
        });
      }

      const comment = await storage.createComment(result.data);
      const user = await storage.getUser(result.data.userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return formatted comment
      const formattedComment = {
        id: comment.id.toString(),
        content: comment.content,
        timestamp: formatTimestamp(comment.timestamp),
        author: user.username,
        avatar: user.avatar,
        color: user.color
      };

      res.status(201).json(formattedComment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  // Like a post
  app.post("/api/posts/:id/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      await storage.likePost(postId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ error: "Failed to like post" });
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
