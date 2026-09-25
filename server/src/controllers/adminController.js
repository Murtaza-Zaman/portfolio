import { asyncHandler } from "../middleware/asyncHandler.js";
import { adminContentService } from "../services/adminContentService.js";

function getReqInfo(req) {
  return {
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.headers["user-agent"] || "",
  };
}

export const adminController = {
  list: asyncHandler(async (req, res) => {
    const { resource } = req.params;
    const { limit, page, status } = req.query;
    const result = await adminContentService.list(resource, {
      limit: limit ? parseInt(limit, 10) : 50,
      page: page ? parseInt(page, 10) : 1,
      status,
    });
    res.json({
      data: result.data,
      meta: result.meta,
      error: null,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id, resource } = req.params;
    const item = await adminContentService.getById(resource, id);
    res.json({ data: item, error: null });
  }),

  create: asyncHandler(async (req, res) => {
    const { resource } = req.params;
    const item = await adminContentService.create(resource, req.body, req.user, getReqInfo(req));
    res.status(201).json({ data: item, error: null });
  }),

  update: asyncHandler(async (req, res) => {
    const { id, resource } = req.params;
    const item = await adminContentService.update(resource, id, req.body, req.user, getReqInfo(req));
    res.json({ data: item, error: null });
  }),

  publish: asyncHandler(async (req, res) => {
    const { id, resource } = req.params;
    const item = await adminContentService.publish(resource, id, req.user, getReqInfo(req));
    res.json({ data: item, error: null });
  }),

  unpublish: asyncHandler(async (req, res) => {
    const { id, resource } = req.params;
    const item = await adminContentService.unpublish(resource, id, req.user, getReqInfo(req));
    res.json({ data: item, error: null });
  }),

  archive: asyncHandler(async (req, res) => {
    const { id, resource } = req.params;
    const item = await adminContentService.archive(resource, id, req.user, getReqInfo(req));
    res.json({ data: item, error: null });
  }),

  delete: asyncHandler(async (req, res) => {
    const { id, resource } = req.params;
    const result = await adminContentService.delete(resource, id, req.user, getReqInfo(req));
    res.json({ data: result, error: null });
  }),

  uploadImage: asyncHandler(async (req, res) => {
    if (!req.file) {
      const error = new Error("No image file provided for upload");
      error.statusCode = 400;
      error.code = "MISSING_FILE";
      throw error;
    }

    const { cloudinaryService } = await import("../services/cloudinaryService.js");
    const result = await cloudinaryService.uploadImageBuffer(req.file.buffer, {
      folder: req.body.folder || "portfolio/projects",
      mimeType: req.file.mimetype,
    });

    res.status(201).json({
      data: result,
      error: null,
    });
  }),

  getInquiries: asyncHandler(async (req, res) => {
    const { limit, page, status } = req.query;
    const result = await adminContentService.list("inquiries", {
      limit: limit ? parseInt(limit, 10) : 50,
      page: page ? parseInt(page, 10) : 1,
      status,
    });
    res.json({ data: result.data, meta: result.meta, error: null });
  }),

  updateInquiryStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { notes, status } = req.body;
    const inquiry = await adminContentService.updateInquiryStatus(id, { status, notes }, req.user, getReqInfo(req));
    res.json({ data: inquiry, error: null });
  }),

  getSettings: asyncHandler(async (_req, res) => {
    const settings = await adminContentService.getSettings();
    res.json({ data: settings, error: null });
  }),

  updateSettings: asyncHandler(async (req, res) => {
    const settings = await adminContentService.updateSettings(req.body, req.user, getReqInfo(req));
    res.json({ data: settings, error: null });
  }),

  getAuditEvents: asyncHandler(async (req, res) => {
    const { limit, page } = req.query;
    const result = await adminContentService.listAuditEvents({
      limit: limit ? parseInt(limit, 10) : 50,
      page: page ? parseInt(page, 10) : 1,
    });
    res.json({ data: result.data, meta: result.meta, error: null });
  }),
};
