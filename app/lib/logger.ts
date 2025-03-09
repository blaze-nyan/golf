/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/logger.ts

/**
 * Logger utility for consistent logging throughout the application.
 * In production mode, only errors are logged to the console.
 * In development mode, all logs are displayed.
 */

const isProduction = process.env.NODE_ENV === "production";

export const logger = {
  /**
   * Standard log message - only displayed in development
   */
  log: (...args: any[]) => !isProduction && console.log(...args),

  /**
   * Warning message - only displayed in development
   */
  warn: (...args: any[]) => !isProduction && console.warn(...args),

  /**
   * Error message - always displayed, even in production
   */
  error: (...args: any[]) => console.error(...args),

  /**
   * Info message - only displayed in development
   */
  info: (...args: any[]) => !isProduction && console.info(...args),

  /**
   * Debug message - only displayed in development
   */
  debug: (...args: any[]) => !isProduction && console.debug(...args),

  /**
   * Group related log messages - only in development
   */
  group: (label: string) => !isProduction && console.group(label),

  /**
   * End a group - only in development
   */
  groupEnd: () => !isProduction && console.groupEnd(),

  /**
   * Table format for structured data - only in development
   */
  table: (data: any) => !isProduction && console.table(data),
};
