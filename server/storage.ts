import { users, messages, posts, comments, type User, type InsertUser, type Message, type InsertMessage, type Post, type InsertPost, type Comment, type InsertComment } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getMessages(limit?: number): Promise<(Message & { user: User })[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getPosts(limit?: number): Promise<(Post & { user: User; commentCount: number })[]>;
  createPost(post: InsertPost): Promise<Post>;
  getPostById(id: number): Promise<(Post & { user: User }) | undefined>;
  getCommentsByPostId(postId: number): Promise<(Comment & { user: User })[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  likePost(postId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getMessages(limit: number = 50): Promise<(Message & { user: User })[]> {
    const result = await db
      .select()
      .from(messages)
      .leftJoin(users, eq(messages.userId, users.id))
      .orderBy(desc(messages.timestamp))
      .limit(limit);
    
    return result.map(row => ({
      ...row.messages,
      user: row.users!
    })).reverse();
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getPosts(limit: number = 20): Promise<(Post & { user: User; commentCount: number })[]> {
    const result = await db
      .select()
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.timestamp))
      .limit(limit);
    
    // For now, we'll get comment counts in a simple way
    return result.map(row => ({
      ...row.posts,
      user: row.users!,
      commentCount: 0 // We'll calculate this properly later
    }));
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values(insertPost)
      .returning();
    return post;
  }

  async getPostById(id: number): Promise<(Post & { user: User }) | undefined> {
    const result = await db
      .select()
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, id));
    
    if (result.length === 0) return undefined;
    
    const row = result[0];
    return {
      ...row.posts,
      user: row.users!
    };
  }

  async getCommentsByPostId(postId: number): Promise<(Comment & { user: User })[]> {
    const result = await db
      .select()
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.timestamp));
    
    return result.map(row => ({
      ...row.comments,
      user: row.users!
    }));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async likePost(postId: number): Promise<void> {
    // Get current post
    const [post] = await db.select().from(posts).where(eq(posts.id, postId));
    if (post) {
      await db
        .update(posts)
        .set({ likes: post.likes + 1 })
        .where(eq(posts.id, postId));
    }
  }
}

export const storage = new DatabaseStorage();
