import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

// In-memory store for OTP (in production, use database)
// For demo purposes, we'll use a simple OTP generation
const otpStore = new Map<string, { otp: string; expiresAt: Date; attempts: number }>();

// Generate a simple 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP endpoint
const sendOTPHandler = async (req: any, res: any): Promise<void> => {
  try {
    const { phone, channel = "sms", purpose = "login" } = req.body;

    if (!phone) {
      res.status(400).json({ message: "Phone number is required" });
      return;
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP (in production, hash the OTP before storing)
    otpStore.set(phone, { otp, expiresAt, attempts: 0 });

    // In production, integrate with SMS/WhatsApp provider here
    // For demo, log the OTP
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ 
      success: true, 
      message: "OTP sent successfully",
      // Remove this in production - only for demo
      otp: otp 
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Verify OTP endpoint
const verifyOTPHandler = async (req: any, res: any) => {
  try {
    const { phone, otp, name } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone number and OTP are required" });
    }

    const storedOTP = otpStore.get(phone);

    if (!storedOTP) {
      return res.status(400).json({ message: "OTP not found or expired. Please request a new OTP." });
    }

    // Check if OTP is expired
    if (new Date() > storedOTP.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }

    // Check attempts
    if (storedOTP.attempts >= 5) {
      otpStore.delete(phone);
      return res.status(400).json({ message: "Too many failed attempts. Please request a new OTP." });
    }

    // Verify OTP
    if (storedOTP.otp !== otp) {
      storedOTP.attempts++;
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // OTP verified successfully
    // In production, create a proper session/token here
    const token = `demo_token_${Date.now()}`;
    const userId = `user_${phone.slice(-4)}`;

    // Delete the used OTP
    otpStore.delete(phone);

    // If this is a new user (signup), create user record
    // In production, integrate with your user database

    res.json({
      success: true,
      message: "OTP verified successfully",
      token,
      userId,
      phone
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Only setup auth if REPL_ID is configured (for Replit deployment)
  if (process.env.REPL_ID) {
    await setupAuth(app);
    registerAuthRoutes(app);
  }

  // OTP Authentication Routes
  app.post("/api/auth/send-otp", sendOTPHandler);
  app.post("/api/auth/verify-otp", verifyOTPHandler);

  // Products
  app.get(api.products.list.path, async (req, res) => {
    try {
      const queryParams = req.query as any;
      const products = await storage.getProducts(queryParams);
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.products.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Categories
  app.get(api.categories.list.path, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Orders
  app.get(api.orders.list.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.orders.get.path, isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const userId = req.user.claims.sub;
      if (order.userId !== userId) {
         return res.status(401).json({ message: "Unauthorized" });
      }
      
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.orders.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(userId, input);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Addresses
  app.get(api.addresses.list.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const addresses = await storage.getAddresses(userId);
      res.json(addresses);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.addresses.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.addresses.create.input.parse(req.body);
      const address = await storage.createAddress(userId, { ...input, userId });
      res.status(201).json(address);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Optional: Seed database endpoint for easy setup
  // Note: This requires a local PostgreSQL database
  // For Supabase, data is managed in the Supabase dashboard
  
  return httpServer;
}

