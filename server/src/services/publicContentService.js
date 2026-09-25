import mongoose from "mongoose";

export function getPublicFilter(customFilter = {}) {
  return {
    status: "published",
    $or: [
      { publishedAt: { $lte: new Date() } },
      { publishedAt: null },
      { publishedAt: { $exists: false } },
    ],
    ...customFilter,
  };
}

export const publicContentFilter = {
  status: "published",
};

function serialize(value) {
  if (Array.isArray(value)) {
    return value.map(serialize);
  }

  if (value && typeof value === "object") {
    if (value._bsontype === "ObjectId") {
      return value.toString();
    }

    return Object.fromEntries(
      Object.entries(value).filter(([key]) => key !== "__v").map(([key, item]) => [
        key === "_id" ? "id" : key,
        serialize(item),
      ]),
    );
  }

  return value;
}

function normalizeOptions({ page = 1, limit = 10 } = {}) {
  return {
    page: Math.max(1, Number(page)),
    limit: Math.min(50, Math.max(1, Number(limit))),
  };
}

export async function listPublished(model, filter = {}, options = {}) {
  const { page, limit } = normalizeOptions(options);
  const query = getPublicFilter(filter);
  const [items, total] = await Promise.all([
    model.find(query).sort({ displayOrder: 1, publishedAt: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    model.countDocuments(query),
  ]);

  return {
    data: serialize(items),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function findPublishedBySlug(model, slug, populate = []) {
  const query = model.findOne(getPublicFilter({ slug }));

  populate.forEach((path) => {
    query.populate({ path, match: getPublicFilter() });
  });

  const item = await query.lean();
  return item ? serialize(item) : null;
}

export async function findPublishedProfile(model) {
  const item = await model.findOne(getPublicFilter()).sort({ publishedAt: -1, createdAt: -1 }).lean();
  return item ? serialize(item) : null;
}

export async function findPublicDocument(model, type) {
  const item = await model.findOne(getPublicFilter({
    type,
    visibility: "public",
  })).sort({ publishedAt: -1, createdAt: -1 }).lean();

  return item ? serialize(item) : null;
}

export async function findPublicMedia(model, id) {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  const item = await model.findOne({ _id: id, status: "active" }).lean();
  return item ? serialize(item) : null;
}
