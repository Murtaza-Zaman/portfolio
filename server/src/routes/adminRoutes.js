import { Router } from "express";
import multer from "multer";

import { adminController } from "../controllers/adminController.js";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max file size
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are permitted for upload"));
    }
  },
});

export const adminRouter = Router();

// All admin routes require authentication
adminRouter.use(authenticateToken);

// Inquiry operations
adminRouter.get("/inquiries", adminController.getInquiries);
adminRouter.patch("/inquiries/:id/status", adminController.updateInquiryStatus);

// Settings operations
adminRouter.get("/settings", adminController.getSettings);
adminRouter.patch("/settings", requireRole(["admin"]), adminController.updateSettings);

// Audit logs
adminRouter.get("/audit-events", requireRole(["admin"]), adminController.getAuditEvents);

// Image upload to Cloudinary
adminRouter.post("/upload", requireRole(["admin", "editor", "content_manager"]), upload.single("file"), adminController.uploadImage);

// Generic CMS resource operations
adminRouter.get("/:resource", adminController.list);
adminRouter.post("/:resource", requireRole(["admin", "editor", "content_manager"]), adminController.create);
adminRouter.get("/:resource/:id", adminController.getById);
adminRouter.patch("/:resource/:id", requireRole(["admin", "editor", "content_manager"]), adminController.update);
adminRouter.post("/:resource/:id/publish", requireRole(["admin", "editor"]), adminController.publish);
adminRouter.post("/:resource/:id/unpublish", requireRole(["admin", "editor"]), adminController.unpublish);
adminRouter.post("/:resource/:id/archive", requireRole(["admin", "editor"]), adminController.archive);
adminRouter.delete("/:resource/:id", requireRole(["admin", "editor"]), adminController.delete);
