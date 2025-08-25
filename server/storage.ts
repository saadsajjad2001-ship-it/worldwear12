import {
  users,
  products,
  customDesigns,
  creatorSubmissions,
  orders,
  orderItems,
  missions,
  userMissions,
  cartItems,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type CustomDesign,
  type InsertCustomDesign,
  type CreatorSubmission,
  type InsertCreatorSubmission,
  type Order,
  type InsertOrder,
  type OrderItem,
  type Mission,
  type UserMission,
  type CartItem,
  type InsertCartItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, like, ilike } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Product operations
  getProducts(filters?: {
    category?: string;
    type?: string;
    inspiration?: string;
    search?: string;
    featured?: boolean;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product>;
  
  // Custom design operations
  getCustomDesigns(userId?: string): Promise<CustomDesign[]>;
  getCustomDesign(id: string): Promise<CustomDesign | undefined>;
  createCustomDesign(design: InsertCustomDesign): Promise<CustomDesign>;
  updateCustomDesignStatus(id: string, status: string, estimatedPrice?: string, designerNotes?: string): Promise<CustomDesign>;
  
  // Creator operations
  getCreatorSubmissions(status?: string): Promise<CreatorSubmission[]>;
  getCreatorSubmission(id: string): Promise<CreatorSubmission | undefined>;
  createCreatorSubmission(submission: InsertCreatorSubmission): Promise<CreatorSubmission>;
  updateCreatorSubmission(id: string, updates: Partial<CreatorSubmission>): Promise<CreatorSubmission>;
  voteOnSubmission(id: string, increment: number): Promise<CreatorSubmission>;
  
  // Order operations
  getUserOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(orderId: string, item: Omit<OrderItem, 'id' | 'orderId' | 'createdAt'>): Promise<OrderItem>;
  
  // Cart operations
  getUserCartItems(userId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
  clearUserCart(userId: string): Promise<void>;
  
  // Mission operations
  getActiveMissions(): Promise<Mission[]>;
  getUserMissions(userId: string): Promise<UserMission[]>;
  createUserMission(userId: string, missionId: string, maxProgress: number): Promise<UserMission>;
  updateMissionProgress(userId: string, missionId: string, progress: number): Promise<UserMission>;
  
  // User stats
  updateUserStats(userId: string, xp: number, points: number): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Product operations
  async getProducts(filters: {
    category?: string;
    type?: string;
    inspiration?: string;
    search?: string;
    featured?: boolean;
  } = {}): Promise<Product[]> {
    let query = db.select().from(products).where(eq(products.isAvailable, true));
    
    const conditions = [eq(products.isAvailable, true)];
    
    if (filters.category) {
      conditions.push(eq(products.category, filters.category as any));
    }
    if (filters.type) {
      conditions.push(eq(products.type, filters.type as any));
    }
    if (filters.inspiration) {
      conditions.push(eq(products.inspiration, filters.inspiration));
    }
    if (filters.featured) {
      conditions.push(eq(products.isFeatured, true));
    }
    if (filters.search) {
      conditions.push(
        ilike(products.name, `%${filters.search}%`)
      );
    }
    
    return await db.select().from(products).where(and(...conditions)).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  // Custom design operations
  async getCustomDesigns(userId?: string): Promise<CustomDesign[]> {
    if (userId) {
      return await db.select().from(customDesigns).where(eq(customDesigns.userId, userId)).orderBy(desc(customDesigns.createdAt));
    }
    return await db.select().from(customDesigns).orderBy(desc(customDesigns.createdAt));
  }

  async getCustomDesign(id: string): Promise<CustomDesign | undefined> {
    const [design] = await db.select().from(customDesigns).where(eq(customDesigns.id, id));
    return design;
  }

  async createCustomDesign(design: InsertCustomDesign): Promise<CustomDesign> {
    const [newDesign] = await db.insert(customDesigns).values(design).returning();
    return newDesign;
  }

  async updateCustomDesignStatus(
    id: string, 
    status: string, 
    estimatedPrice?: string, 
    designerNotes?: string
  ): Promise<CustomDesign> {
    const updates: any = { status: status as any, updatedAt: new Date() };
    if (estimatedPrice) updates.estimatedPrice = estimatedPrice;
    if (designerNotes) updates.designerNotes = designerNotes;
    
    const [design] = await db
      .update(customDesigns)
      .set(updates)
      .where(eq(customDesigns.id, id))
      .returning();
    return design;
  }

  // Creator operations
  async getCreatorSubmissions(status?: string): Promise<CreatorSubmission[]> {
    let query = db.select().from(creatorSubmissions);
    if (status) {
      query = query.where(eq(creatorSubmissions.status, status as any));
    }
    return await query.orderBy(desc(creatorSubmissions.createdAt));
  }

  async getCreatorSubmission(id: string): Promise<CreatorSubmission | undefined> {
    const [submission] = await db.select().from(creatorSubmissions).where(eq(creatorSubmissions.id, id));
    return submission;
  }

  async createCreatorSubmission(submission: InsertCreatorSubmission): Promise<CreatorSubmission> {
    const [newSubmission] = await db.insert(creatorSubmissions).values(submission).returning();
    return newSubmission;
  }

  async updateCreatorSubmission(id: string, updates: Partial<CreatorSubmission>): Promise<CreatorSubmission> {
    const [submission] = await db
      .update(creatorSubmissions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(creatorSubmissions.id, id))
      .returning();
    return submission;
  }

  async voteOnSubmission(id: string, increment: number): Promise<CreatorSubmission> {
    const [submission] = await db
      .update(creatorSubmissions)
      .set({ 
        votes: sql`${creatorSubmissions.votes} + ${increment}`,
        updatedAt: new Date()
      })
      .where(eq(creatorSubmissions.id, id))
      .returning();
    return submission;
  }

  // Order operations
  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async addOrderItem(orderId: string, item: Omit<OrderItem, 'id' | 'orderId' | 'createdAt'>): Promise<OrderItem> {
    const [orderItem] = await db.insert(orderItems).values({
      ...item,
      orderId,
    }).returning();
    return orderItem;
  }

  // Cart operations
  async getUserCartItems(userId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId)).orderBy(desc(cartItems.createdAt));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const [cartItem] = await db.insert(cartItems).values(item).returning();
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem> {
    const [cartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return cartItem;
  }

  async removeFromCart(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearUserCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Mission operations
  async getActiveMissions(): Promise<Mission[]> {
    return await db.select().from(missions).where(eq(missions.isActive, true));
  }

  async getUserMissions(userId: string): Promise<UserMission[]> {
    return await db.select().from(userMissions).where(eq(userMissions.userId, userId));
  }

  async createUserMission(userId: string, missionId: string, maxProgress: number): Promise<UserMission> {
    const [userMission] = await db.insert(userMissions).values({
      userId,
      missionId,
      maxProgress,
      progress: 0,
    }).returning();
    return userMission;
  }

  async updateMissionProgress(userId: string, missionId: string, progress: number): Promise<UserMission> {
    const [userMission] = await db
      .update(userMissions)
      .set({ 
        progress,
        isCompleted: sql`${progress} >= ${userMissions.maxProgress}`,
        completedAt: sql`CASE WHEN ${progress} >= ${userMissions.maxProgress} THEN NOW() ELSE ${userMissions.completedAt} END`,
      })
      .where(and(eq(userMissions.userId, userId), eq(userMissions.missionId, missionId)))
      .returning();
    return userMission;
  }

  // User stats
  async updateUserStats(userId: string, xp: number, points: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        xp: sql`${users.xp} + ${xp}`,
        points: sql`${users.points} + ${points}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    // Check for level up (simplified: 1000 XP per level)
    const newLevel = Math.floor((user.xp || 0) / 1000) + 1;
    if (newLevel > (user.level || 0)) {
      const [leveledUser] = await db
        .update(users)
        .set({ level: newLevel, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
      return leveledUser;
    }
    
    return user;
  }
}

export const storage = new DatabaseStorage();
