import mongoose, { Schema, Document, Model } from "mongoose";

export type ReceiptStatus = "pending" | "approved" | "rejected";
export type ReceiptCurrency = "USD" | "CRC";

export interface IPaymentReceipt {
  _id: string;
  userId: string;
  subscriptionId?: string;
  imageUrl: string;
  amount: number;
  currency: ReceiptCurrency;
  transferRef?: string;
  notes?: string;
  status: ReceiptStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentReceiptDocument
  extends Omit<IPaymentReceipt, "_id">,
    Document {}

const PaymentReceiptSchema = new Schema<PaymentReceiptDocument>(
  {
    // @ts-expect-error: Mongoose v8 ObjectId vs string type mismatch (works at runtime)
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ["USD", "CRC"],
      default: "USD",
    },
    transferRef: {
      type: String,
      trim: true,
      default: null,
    },
    notes: {
      type: String,
      maxlength: 500,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

PaymentReceiptSchema.index({ userId: 1, status: 1 });
PaymentReceiptSchema.index({ status: 1, createdAt: -1 });

export const PaymentReceipt: Model<PaymentReceiptDocument> =
  mongoose.models.PaymentReceipt ??
  mongoose.model<PaymentReceiptDocument>("PaymentReceipt", PaymentReceiptSchema);
