import "dotenv/config";

const port = Number.parseInt(process.env.PORT ?? "4000", 10);

if (Number.isNaN(port)) {
  throw new Error("PORT must be a number");
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port,
  mongoUri: process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/murtaza-portfolio",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  publicSiteUrl: process.env.PUBLIC_SITE_URL ?? "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET ?? "murtaza-portfolio-jwt-super-secret-key-2026",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "murtaza-portfolio-refresh-token-secret-2026",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d",
  cloudinaryUrl: process.env.CLOUDINARY_URL ?? "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
};
