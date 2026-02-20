import { boolean, doublePrecision, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const containerOrders = pgTable("container_orders", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  status: text("status").notNull(),
  customerType: text("customer_type").notNull(),
  name: text("name").notNull(),
  companyName: text("company_name"),
  ico: text("ico"),
  dic: text("dic"),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  postalCode: text("postal_code").notNull(),
  city: text("city").notNull(),
  street: text("street").notNull(),
  houseNumber: text("house_number").notNull(),
  pinLat: doublePrecision("pin_lat"),
  pinLng: doublePrecision("pin_lng"),
  wasteType: text("waste_type").notNull(),
  containerSizeM3: integer("container_size_m3").notNull(),
  containerCount: integer("container_count").notNull(),
  rentalDays: integer("rental_days").notNull(),
  deliveryDateRequested: text("delivery_date_requested").notNull(),
  deliveryDateEndRequested: text("delivery_date_end_requested"),
  deliveryFlexibilityDays: integer("delivery_flexibility_days"),
  timeWindowRequested: text("time_window_requested").notNull(),
  deliveryDateConfirmed: text("delivery_date_confirmed"),
  timeWindowConfirmed: text("time_window_confirmed"),
  placementType: text("placement_type").notNull(),
  permitConfirmed: boolean("permit_confirmed").notNull(),
  extras: text("extras").notNull(),
  priceEstimate: text("price_estimate").notNull(),
  note: text("note"),
  callbackNote: text("callback_note"),
  internalNote: text("internal_note"),
  cancelReason: text("cancel_reason"),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  gdprConsent: boolean("gdpr_consent").notNull(),
  marketingConsent: boolean("marketing_consent").notNull(),
  source: text("source").notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull(),
  active: boolean("active").notNull(),
});

export const orderEvents = pgTable("order_events", {
  id: text("id").primaryKey(),
  orderId: text("order_id"),
  eventType: text("event_type").notNull(),
  payload: text("payload").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const rateLimitBuckets = pgTable("rate_limit_buckets", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
});
