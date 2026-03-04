import mongoose, { Schema, Document, Model } from "mongoose";
import type {
  IProperty,
  PropertyType,
  PropertyStatus,
  PropertyOperation,
  CostaRicaProvince,
} from "@/types";

export interface PropertyDocument extends Omit<IProperty, "_id">, Document {}

const PropertySchema = new Schema<PropertyDocument>(
  {
    title: {
      type: String,
      required: [true, "El título es requerido"],
      trim: true,
      maxlength: [200, "Título demasiado largo"],
    },
    description: {
      type: String,
      required: true,
      maxlength: [5000, "Descripción demasiado larga"],
    },
    type: {
      type: String,
      enum: ["casa", "apartamento", "terreno", "local_comercial", "bodega", "oficina"] as PropertyType[],
      required: true,
    },
    operation: {
      type: String,
      enum: ["venta", "alquiler", "ambos"] as PropertyOperation[],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "El precio no puede ser negativo"],
    },
    currency: {
      type: String,
      enum: ["CRC", "USD"],
      default: "USD",
    },
    province: {
      type: String,
      enum: ["San Jose", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limon"] as CostaRicaProvince[],
      required: true,
    },
    canton:   { type: String, required: true, trim: true },
    district: { type: String, trim: true, default: null },
    address:  { type: String, trim: true, default: null },
    bedrooms:     { type: Number, min: 0, default: null },
    bathrooms:    { type: Number, min: 0, default: null },
    parkingSpots: { type: Number, min: 0, default: null },
    areaM2:  { type: Number, min: 0, default: null },
    lotM2:   { type: Number, min: 0, default: null },
    amenities: [{ type: String }],
    images:    [{ type: String }],
    videoUrl:  { type: String, default: null },
    status: {
      type: String,
      enum: ["disponible", "reservado", "vendido", "alquilado", "inactivo"] as PropertyStatus[],
      default: "disponible",
    },
    // @ts-expect-error: Mongoose v8 ObjectId vs string type mismatch (works at runtime)
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
      default: null,
    },
    featured: { type: Boolean, default: false },
    views:    { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PropertySchema.index({ province: 1, type: 1, operation: 1 });
PropertySchema.index({ ownerId: 1, status: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ featured: 1, createdAt: -1 });

export const Property: Model<PropertyDocument> =
  mongoose.models.Property ?? mongoose.model<PropertyDocument>("Property", PropertySchema);
