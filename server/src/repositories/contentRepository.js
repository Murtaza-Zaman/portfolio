import {
  Document,
  Inquiry,
  MediaAsset,
  Profile,
  Project,
  Service,
  ShowcaseCard,
  TechNode,
} from "../models/contentModels.js";
import { Settings } from "../models/settingsModel.js";

const MODEL_MAP = {
  profile: Profile,
  profiles: Profile,
  service: Service,
  services: Service,
  project: Project,
  projects: Project,
  document: Document,
  documents: Document,
  inquiry: Inquiry,
  inquiries: Inquiry,
  message: Inquiry,
  messages: Inquiry,
  settings: Settings,
  setting: Settings,
  showcasecard: ShowcaseCard,
  showcasecards: ShowcaseCard,
  technode: TechNode,
  technodes: TechNode,
  nodegraph: TechNode,
  hero: Profile,
};

export function getModel(resourceKey) {
  const model = MODEL_MAP[resourceKey];
  if (!model) {
    const error = new Error(`Unknown resource type: ${resourceKey}`);
    error.statusCode = 400;
    error.code = "INVALID_RESOURCE";
    throw error;
  }
  return model;
}

export const contentRepository = {
  getModel,

  async findPublishedList(Model, { filter = {}, sort = { publishedAt: -1 }, limit = 20, page = 1, populate = [] }) {
    const query = {
      status: "published",
      publishedAt: { $lte: new Date() },
      ...filter,
    };

    const skip = (page - 1) * limit;
    let queryBuilder = Model.find(query).sort(sort).skip(skip).limit(limit);

    for (const pop of populate) {
      queryBuilder = queryBuilder.populate(pop);
    }

    const [items, total] = await Promise.all([
      queryBuilder.exec(),
      Model.countDocuments(query),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async findPublishedBySlug(Model, slug, populate = []) {
    let query = Model.findOne({
      slug,
      status: "published",
      publishedAt: { $lte: new Date() },
    });

    for (const pop of populate) {
      query = query.populate(pop);
    }

    return query.exec();
  },

  async findAdminList(Model, { filter = {}, sort = { updatedAt: -1 }, limit = 50, page = 1 }) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Model.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      Model.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async findById(Model, id) {
    return Model.findById(id).exec();
  },

  async create(Model, data) {
    return Model.create(data);
  },

  async updateById(Model, id, data) {
    return Model.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).exec();
  },

  async archiveById(Model, id) {
    return Model.findByIdAndUpdate(id, { $set: { status: "archived" } }, { new: true }).exec();
  },

  async deleteById(Model, id) {
    return Model.findByIdAndDelete(id).exec();
  },
};
