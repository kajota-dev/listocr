import mongoose, { Schema, Document, Model } from "mongoose";

export type ActivityEntityType =
  | "property"
  | "profile"
  | "subscription"
  | "user"
  | "agency";

export type ActivityAction =
  | "created"
  | "updated"
  | "deleted"
  | "status_changed"
  | "price_changed";

export interface IActivityLog {
  _id: string;
  userId: string;
  agencyId?: string;
  entityType: ActivityEntityType;
  entityId: string;
  action: ActivityAction;
  changes?: Array<{ field: string; oldValue: unknown; newValue: unknown }>;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface ActivityLogDocument
  extends Omit<IActivityLog, "_id">,
    Document {}

const ActivityLogSchema = new Schema<ActivityLogDocument>(
  {
    // @ts-expect-error: Mongoose v8 ObjectId vs string type mismatch (works at runtime)
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
      default: null,
    },
    entityType: {
      type: String,
      enum: ["property", "profile", "subscription", "user", "agency"],
      required: true,
    },
    // @ts-expect-error: Mongoose v8 ObjectId vs string type mismatch (works at runtime)
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    action: {
      type: String,
      enum: ["created", "updated", "deleted", "status_changed", "price_changed"],
      required: true,
    },
    changes: [
      {
        field:    { type: String },
        oldValue: { type: Schema.Types.Mixed },
        newValue: { type: Schema.Types.Mixed },
        _id:      false,
      },
    ],
    metadata: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ agencyId: 1, createdAt: -1 });
ActivityLogSchema.index({ entityId: 1, createdAt: -1 });

export const ActivityLog: Model<ActivityLogDocument> =
  mongoose.models.ActivityLog ??
  mongoose.model<ActivityLogDocument>("ActivityLog", ActivityLogSchema);
