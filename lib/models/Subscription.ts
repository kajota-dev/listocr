import mongoose, { Schema, Document, Model } from "mongoose";
import type { ISubscription, SubscriptionPlan, PlanFeatures } from "@/types";

export interface SubscriptionDocument extends Omit<ISubscription, "_id">, Document {}

// Fuente de verdad: features por plan
export const PLAN_FEATURES: Record<SubscriptionPlan, PlanFeatures> = {
  free: {
    maxProperties:       5,
    maxAgents:           1,
    fichaDigital:        true,
    qrCodes:             true,
    analytics:           false,
    whatsappIntegration: false,
    prioritySupport:     false,
    customBranding:      false,
  },
  pro: {
    maxProperties:       50,
    maxAgents:           1,
    fichaDigital:        true,
    qrCodes:             true,
    analytics:           true,
    whatsappIntegration: true,
    prioritySupport:     false,
    customBranding:      false,
  },
  business: {
    maxProperties:       -1,
    maxAgents:           -1,
    fichaDigital:        true,
    qrCodes:             true,
    analytics:           true,
    whatsappIntegration: true,
    prioritySupport:     true,
    customBranding:      true,
  },
};

// Precios en USD
export const PLAN_PRICES: Record<SubscriptionPlan, { monthly: number; annual: number }> = {
  free:     { monthly: 0,  annual: 0  },
  pro:      { monthly: 19, annual: 15 },
  business: { monthly: 49, annual: 39 },
};

const PlanFeaturesSchema = new Schema<PlanFeatures>(
  {
    maxProperties:       { type: Number, required: true },
    maxAgents:           { type: Number, required: true },
    fichaDigital:        { type: Boolean, default: true },
    qrCodes:             { type: Boolean, default: true },
    analytics:           { type: Boolean, default: false },
    whatsappIntegration: { type: Boolean, default: false },
    prioritySupport:     { type: Boolean, default: false },
    customBranding:      { type: Boolean, default: false },
  },
  { _id: false }
);

const SubscriptionSchema = new Schema<SubscriptionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
      default: null,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "business"] as SubscriptionPlan[],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "canceled", "expired", "trialing"],
      default: "active",
    },
    priceUSD: {
      type: Number,
      required: true,
      min: 0,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "annual"],
      default: "monthly",
    },
    startDate: { type: Date, required: true, default: Date.now },
    endDate:   { type: Date, required: true },
    features:  { type: PlanFeaturesSchema, required: true },
  },
  {
    timestamps: true,
  }
);

SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ agencyId: 1, status: 1 });
SubscriptionSchema.index({ endDate: 1 });

export const Subscription: Model<SubscriptionDocument> =
  mongoose.models.Subscription ?? mongoose.model<SubscriptionDocument>("Subscription", SubscriptionSchema);
