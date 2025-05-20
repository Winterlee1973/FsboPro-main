import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, varchar, jsonb, index, } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
// Session storage table for Replit Auth
export const sessions = pgTable("sessions", {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
}, (table) => [index("IDX_session_expire").on(table.expire)]);
// Users table
export const users = pgTable("users", {
    id: varchar("id").primaryKey().notNull(),
    email: varchar("email").unique(),
    firstName: varchar("first_name"),
    lastName: varchar("last_name"),
    profileImageUrl: varchar("profile_image_url"),
    userType: text("user_type").notNull().default("buyer"),
    stripeCustomerId: varchar("stripe_customer_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Properties table
export const properties = pgTable("properties", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    price: integer("price").notNull(),
    address: text("address").notNull(),
    city: text("city").notNull(),
    state: text("state").notNull(),
    zipCode: text("zip_code").notNull(),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    bedrooms: integer("bedrooms").notNull(),
    bathrooms: doublePrecision("bathrooms").notNull(),
    squareFeet: integer("square_feet").notNull(),
    propertyType: text("property_type").notNull(),
    yearBuilt: integer("year_built"),
    isPremium: boolean("is_premium").default(false).notNull(),
    premiumUntil: timestamp("premium_until"),
    status: text("status").default("active").notNull(),
    featuredImage: text("featured_image"),
    viewCount: integer("view_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Property images table
export const propertyImages = pgTable("property_images", {
    id: serial("id").primaryKey(),
    propertyId: integer("property_id")
        .notNull()
        .references(() => properties.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    caption: text("caption"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
// Property features table
export const propertyFeatures = pgTable("property_features", {
    id: serial("id").primaryKey(),
    propertyId: integer("property_id")
        .notNull()
        .references(() => properties.id, { onDelete: "cascade" }),
    feature: text("feature").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
// Messages table
export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    fromUserId: varchar("from_user_id")
        .notNull()
        .references(() => users.id),
    toUserId: varchar("to_user_id")
        .notNull()
        .references(() => users.id),
    propertyId: integer("property_id")
        .notNull()
        .references(() => properties.id, { onDelete: "cascade" }),
    message: text("message").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
// Offers table
export const offers = pgTable("offers", {
    id: serial("id").primaryKey(),
    propertyId: integer("property_id")
        .notNull()
        .references(() => properties.id, { onDelete: "cascade" }),
    buyerId: varchar("buyer_id")
        .notNull()
        .references(() => users.id),
    amount: integer("amount").notNull(),
    message: text("message"),
    status: text("status").default("pending").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Premium transactions table
export const premiumTransactions = pgTable("premium_transactions", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id")
        .notNull()
        .references(() => users.id),
    propertyId: integer("property_id")
        .notNull()
        .references(() => properties.id),
    amount: integer("amount").notNull(),
    stripePaymentId: text("stripe_payment_id").notNull(),
    status: text("status").default("completed").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
// Define table relations
export const usersRelations = relations(users, ({ many }) => ({
    properties: many(properties),
    sentMessages: many(messages, { relationName: "fromUser" }),
    receivedMessages: many(messages, { relationName: "toUser" }),
    offers: many(offers, { relationName: "buyer" }),
    premiumTransactions: many(premiumTransactions),
}));
export const propertiesRelations = relations(properties, ({ one, many }) => ({
    owner: one(users, {
        fields: [properties.userId],
        references: [users.id],
    }),
    images: many(propertyImages),
    features: many(propertyFeatures),
    messages: many(messages),
    offers: many(offers),
    premiumTransaction: many(premiumTransactions),
}));
export const messagesRelations = relations(messages, ({ one }) => ({
    fromUser: one(users, {
        fields: [messages.fromUserId],
        references: [users.id],
        relationName: "fromUser",
    }),
    toUser: one(users, {
        fields: [messages.toUserId],
        references: [users.id],
        relationName: "toUser",
    }),
    property: one(properties, {
        fields: [messages.propertyId],
        references: [properties.id],
    }),
}));
export const offersRelations = relations(offers, ({ one }) => ({
    property: one(properties, {
        fields: [offers.propertyId],
        references: [properties.id],
    }),
    buyer: one(users, {
        fields: [offers.buyerId],
        references: [users.id],
        relationName: "buyer",
    }),
}));
// ZOD Schemas for validation
export const upsertUserSchema = createInsertSchema(users);
export const insertPropertySchema = createInsertSchema(properties).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    viewCount: true,
    isPremium: true,
    premiumUntil: true,
});
export const insertPropertyImageSchema = createInsertSchema(propertyImages).omit({
    id: true,
    createdAt: true,
});
export const insertPropertyFeatureSchema = createInsertSchema(propertyFeatures).omit({
    id: true,
    createdAt: true,
});
export const insertMessageSchema = createInsertSchema(messages).omit({
    id: true,
    createdAt: true,
    isRead: true,
});
export const insertOfferSchema = createInsertSchema(offers).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    status: true,
});
export const insertPremiumTransactionSchema = createInsertSchema(premiumTransactions).omit({
    id: true,
    createdAt: true,
});
