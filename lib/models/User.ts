import mongoose, { Schema, Document, Model } from "mongoose";
import type { IUser, IPublicProfile, UserRole } from "@/types";

export interface UserDocument extends Omit<IUser, "_id">, Document {
  passwordHash: string;
}

const PublicProfileSchema = new Schema<IPublicProfile>(
  {
    displayName:    { type: String, default: "" },
    bio:            { type: String, default: "", maxlength: 300 },
    avatarUrl:      { type: String, default: "" },
    coverImageUrl:  { type: String, default: null },
    whatsappNumber: { type: String, default: "" },
    whatsappMessage:{ type: String, default: "Hola, vi tu perfil en Listo.cr y me interesa una propiedad." },
    email:          { type: String, default: null },
    phone:          { type: String, default: null },
    socialLinks: {
      instagram: { type: String, default: null },
      facebook:  { type: String, default: null },
      linkedin:  { type: String, default: null },
      tiktok:    { type: String, default: null },
      website:   { type: String, default: null },
    },
    metaTitle:       { type: String, default: null },
    metaDescription: { type: String, default: null },
    showPropertyCount: { type: Boolean, default: true },
    accentColor:     { type: String, default: null },
    totalViews:      { type: Number, default: 0 },
    totalClicks:     { type: Number, default: 0 },
    lastViewedAt:    { type: Date, default: null },
  },
  { _id: false }
);

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: String,
      enum: ["agente_independiente", "lider_agencia", "agente_empresa", "super_admin"] as UserRole[],
      default: "agente_independiente",
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
      default: null,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    fichaDigitalSlug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    properties: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    publicProfile: {
      type: PublicProfileSchema,
      default: () => ({}),
    },
    leadScore: {
      experienceYears:  { type: Number, default: 0 },
      monthlyDeals:     { type: Number, default: 0 },
      hasPortfolio:     { type: Boolean, default: false },
      currentTool:      { type: String, default: "" },
      biggestChallenge: { type: String, default: "" },
      score:            { type: Number, default: 0, min: 0, max: 100 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ fichaDigitalSlug: 1 });
UserSchema.index({ agencyId: 1, role: 1 });

UserSchema.virtual("fichaUrl").get(function (this: UserDocument) {
  return `/u/${this.fichaDigitalSlug}`;
});

export const User: Model<UserDocument> =
  mongoose.models.User ?? mongoose.model<UserDocument>("User", UserSchema);
