import winston from "winston";

const { format } = winston;

/**
 * Custom log formatters for Winston
 */
export const logFormatters = {
  // Console format for development and local debugging
  consoleFormat: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack, ...meta }) => {
      const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
      return `[${timestamp}] ${level}: ${stack || message}${metaString}`;
    })
  ),

  // JSON format for production ingestion (Datadog, CloudWatch, Render logs)
  jsonFormat: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
};
