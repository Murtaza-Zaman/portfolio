import mongoose from "mongoose";

const { Schema } = mongoose;

const auditEventSchema = new Schema(
  {
    actorUserId: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      index: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    before: {
      type: Schema.Types.Mixed,
      default: null,
    },
    after: {
      type: Schema.Types.Mixed,
      default: null,
    },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

auditEventSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export const AuditEvent = mongoose.model("AuditEvent", auditEventSchema);
