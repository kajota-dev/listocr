import mongoose, { Schema, Document, Model } from "mongoose";
import type { IAgency, CostaRicaProvince } from "@/types";

export interface AgencyDocument extends Omit<IAgency, "_id">, Document {}

const PROVINCES: CostaRicaProvince[] = [
  "San Jose", "Alajuela", "Cartago", "Heredia",
  "Guanacaste", "Puntarenas", "Limon",
];

const AgencySchema = new Schema<AgencyDocument>(
  {
    name: {
      type: String,
      required: [true, "El nombre de la agencia es requerido"],
      trim: true,
      maxlength: [150, "Nombre demasiado largo"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      default: null,
    },
    // @ts-expect-error: Mongoose v8 ObjectId vs string type mismatch (works at runtime)
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
      default: null,
    },
    website: {
      type: String,
      trim: true,
      default: null,
    },
    address: {
      type: String,
      trim: true,
      default: null,
    },
    province: {
      type: String,
      enum: PROVINCES,
      required: [true, "La provincia es requerida"],
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

AgencySchema.index({ slug: 1 });
AgencySchema.index({ ownerId: 1 });

AgencySchema.virtual("agencyUrl").get(function (this: AgencyDocument) {
  return `/agencia/${this.slug}`;
});

export const Agency: Model<AgencyDocument> =
  mongoose.models.Agency ?? mongoose.model<AgencyDocument>("Agency", AgencySchema);
