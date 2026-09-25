import { Router } from "express";

import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  createInquiry,
  getDocument,
  getMedia,
  getProfile,
  getProject,
  getService,
  listProjects,
  listServices,
  listShowcaseCards,
  listNodeGraph,
} from "../controllers/publicController.js";

export const publicRouter = Router();

publicRouter.get("/profile", asyncHandler(getProfile));
publicRouter.get("/services", asyncHandler(listServices));
publicRouter.get("/services/:slug", asyncHandler(getService));
publicRouter.get("/projects", asyncHandler(listProjects));
publicRouter.get("/projects/:slug", asyncHandler(getProject));
publicRouter.get("/showcase-cards", asyncHandler(listShowcaseCards));
publicRouter.get("/node-graph", asyncHandler(listNodeGraph));
publicRouter.get("/documents/:type", asyncHandler(getDocument));
publicRouter.get("/media/:id", asyncHandler(getMedia));
publicRouter.post("/inquiries", asyncHandler(createInquiry));
