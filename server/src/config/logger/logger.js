import winston from "winston";
import { logTransports } from "./transports.js";

/**
 * Winston Application Logger
 * Log levels: error (0), warn (1), info (2), http (3), verbose (4), debug (5), silly (6)
 */
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transports: logTransports,
  exitOnError: false,
});

/**
 * Helper to record security events (failed logins, unauthorized attempts, rate limit violations)
 * @param {string} event - Name of the security event
 * @param {Object} details - Additional event metadata (IP, endpoint, etc.)
 */
export function logSecurityEvent(event, details = {}) {
  // Ensure sensitive fields (passwords, tokens) are never logged
  const sanitizedDetails = { ...details };
  delete sanitizedDetails.password;
  delete sanitizedDetails.passwordHash;
  delete sanitizedDetails.token;
  delete sanitizedDetails.authorization;

  logger.warn(`[SECURITY_EVENT] ${event}`, {
    eventType: "SECURITY",
    event,
    ...sanitizedDetails,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Helper to record admin actions for audit trail
 * @param {string} action - Action performed (e.g. "CREATE_PROJECT", "UPDATE_SEO")
 * @param {Object} details - Action metadata
 */
export function logAdminAction(action, details = {}) {
  logger.info(`[ADMIN_ACTION] ${action}`, {
    eventType: "ADMIN_AUDIT",
    action,
    ...details,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Helper to log API errors
 * @param {Error|string} error - Error object or message
 * @param {Object} req - Express request object (optional)
 */
export function logApiError(error, req = null) {
  const meta = {
    eventType: "API_ERROR",
    timestamp: new Date().toISOString(),
  };

  if (req) {
    meta.method = req.method;
    meta.url = req.originalUrl || req.url;
    meta.ip = req.ip || req.headers["x-forwarded-for"];
  }

  logger.error(error?.message || String(error), {
    ...meta,
    stack: error?.stack,
  });
}
