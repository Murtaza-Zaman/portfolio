import winston from "winston";
import { logFormatters } from "./formatters.js";
import { env } from "../env.js";

const { transports } = winston;

/**
 * Configure Winston log transports
 */
export const logTransports = [
  // Primary Console transport (active in all environments)
  new transports.Console({
    level: env.nodeEnv === "production" ? "info" : "debug",
    format: env.nodeEnv === "production" ? logFormatters.jsonFormat : logFormatters.consoleFormat,
    silent: env.nodeEnv === "test" && process.env.ENABLE_TEST_LOGS !== "true",
  }),
];
