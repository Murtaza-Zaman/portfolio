import mongoose from "mongoose";

const { Schema } = mongoose;

const settingsSchema = new Schema(
  {
    siteName: {
      type: String,
      default: "Murtaza Zaman",
    },
    siteTitle: {
      type: String,
      default: "Future Technology Builder & Software Engineer",
    },
    siteDescription: {
      type: String,
      default: "Professional portfolio and digital solution engineering platform.",
    },
    contactEmail: {
      type: String,
      default: "contact@murtazazaman.com",
    },
    calendlyUrl: {
      type: String,
      default: "",
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    seoDefaults: {
      defaultMetaTitle: String,
      defaultMetaDescription: String,
      robots: { type: String, enum: ["index", "noindex"], default: "index" },
    },
  },
  { timestamps: true }
);

export const Settings = mongoose.model("Settings", settingsSchema);
