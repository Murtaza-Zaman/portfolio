import mongoose from "mongoose";
import {
  Document,
  Inquiry,
  MediaAsset,
  Profile,
  Project,
  Service,
  ShowcaseCard,
  TechNode,
} from "../models/index.js";
import { inquirySchema, paginationSchema } from "../schemas/publicSchemas.js";
import {
  findPublicDocument,
  findPublicMedia,
  findPublishedBySlug,
  findPublishedProfile,
  listPublished,
} from "../services/publicContentService.js";

function sendData(response, data, meta) {
  response.json({ data, ...(meta ? { meta } : {}) });
}

function requireItem(item, resource) {
  if (!item) {
    const error = new Error(`${resource} not found`);
    error.statusCode = 404;
    error.code = "NOT_FOUND";
    throw error;
  }

  return item;
}

export async function getProfile(_request, response) {
  if (mongoose.connection.readyState !== 1) {
    return sendData(response, null);
  }
  sendData(response, await findPublishedProfile(Profile));
}

export async function listServices(request, response) {
  const { category, ...options } = request.query;
  const result = await listPublished(Service, category ? { category } : {}, paginationSchema.parse(options));
  sendData(response, result.data, result.meta);
}

export async function getService(request, response) {
  const service = await findPublishedBySlug(Service, request.params.slug, ["projectIds"]);
  sendData(response, requireItem(service, "Service"));
}

export async function listProjects(request, response) {
  const { category, capabilityArea, ...query } = request.query;
  const filter = {
    ...(category ? { category } : {}),
    ...(capabilityArea ? { capabilityAreas: capabilityArea } : {}),
  };
  const result = await listPublished(Project, filter, paginationSchema.parse(query));
  sendData(response, result.data, result.meta);
}

export async function getProject(request, response) {
  const project = await findPublishedBySlug(Project, request.params.slug, ["serviceIds"]);
  sendData(response, requireItem(project, "Project"));
}

export async function getDocument(request, response) {
  const document = await findPublicDocument(Document, request.params.type);
  sendData(response, requireItem(document, "Document"));
}

export async function getMedia(request, response) {
  const media = await findPublicMedia(MediaAsset, request.params.id);
  sendData(response, requireItem(media, "Media asset"));
}

export async function listShowcaseCards(_request, response) {
  if (mongoose.connection.readyState !== 1) {
    return sendData(response, []);
  }
  const result = await listPublished(ShowcaseCard, {}, { limit: 4 });
  sendData(response, result.data, result.meta);
}

export async function listNodeGraph(_request, response) {
  if (mongoose.connection.readyState !== 1) {
    return sendData(response, []);
  }
  const result = await listPublished(TechNode, {}, { limit: 6, sort: { displayOrder: 1 } });
  sendData(response, result.data, result.meta);
}

export async function createInquiry(request, response) {
  const payload = inquirySchema.parse(request.body);
  const inquiry = await Inquiry.create(payload);
  response.status(201).json({ data: { id: inquiry.id, status: inquiry.status } });
}
