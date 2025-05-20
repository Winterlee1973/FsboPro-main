import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./firebaseAuth";
import Stripe from "stripe";
import { z } from "zod";
const schema = require("./shared/schema");

const {
  insertPropertySchema,
  insertPropertyImageSchema,
  insertPropertyFeatureSchema,
  insertMessageSchema,
  insertOfferSchema
} = schema;

// Initialize Stripe if secret key is available
let stripe: Stripe | undefined;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn("Missing STRIPE_SECRET_KEY - payment features will be disabled");
}

export async function registerRoutes(app: Express): Promise<void> { // Changed return type to void as Server isn't needed in Functions
  // Auth middleware
  await setupAuth(app);

  // Ping route for testing
  app.get('/api/ping', (req, res) => {
    res.status(200).send('pong');
  });

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

  // Update user type (buyer/seller/admin)
  app.post('/api/users/type', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { userType } = req.body;

      if (!userType || !['buyer', 'seller', 'admin'].includes(userType)) {
        return res.status(400).json({ message: "Invalid user type" });
      }

      const updatedUser = await storage.updateUserType(userId, userType);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user type:", error);
      res.status(500).json({ message: "Failed to update user type" });
    }
  });

  // Property routes
  app.post('/api/properties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // Validate the request data
      const propertyData = insertPropertySchema.parse({
        ...req.body,
        userId
      });

      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: "Invalid property data", error: error.message });
      }
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.get('/api/properties', async (req, res) => {
    try {
      const query = {
        location: req.query.location as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        propertyType: req.query.propertyType as string,
        minBeds: req.query.minBeds ? Number(req.query.minBeds) : undefined,
        minBaths: req.query.minBaths ? Number(req.query.minBaths) : undefined,
        status: req.query.status as string,
        premiumOnly: req.query.premiumOnly === 'true',
        limit: req.query.limit ? Number(req.query.limit) : 50
      };

      const properties = await storage.searchProperties(query);
      res.json(properties);
    } catch (error) {
      console.error("Error searching properties:", error);
      res.status(500).json({ message: "Failed to search properties" });
    }
  });

  app.get('/api/properties/featured', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const featuredProperties = await storage.getFeaturedProperties(limit);
      res.json(featuredProperties);
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      res.status(500).json({ message: "Failed to fetch featured properties" });
    }
  });

  app.get('/api/properties/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      // Sample property data for ID 11743
      if (id === 11743) {
        return res.json({
          id: 11743,
          userId: "36324920",
          title: "Luxury Waterfront Home with Private Dock",
          description: "This stunning waterfront property offers breathtaking views and luxury living at its finest. With 5 bedrooms, 4.5 bathrooms, and over 4,000 square feet of living space, this home is perfect for families and entertaining. Features include a gourmet kitchen with high-end appliances, a spacious primary suite with lake views, and a finished basement with a home theater. The outdoor space is equally impressive with a private dock, outdoor kitchen, and infinity pool. Located in a sought-after neighborhood with excellent schools and just minutes from shopping and dining.",
          price: 1250000,
          address: "123 Lakeshore Drive",
          city: "Lakeside",
          state: "CA",
          zipCode: "90210",
          latitude: 34.0522,
          longitude: -118.2437,
          bedrooms: 5,
          bathrooms: 4.5,
          squareFeet: 4200,
          lotSize: 0.75,
          yearBuilt: 2015,
          propertyType: "House",
          status: "Active",
          isPremium: true,
          premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          featuredImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          viewCount: 253,
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        });
      }

      const property = await storage.getProperty(id);

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Increment view count
      await storage.incrementPropertyViews(id);

      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.get('/api/users/:userId/properties', isAuthenticated, async (req: any, res) => {
    try {
      // Only allow users to see their own properties or admins to see anyone's
      const currentUserId = req.user.claims.sub;
      const requestedUserId = req.params.userId;

      if (currentUserId !== requestedUserId && req.user.userType !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const properties = await storage.getUserProperties(requestedUserId);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching user properties:", error);
      res.status(500).json({ message: "Failed to fetch user properties" });
    }
  });

  app.put('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      // Check if property exists and belongs to the user
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      if (property.userId !== userId && req.user.userType !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updatedPropertyData = req.body;
      delete updatedPropertyData.id;
      delete updatedPropertyData.userId;

      const updatedProperty = await storage.updateProperty(id, updatedPropertyData);
      res.json(updatedProperty);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.delete('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      // Check if property exists and belongs to the user
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      if (property.userId !== userId && req.user.userType !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const success = await storage.deleteProperty(id);

      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete property" });
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Property images routes
  app.post('/api/properties/:id/images', isAuthenticated, async (req: any, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      // Check if property exists and belongs to the user
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      if (property.userId !== userId && req.user.userType !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const imageData = insertPropertyImageSchema.parse({
        ...req.body,
        propertyId
      });

      const image = await storage.addPropertyImage(imageData);
      res.status(201).json(image);
    } catch (error) {
      console.error("Error adding property image:", error);
      res.status(500).json({ message: "Failed to add property image" });
    }
  });

  app.get('/api/properties/:id/images', async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);

      // Sample property images for ID 11743
      if (propertyId === 11743) {
        return res.json([
          {
            id: 1,
            propertyId: 11743,
            imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            caption: "Front exterior view",
            isPrimary: true,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
          },
          {
            id: 2,
            propertyId: 11743,
            imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            caption: "Living room with lake view",
            isPrimary: false,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
          },
          {
            id: 3,
            propertyId: 11743,
            imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            caption: "Gourmet kitchen",
            isPrimary: false,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
          },
          {
            id: 4,
            propertyId: 11743,
            imageUrl: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            caption: "Master bedroom suite",
            isPrimary: false,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
          },
          {
            id: 5,
            propertyId: 11743,
            imageUrl: "https://images.unsplash.com/photo-1600563438938-a9a27215d8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            caption: "Outdoor patio and pool",
            isPrimary: false,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
          }
        ]);
      }

      const images = await storage.getPropertyImages(propertyId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching property images:", error);
      res.status(500).json({ message: "Failed to fetch property images" });
    }
  });

  app.delete('/api/properties/images/:id', isAuthenticated, async (req: any, res) => {
    try {
      const imageId = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      // Need to get the image first to check property ownership
      const images = await storage.getPropertyImages(parseInt(req.params.propertyId));
      const image = images.find(img => img.id === imageId);

      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Check property ownership
      const property = await storage.getProperty(image.propertyId);
      if (!property || (property.userId !== userId && req.user.userType !== 'admin')) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const success = await storage.deletePropertyImage(imageId);

      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete image" });
      }
    } catch (error) {
      console.error("Error deleting property image:", error);
      res.status(500).json({ message: "Failed to delete property image" });
    }
  });

  // Property features routes
  app.post('/api/properties/:id/features', isAuthenticated, async (req: any, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      // Check if property exists and belongs to the user
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      if (property.userId !== userId && req.user.userType !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const featureData = insertPropertyFeatureSchema.parse({
        ...req.body,
        propertyId
      });

      const feature = await storage.addPropertyFeature(featureData);
      res.status(201).json(feature);
    } catch (error) {
      console.error("Error adding property feature:", error);
      res.status(500).json({ message: "Failed to add property feature" });
    }
  });

  app.get('/api/properties/:id/features', async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);

      // Sample property features for ID 11743
      if (propertyId === 11743) {
        return res.json([
          { id: 1, propertyId: 11743, feature: "Private dock", createdAt: new Date() },
          { id: 2, propertyId: 11743, feature: "Infinity pool", createdAt: new Date() },
          { id: 3, propertyId: 11743, feature: "Outdoor kitchen", createdAt: new Date() },
          { id: 4, propertyId: 11743, feature: "Home theater", createdAt: new Date() },
          { id: 5, propertyId: 11743, feature: "Smart home system", createdAt: new Date() },
          { id: 6, propertyId: 11743, feature: "Wine cellar", createdAt: new Date() },
          { id: 7, propertyId: 11743, feature: "3-car garage", createdAt: new Date() },
          { id: 8, propertyId: 11743, feature: "Gourmet kitchen", createdAt: new Date() },
          { id: 9, propertyId: 11743, feature: "Walk-in closets", createdAt: new Date() }
        ]);
      }

      const features = await storage.getPropertyFeatures(propertyId);
      res.json(features);
    } catch (error) {
      console.error("Error fetching property features:", error);
      res.status(500).json({ message: "Failed to fetch property features" });
    }
  });

  // Message routes
  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const fromUserId = req.user.claims.sub;

      const messageData = insertMessageSchema.parse({
        ...req.body,
        fromUserId
      });

      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getUserMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get('/api/properties/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      // Check if property exists and belongs to the user
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      if (property.userId !== userId && req.user.userType !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const messages = await storage.getPropertyMessages(propertyId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching property messages:", error);
      res.status(500).json({ message: "Failed to fetch property messages" });
    }
  });

  app.get('/api/conversations/:userId/:propertyId', isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = req.user.claims.sub;
      const otherUserId = req.params.userId;
      const propertyId = parseInt(req.params.propertyId);

      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Only allow property owner or the conversation participant to access
      if (currentUserId !== property.userId && currentUserId !== otherUserId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const messages = await storage.getConversation(currentUserId, otherUserId, propertyId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.post('/api/messages/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const messageId = parseInt(req.params.id);
      const success = await storage.markMessageAsRead(messageId);

      if (success) {
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ message: "Message not found" });
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Offer routes
  app.post('/api/offers', isAuthenticated, async (req: any, res) => {
    try {
      const fromUserId = req.user.claims.sub;

      const offerData = insertOfferSchema.parse({
        ...req.body,
        fromUserId
      });

      const offer = await storage.createOffer(offerData);
      res.status(201).json(offer);
    } catch (error) {
      console.error("Error creating offer:", error);
      res.status(500).json({ message: "Failed to create offer" });
    }
  });

  app.get('/api/properties/:id/offers', isAuthenticated, async (req: any, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      // Check if property exists and belongs to the user
      const property = await storage.getProperty(propertyId);
      if (!property || (property.userId !== userId && req.user.userType !== 'admin')) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const offers = await storage.getPropertyOffers(propertyId);
      res.json(offers);
    } catch (error) {
      console.error("Error fetching property offers:", error);
      res.status(500).json({ message: "Failed to fetch property offers" });
    }
  });

  app.get('/api/users/:id/offers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requestedUserId = req.params.id;

      // Only allow users to see their own offers or admins to see anyone's
      if (userId !== requestedUserId && req.user.userType !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const offers = await storage.getUserOffers(requestedUserId);
      res.json(offers);
    } catch (error) {
      console.error("Error fetching user offers:", error);
      res.status(500).json({ message: "Failed to fetch user offers" });
    }
  });

  app.put('/api/offers/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const offerId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { status } = req.body;

      if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid offer status" });
      }

      // Check if offer exists and the user is the property owner
      const offer = await storage.getOffer(offerId);
      if (!offer) {
        return res.status(404).json({ message: "Offer not found" });
      }

      const property = await storage.getProperty(offer.propertyId);
      if (!property || (property.userId !== userId && req.user.userType !== 'admin')) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updatedOffer = await storage.updateOfferStatus(offerId, status);
      res.json(updatedOffer);
    } catch (error) {
      console.error("Error updating offer status:", error);
      res.status(500).json({ message: "Failed to update offer status" });
    }
  });

  // Stripe routes
  if (stripe) {
    app.post('/api/create-payment-intent', isAuthenticated, async (req: any, res) => {
      try {
        const { amount, currency } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: currency,
          // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
          automatic_payment_methods: {
            enabled: true,
          },
        });

        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ message: "Failed to create payment intent" });
      }
    });

    app.post('/api/premium-listing/verify', isAuthenticated, async (req: any, res) => {
      try {
        const { paymentIntentId, propertyId } = req.body;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
          // Mark the property as premium
          await storage.markPropertyAsPremium(propertyId);
          res.json({ success: true, message: "Property marked as premium" });
        } else {
          res.status(400).json({ success: false, message: "Payment not succeeded" });
        }
      } catch (error) {
        console.error("Error verifying premium listing:", error);
        res.status(500).json({ message: "Failed to verify premium listing" });
      }
    });
  }
}