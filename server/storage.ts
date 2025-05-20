import {
  users,
  properties,
  propertyImages,
  propertyFeatures,
  messages,
  offers,
  premiumTransactions,
  type User,
  type UpsertUser,
  type Property,
  type InsertProperty,
  type PropertyImage,
  type InsertPropertyImage,
  type PropertyFeature,
  type InsertPropertyFeature,
  type Message,
  type InsertMessage,
  type Offer,
  type InsertOffer,
  type PremiumTransaction,
  type InsertPremiumTransaction
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, like, inArray, or, gte, lte, isNull } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserType(id: string, userType: string): Promise<User | undefined>;
  updateStripeCustomerId(userId: string, customerId: string): Promise<User>;
  
  // Property operations
  createProperty(property: InsertProperty): Promise<Property>;
  getProperty(id: number): Promise<Property | undefined>;
  getUserProperties(userId: string): Promise<Property[]>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  searchProperties(query: any): Promise<Property[]>;
  incrementPropertyViews(id: number): Promise<void>;
  setPremiumStatus(id: number, isPremium: boolean, premiumUntil?: Date): Promise<Property | undefined>;
  
  // Property images operations
  addPropertyImage(image: InsertPropertyImage): Promise<PropertyImage>;
  getPropertyImages(propertyId: number): Promise<PropertyImage[]>;
  deletePropertyImage(id: number): Promise<boolean>;
  
  // Property features operations
  addPropertyFeature(feature: InsertPropertyFeature): Promise<PropertyFeature>;
  getPropertyFeatures(propertyId: number): Promise<PropertyFeature[]>;
  deletePropertyFeature(id: number): Promise<boolean>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getUserMessages(userId: string): Promise<Message[]>;
  getPropertyMessages(propertyId: number): Promise<Message[]>;
  getConversation(user1Id: string, user2Id: string, propertyId: number): Promise<Message[]>;
  markMessageAsRead(id: number): Promise<boolean>;
  
  // Offer operations
  createOffer(offer: InsertOffer): Promise<Offer>;
  getPropertyOffers(propertyId: number): Promise<Offer[]>;
  getUserOffers(userId: string): Promise<Offer[]>;
  updateOfferStatus(id: number, status: string): Promise<Offer | undefined>;
  
  // Premium transaction operations
  recordPremiumTransaction(transaction: InsertPremiumTransaction): Promise<PremiumTransaction>;
  getUserTransactions(userId: string): Promise<PremiumTransaction[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
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

  async updateUserType(id: string, userType: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ userType, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateStripeCustomerId(userId: string, customerId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId: customerId, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Property operations
  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values(property)
      .returning();
    return newProperty;
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id));
    return property;
  }

  async getUserProperties(userId: string): Promise<Property[]> {
    return db
      .select()
      .from(properties)
      .where(eq(properties.userId, userId))
      .orderBy(desc(properties.createdAt));
  }

  async updateProperty(
    id: number,
    propertyData: Partial<InsertProperty>
  ): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...propertyData, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db
      .delete(properties)
      .where(eq(properties.id, id));
    return result.count > 0;
  }

  async getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    return db
      .select()
      .from(properties)
      .where(eq(properties.isPremium, true))
      .orderBy(desc(properties.createdAt))
      .limit(limit);
  }

  async searchProperties(query: any): Promise<Property[]> {
    let filters = [];
    
    // Location-based search
    if (query.location) {
      filters.push(
        or(
          like(properties.address, `%${query.location}%`),
          like(properties.city, `%${query.location}%`),
          like(properties.state, `%${query.location}%`),
          like(properties.zipCode, `%${query.location}%`)
        )
      );
    }
    
    // Price range
    if (query.minPrice) {
      filters.push(gte(properties.price, query.minPrice));
    }
    if (query.maxPrice) {
      filters.push(lte(properties.price, query.maxPrice));
    }
    
    // Property type
    if (query.propertyType && query.propertyType !== 'All') {
      filters.push(eq(properties.propertyType, query.propertyType));
    }
    
    // Bedrooms and bathrooms
    if (query.minBeds) {
      filters.push(gte(properties.bedrooms, query.minBeds));
    }
    if (query.minBaths) {
      filters.push(gte(properties.bathrooms, query.minBaths));
    }
    
    // Status filter (default to active listings only)
    if (query.status) {
      filters.push(eq(properties.status, query.status));
    } else {
      filters.push(eq(properties.status, 'active'));
    }
    
    // Only include premium if requested
    if (query.premiumOnly) {
      filters.push(eq(properties.isPremium, true));
    }
    
    // Execute the query with all filters
    const queryBuilder = db.select().from(properties);
    
    if (filters.length > 0) {
      queryBuilder.where(and(...filters));
    }
    
    // Order by premium listings first, then creation date
    return queryBuilder
      .orderBy(desc(properties.isPremium), desc(properties.createdAt))
      .limit(query.limit || 50);
  }

  async incrementPropertyViews(id: number): Promise<void> {
    await db
      .update(properties)
      .set({
        viewCount: properties.viewCount + 1,
      })
      .where(eq(properties.id, id));
  }

  async setPremiumStatus(
    id: number,
    isPremium: boolean,
    premiumUntil?: Date
  ): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set({
        isPremium,
        premiumUntil,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  // Property images operations
  async addPropertyImage(image: InsertPropertyImage): Promise<PropertyImage> {
    const [newImage] = await db
      .insert(propertyImages)
      .values(image)
      .returning();
    return newImage;
  }

  async getPropertyImages(propertyId: number): Promise<PropertyImage[]> {
    return db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyId))
      .orderBy(propertyImages.sortOrder);
  }

  async deletePropertyImage(id: number): Promise<boolean> {
    const result = await db
      .delete(propertyImages)
      .where(eq(propertyImages.id, id));
    return result.count > 0;
  }

  // Property features operations
  async addPropertyFeature(feature: InsertPropertyFeature): Promise<PropertyFeature> {
    const [newFeature] = await db
      .insert(propertyFeatures)
      .values(feature)
      .returning();
    return newFeature;
  }

  async getPropertyFeatures(propertyId: number): Promise<PropertyFeature[]> {
    return db
      .select()
      .from(propertyFeatures)
      .where(eq(propertyFeatures.propertyId, propertyId));
  }

  async deletePropertyFeature(id: number): Promise<boolean> {
    const result = await db
      .delete(propertyFeatures)
      .where(eq(propertyFeatures.id, id));
    return result.count > 0;
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(
        or(
          eq(messages.toUserId, userId),
          eq(messages.fromUserId, userId)
        )
      )
      .orderBy(desc(messages.createdAt));
  }

  async getPropertyMessages(propertyId: number): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.propertyId, propertyId))
      .orderBy(desc(messages.createdAt));
  }

  async getConversation(
    user1Id: string,
    user2Id: string,
    propertyId: number
  ): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.propertyId, propertyId),
          or(
            and(
              eq(messages.fromUserId, user1Id),
              eq(messages.toUserId, user2Id)
            ),
            and(
              eq(messages.fromUserId, user2Id),
              eq(messages.toUserId, user1Id)
            )
          )
        )
      )
      .orderBy(messages.createdAt);
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const [updatedMessage] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return !!updatedMessage;
  }

  // Offer operations
  async createOffer(offer: InsertOffer): Promise<Offer> {
    const [newOffer] = await db
      .insert(offers)
      .values(offer)
      .returning();
    return newOffer;
  }

  async getPropertyOffers(propertyId: number): Promise<Offer[]> {
    return db
      .select()
      .from(offers)
      .where(eq(offers.propertyId, propertyId))
      .orderBy(desc(offers.createdAt));
  }

  async getUserOffers(userId: string): Promise<Offer[]> {
    return db
      .select()
      .from(offers)
      .where(eq(offers.buyerId, userId))
      .orderBy(desc(offers.createdAt));
  }

  async updateOfferStatus(id: number, status: string): Promise<Offer | undefined> {
    const [updatedOffer] = await db
      .update(offers)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(offers.id, id))
      .returning();
    return updatedOffer;
  }

  // Premium transaction operations
  async recordPremiumTransaction(
    transaction: InsertPremiumTransaction
  ): Promise<PremiumTransaction> {
    const [newTransaction] = await db
      .insert(premiumTransactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getUserTransactions(userId: string): Promise<PremiumTransaction[]> {
    return db
      .select()
      .from(premiumTransactions)
      .where(eq(premiumTransactions.userId, userId))
      .orderBy(desc(premiumTransactions.createdAt));
  }
}

export const storage = new DatabaseStorage();
