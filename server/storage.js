import { users, properties, propertyImages, propertyFeatures, messages, offers, premiumTransactions } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, like, or, gte, lte } from "drizzle-orm";
export class DatabaseStorage {
    // User operations
    async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
    }
    async getUserByEmail(email) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user;
    }
    async upsertUser(userData) {
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
    async updateUserType(id, userType) {
        const [updatedUser] = await db
            .update(users)
            .set({ userType, updatedAt: new Date() })
            .where(eq(users.id, id))
            .returning();
        return updatedUser;
    }
    async updateStripeCustomerId(userId, customerId) {
        const [user] = await db
            .update(users)
            .set({ stripeCustomerId: customerId, updatedAt: new Date() })
            .where(eq(users.id, userId))
            .returning();
        return user;
    }
    // Property operations
    async createProperty(property) {
        const [newProperty] = await db
            .insert(properties)
            .values(property)
            .returning();
        return newProperty;
    }
    async getProperty(id) {
        const [property] = await db
            .select()
            .from(properties)
            .where(eq(properties.id, id));
        return property;
    }
    async getUserProperties(userId) {
        return db
            .select()
            .from(properties)
            .where(eq(properties.userId, userId))
            .orderBy(desc(properties.createdAt));
    }
    async updateProperty(id, propertyData) {
        const [updatedProperty] = await db
            .update(properties)
            .set({ ...propertyData, updatedAt: new Date() })
            .where(eq(properties.id, id))
            .returning();
        return updatedProperty;
    }
    async deleteProperty(id) {
        const result = await db
            .delete(properties)
            .where(eq(properties.id, id));
        return result.count > 0;
    }
    async getFeaturedProperties(limit = 6) {
        return db
            .select()
            .from(properties)
            .where(eq(properties.isPremium, true))
            .orderBy(desc(properties.createdAt))
            .limit(limit);
    }
    async searchProperties(query) {
        let filters = [];
        // Location-based search
        if (query.location) {
            filters.push(or(like(properties.address, `%${query.location}%`), like(properties.city, `%${query.location}%`), like(properties.state, `%${query.location}%`), like(properties.zipCode, `%${query.location}%`)));
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
        }
        else {
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
    async incrementPropertyViews(id) {
        await db
            .update(properties)
            .set({
            viewCount: properties.viewCount + 1,
        })
            .where(eq(properties.id, id));
    }
    async setPremiumStatus(id, isPremium, premiumUntil) {
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
    async addPropertyImage(image) {
        const [newImage] = await db
            .insert(propertyImages)
            .values(image)
            .returning();
        return newImage;
    }
    async getPropertyImages(propertyId) {
        return db
            .select()
            .from(propertyImages)
            .where(eq(propertyImages.propertyId, propertyId))
            .orderBy(propertyImages.sortOrder);
    }
    async deletePropertyImage(id) {
        const result = await db
            .delete(propertyImages)
            .where(eq(propertyImages.id, id));
        return result.count > 0;
    }
    // Property features operations
    async addPropertyFeature(feature) {
        const [newFeature] = await db
            .insert(propertyFeatures)
            .values(feature)
            .returning();
        return newFeature;
    }
    async getPropertyFeatures(propertyId) {
        return db
            .select()
            .from(propertyFeatures)
            .where(eq(propertyFeatures.propertyId, propertyId));
    }
    async deletePropertyFeature(id) {
        const result = await db
            .delete(propertyFeatures)
            .where(eq(propertyFeatures.id, id));
        return result.count > 0;
    }
    // Message operations
    async createMessage(message) {
        const [newMessage] = await db
            .insert(messages)
            .values(message)
            .returning();
        return newMessage;
    }
    async getUserMessages(userId) {
        return db
            .select()
            .from(messages)
            .where(or(eq(messages.toUserId, userId), eq(messages.fromUserId, userId)))
            .orderBy(desc(messages.createdAt));
    }
    async getPropertyMessages(propertyId) {
        return db
            .select()
            .from(messages)
            .where(eq(messages.propertyId, propertyId))
            .orderBy(desc(messages.createdAt));
    }
    async getConversation(user1Id, user2Id, propertyId) {
        return db
            .select()
            .from(messages)
            .where(and(eq(messages.propertyId, propertyId), or(and(eq(messages.fromUserId, user1Id), eq(messages.toUserId, user2Id)), and(eq(messages.fromUserId, user2Id), eq(messages.toUserId, user1Id)))))
            .orderBy(messages.createdAt);
    }
    async markMessageAsRead(id) {
        const [updatedMessage] = await db
            .update(messages)
            .set({ isRead: true })
            .where(eq(messages.id, id))
            .returning();
        return !!updatedMessage;
    }
    // Offer operations
    async createOffer(offer) {
        const [newOffer] = await db
            .insert(offers)
            .values(offer)
            .returning();
        return newOffer;
    }
    async getPropertyOffers(propertyId) {
        return db
            .select()
            .from(offers)
            .where(eq(offers.propertyId, propertyId))
            .orderBy(desc(offers.createdAt));
    }
    async getUserOffers(userId) {
        return db
            .select()
            .from(offers)
            .where(eq(offers.buyerId, userId))
            .orderBy(desc(offers.createdAt));
    }
    async updateOfferStatus(id, status) {
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
    async recordPremiumTransaction(transaction) {
        const [newTransaction] = await db
            .insert(premiumTransactions)
            .values(transaction)
            .returning();
        return newTransaction;
    }
    async getUserTransactions(userId) {
        return db
            .select()
            .from(premiumTransactions)
            .where(eq(premiumTransactions.userId, userId))
            .orderBy(desc(premiumTransactions.createdAt));
    }
}
export const storage = new DatabaseStorage();
