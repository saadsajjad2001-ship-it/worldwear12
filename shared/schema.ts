import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: varchar("username"),
  points: integer("points").default(0),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  title: varchar("title").default("Dreamer"),
  isCreator: boolean("is_creator").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productCategoryEnum = pgEnum('product_category', ['clothing', 'accessories', 'footwear', 'armor', 'jewelry']);
export const productTypeEnum = pgEnum('product_type', ['pre_made', 'semi_custom', 'fully_custom']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
export const designStatusEnum = pgEnum('design_status', ['submitted', 'under_review', 'approved', 'in_production', 'rejected']);

// Products table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  category: productCategoryEnum("category").notNull(),
  type: productTypeEnum("type").notNull(),
  inspiration: varchar("inspiration"), // K-Drama, Anime, Fantasy, etc.
  imageUrl: varchar("image_url"),
  tags: text("tags").array(),
  isAvailable: boolean("is_available").default(true),
  isFeatured: boolean("is_featured").default(false),
  creatorId: varchar("creator_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Custom design requests
export const customDesigns = pgTable("custom_designs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  designType: productCategoryEnum("design_type").notNull(),
  description: text("description").notNull(),
  inspirationSources: text("inspiration_sources").array(),
  budgetRange: varchar("budget_range").notNull(),
  referenceImages: text("reference_images").array(),
  status: designStatusEnum("status").default('submitted'),
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }),
  designerNotes: text("designer_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Creator submissions for Imagination Lab
export const creatorSubmissions = pgTable("creator_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  category: productCategoryEnum("category").notNull(),
  conceptImages: text("concept_images").array(),
  status: designStatusEnum("status").default('submitted'),
  votes: integer("votes").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('0'),
  royaltyPercentage: decimal("royalty_percentage", { precision: 5, scale: 2 }).default('15'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").default('pending'),
  shippingAddress: text("shipping_address"),
  trackingNumber: varchar("tracking_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  productId: varchar("product_id").references(() => products.id),
  customDesignId: varchar("custom_design_id").references(() => customDesigns.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  customizations: jsonb("customizations"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Missions/quests for gamification
export const missions = pgTable("missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(), // lore_quiz, purchase, design_submission, etc.
  xpReward: integer("xp_reward").default(0),
  pointsReward: integer("points_reward").default(0),
  requirements: jsonb("requirements"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User mission progress
export const userMissions = pgTable("user_missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  missionId: varchar("mission_id").notNull().references(() => missions.id),
  progress: integer("progress").default(0),
  maxProgress: integer("max_progress").notNull(),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Shopping cart
export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  productId: varchar("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  customizations: jsonb("customizations"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  orders: many(orders),
  customDesigns: many(customDesigns),
  creatorSubmissions: many(creatorSubmissions),
  userMissions: many(userMissions),
  cartItems: many(cartItems),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  creator: one(users, {
    fields: [products.creatorId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  customDesign: one(customDesigns, {
    fields: [orderItems.customDesignId],
    references: [customDesigns.id],
  }),
}));

export const customDesignsRelations = relations(customDesigns, ({ one, many }) => ({
  user: one(users, {
    fields: [customDesigns.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const creatorSubmissionsRelations = relations(creatorSubmissions, ({ one }) => ({
  creator: one(users, {
    fields: [creatorSubmissions.creatorId],
    references: [users.id],
  }),
}));

export const userMissionsRelations = relations(userMissions, ({ one }) => ({
  user: one(users, {
    fields: [userMissions.userId],
    references: [users.id],
  }),
  mission: one(missions, {
    fields: [userMissions.missionId],
    references: [missions.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomDesignSchema = createInsertSchema(customDesigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const insertCreatorSubmissionSchema = createInsertSchema(creatorSubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  votes: true,
  rating: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type CustomDesign = typeof customDesigns.$inferSelect;
export type InsertCustomDesign = z.infer<typeof insertCustomDesignSchema>;
export type CreatorSubmission = typeof creatorSubmissions.$inferSelect;
export type InsertCreatorSubmission = z.infer<typeof insertCreatorSubmissionSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type Mission = typeof missions.$inferSelect;
export type UserMission = typeof userMissions.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
