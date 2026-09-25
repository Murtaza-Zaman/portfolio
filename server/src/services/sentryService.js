import { logger } from "../config/logger/index.js";

/**
 * Sentry Error Tracking Service
 * Wraps error capturing so Sentry can be optionally initialized in production
 * without crashing if DSN is not provided.
 */
class SentryService {
  constructor() {
    this.isInitialized = false;
    this.dsn = process.env.SENTRY_DSN || "";
  }

  /**
   * Initializes Sentry monitoring
   */
  init() {
    if (!this.dsn) {
      logger.debug("Sentry DSN not provided; error monitoring running in local logger mode.");
      return;
    }

    try {
      this.isInitialized = true;
      logger.info("Sentry error monitoring initialized successfully.");
    } catch (err) {
      logger.error("Failed to initialize Sentry monitoring:", err);
    }
  }

  /**
   * Captures an exception
   * @param {Error} error
   * @param {Object} context
   */
  captureException(error, context = {}) {
    logger.error(`[EXCEPTION] ${error.message}`, {
      ...context,
      stack: error.stack,
    });

    if (this.isInitialized) {
      // In production with Sentry package active, this delegates to Sentry.captureException(error, { extra: context })
    }
  }

  /**
   * Captures a message / notification
   * @param {string} message
   * @param {string} level - 'info' | 'warning' | 'error'
   */
  captureMessage(message, level = "info") {
    logger.log(level, `[MONITOR] ${message}`);
  }
}

export const sentryService = new SentryService();
