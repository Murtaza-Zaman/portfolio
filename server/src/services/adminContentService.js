import { AuditEvent } from "../models/auditModel.js";
import { Inquiry } from "../models/contentModels.js";
import { Settings } from "../models/settingsModel.js";
import { contentRepository, getModel } from "../repositories/contentRepository.js";

async function recordAudit({ actorUserId, action, entityType, entityId, before, after, ipAddress, userAgent }) {
  try {
    await AuditEvent.create({
      actorUserId,
      action,
      entityType,
      entityId,
      before,
      after,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error("Failed to record audit event:", err);
  }
}

export const adminContentService = {
  async list(resourceKey, { filter = {}, limit = 50, page = 1, status }) {
    const Model = getModel(resourceKey);
    const query = { ...filter };
    if (status) {
      query.status = status;
    }

    const result = await contentRepository.findAdminList(Model, { filter: query, limit, page });
    return {
      data: result.items.map((item) => (item.toObject ? item.toObject() : item)),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  },

  async getById(resourceKey, id) {
    const Model = getModel(resourceKey);
    const item = await contentRepository.findById(Model, id);
    if (!item) {
      const error = new Error(`${resourceKey} record with ID ${id} not found`);
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }
    return item;
  },

  async create(resourceKey, data, actorUser, reqInfo = {}) {
    const Model = getModel(resourceKey);
    const isPublished = (data.status || "draft") === "published";
    const created = await contentRepository.create(Model, {
      ...data,
      status: data.status || "draft",
      publishedAt: isPublished ? (data.publishedAt || new Date()) : (data.publishedAt || null),
    });

    await recordAudit({
      actorUserId: actorUser._id,
      action: "CREATE",
      entityType: resourceKey,
      entityId: created._id,
      after: created.toObject ? created.toObject() : created,
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
    });

    return created;
  },

  async update(resourceKey, id, data, actorUser, reqInfo = {}) {
    const Model = getModel(resourceKey);
    const existing = await contentRepository.findById(Model, id);
    if (!existing) {
      const error = new Error(`${resourceKey} record with ID ${id} not found`);
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const before = existing.toObject ? existing.toObject() : existing;
    const payload = { ...data };
    if (data.status === "published" && !existing.publishedAt && !data.publishedAt) {
      payload.publishedAt = new Date();
    }

    const updated = await contentRepository.updateById(Model, id, payload);

    await recordAudit({
      actorUserId: actorUser._id,
      action: "UPDATE",
      entityType: resourceKey,
      entityId: updated._id,
      before,
      after: updated.toObject ? updated.toObject() : updated,
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
    });

    return updated;
  },

  async publish(resourceKey, id, actorUser, reqInfo = {}) {
    const Model = getModel(resourceKey);
    const existing = await contentRepository.findById(Model, id);
    if (!existing) {
      const error = new Error(`${resourceKey} record with ID ${id} not found`);
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const before = existing.toObject ? existing.toObject() : existing;
    const published = await contentRepository.updateById(Model, id, {
      status: "published",
      publishedAt: existing.publishedAt || new Date(),
    });

    await recordAudit({
      actorUserId: actorUser._id,
      action: "PUBLISH",
      entityType: resourceKey,
      entityId: published._id,
      before,
      after: published.toObject ? published.toObject() : published,
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
    });

    return published;
  },

  async unpublish(resourceKey, id, actorUser, reqInfo = {}) {
    const Model = getModel(resourceKey);
    const existing = await contentRepository.findById(Model, id);
    if (!existing) {
      const error = new Error(`${resourceKey} record with ID ${id} not found`);
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const before = existing.toObject ? existing.toObject() : existing;
    const unpublished = await contentRepository.updateById(Model, id, {
      status: "draft",
    });

    await recordAudit({
      actorUserId: actorUser._id,
      action: "UNPUBLISH",
      entityType: resourceKey,
      entityId: unpublished._id,
      before,
      after: unpublished.toObject ? unpublished.toObject() : unpublished,
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
    });

    return unpublished;
  },

  async archive(resourceKey, id, actorUser, reqInfo = {}) {
    const Model = getModel(resourceKey);
    const existing = await contentRepository.findById(Model, id);
    if (!existing) {
      const error = new Error(`${resourceKey} record with ID ${id} not found`);
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const before = existing.toObject ? existing.toObject() : existing;
    const archived = await contentRepository.archiveById(Model, id);

    await recordAudit({
      actorUserId: actorUser._id,
      action: "ARCHIVE",
      entityType: resourceKey,
      entityId: archived._id,
      before,
      after: archived.toObject ? archived.toObject() : archived,
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
    });

    return archived;
  },

  async delete(resourceKey, id, actorUser, reqInfo = {}) {
    const Model = getModel(resourceKey);
    const existing = await contentRepository.findById(Model, id);
    if (!existing) {
      const error = new Error(`${resourceKey} record with ID ${id} not found`);
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const before = existing.toObject ? existing.toObject() : existing;
    await contentRepository.deleteById(Model, id);

    await recordAudit({
      actorUserId: actorUser._id,
      action: "DELETE",
      entityType: resourceKey,
      entityId: id,
      before,
      after: null,
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
    });

    return { success: true, id };
  },

  async updateInquiryStatus(id, { status, notes }, actorUser, reqInfo = {}) {
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      const error = new Error(`Inquiry with ID ${id} not found`);
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const before = inquiry.toObject();
    if (status) inquiry.status = status;
    await inquiry.save();

    await recordAudit({
      actorUserId: actorUser._id,
      action: "UPDATE_STATUS",
      entityType: "inquiry",
      entityId: inquiry._id,
      before,
      after: inquiry.toObject(),
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
    });

    return inquiry;
  },

  async getSettings() {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return settings;
  },

  async updateSettings(data, actorUser, reqInfo = {}) {
    let settings = await Settings.findOne();
    const before = settings ? settings.toObject() : null;

    if (!settings) {
      settings = await Settings.create(data);
    } else {
      Object.assign(settings, data);
      await settings.save();
    }

    await recordAudit({
      actorUserId: actorUser._id,
      action: "UPDATE_SETTINGS",
      entityType: "settings",
      entityId: settings._id,
      before,
      after: settings.toObject(),
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
    });

    return settings;
  },

  async listAuditEvents({ limit = 50, page = 1 } = {}) {
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      AuditEvent.find().populate("actorUserId", "displayName email role").sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      AuditEvent.countDocuments(),
    ]);

    return {
      data: events,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },
};
