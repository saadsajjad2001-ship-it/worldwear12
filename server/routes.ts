import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertProductSchema,
  insertCustomDesignSchema,
  insertCreatorSubmissionSchema,
  insertCartItemSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const { category, type, inspiration, search, featured } = req.query;
      const products = await storage.getProducts({
        category: category as string,
        type: type as string,
        inspiration: inspiration as string,
        search: search as string,
        featured: featured === 'true',
      });
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', isAuthenticated, async (req: any, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      productData.creatorId = req.user.claims.sub;
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Custom design routes
  app.get('/api/custom-designs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const designs = await storage.getCustomDesigns(userId);
      res.json(designs);
    } catch (error) {
      console.error("Error fetching custom designs:", error);
      res.status(500).json({ message: "Failed to fetch custom designs" });
    }
  });

  app.post('/api/custom-designs', isAuthenticated, async (req: any, res) => {
    try {
      const designData = insertCustomDesignSchema.parse(req.body);
      designData.userId = req.user.claims.sub;
      const design = await storage.createCustomDesign(designData);
      
      // Award XP and points for submitting a custom design
      await storage.updateUserStats(req.user.claims.sub, 50, 25);
      
      res.status(201).json(design);
    } catch (error) {
      console.error("Error creating custom design:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid design data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create custom design" });
    }
  });

  app.get('/api/custom-designs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const design = await storage.getCustomDesign(req.params.id);
      if (!design) {
        return res.status(404).json({ message: "Custom design not found" });
      }
      
      // Check if user owns this design or is admin
      if (design.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(design);
    } catch (error) {
      console.error("Error fetching custom design:", error);
      res.status(500).json({ message: "Failed to fetch custom design" });
    }
  });

  // Creator submission routes
  app.get('/api/creator-submissions', async (req, res) => {
    try {
      const { status } = req.query;
      const submissions = await storage.getCreatorSubmissions(status as string);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching creator submissions:", error);
      res.status(500).json({ message: "Failed to fetch creator submissions" });
    }
  });

  app.post('/api/creator-submissions', isAuthenticated, async (req: any, res) => {
    try {
      const submissionData = insertCreatorSubmissionSchema.parse(req.body);
      submissionData.creatorId = req.user.claims.sub;
      const submission = await storage.createCreatorSubmission(submissionData);
      
      // Award XP and points for creator submission
      await storage.updateUserStats(req.user.claims.sub, 100, 50);
      
      res.status(201).json(submission);
    } catch (error) {
      console.error("Error creating creator submission:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid submission data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create creator submission" });
    }
  });

  app.post('/api/creator-submissions/:id/vote', isAuthenticated, async (req: any, res) => {
    try {
      const { increment } = req.body;
      if (increment !== 1 && increment !== -1) {
        return res.status(400).json({ message: "Vote increment must be 1 or -1" });
      }
      
      const submission = await storage.voteOnSubmission(req.params.id, increment);
      res.json(submission);
    } catch (error) {
      console.error("Error voting on submission:", error);
      res.status(500).json({ message: "Failed to vote on submission" });
    }
  });

  // Cart routes
  app.get('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItems = await storage.getUserCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const cartData = insertCartItemSchema.parse(req.body);
      cartData.userId = req.user.claims.sub;
      const cartItem = await storage.addToCart(cartData);
      res.status(201).json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put('/api/cart/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { quantity } = req.body;
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be a positive integer" });
      }
      
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete('/api/cart/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.removeFromCart(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // Mission routes
  app.get('/api/missions', async (req, res) => {
    try {
      const missions = await storage.getActiveMissions();
      res.json(missions);
    } catch (error) {
      console.error("Error fetching missions:", error);
      res.status(500).json({ message: "Failed to fetch missions" });
    }
  });

  app.get('/api/user-missions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userMissions = await storage.getUserMissions(userId);
      res.json(userMissions);
    } catch (error) {
      console.error("Error fetching user missions:", error);
      res.status(500).json({ message: "Failed to fetch user missions" });
    }
  });

  app.post('/api/user-missions/:missionId/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { progress } = req.body;
      
      const userMission = await storage.updateMissionProgress(userId, req.params.missionId, progress);
      res.json(userMission);
    } catch (error) {
      console.error("Error updating mission progress:", error);
      res.status(500).json({ message: "Failed to update mission progress" });
    }
  });

  // User stats routes
  app.post('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { xp, points } = req.body;
      
      const user = await storage.updateUserStats(userId, xp || 0, points || 0);
      res.json(user);
    } catch (error) {
      console.error("Error updating user stats:", error);
      res.status(500).json({ message: "Failed to update user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
