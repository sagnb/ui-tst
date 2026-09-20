import type { ConfigCategory } from "./variables";

export type ConfigIssueCode = "CONFIG_MISSING" | "CONFIG_INVALID" | "CONFIG_CONFLICT";

export interface ConfigIssue {
  /** Environment variable name. Never paired with its value. */
  variable: string;
  category: ConfigCategory | "unknown";
  code: ConfigIssueCode;
}

export interface SafeConfigDiagnostics {
  process: string;
  issues: ConfigIssue[];
}

/**
 * Thrown when a process's required configuration fails validation. The
 * message and every accessor here are built exclusively from variable
 * names, categories, and stable codes — never from the raw input values —
 * so this error is always safe to log or return from a diagnostics endpoint.
 */
export class ConfigValidationError extends Error {
  readonly process: string;
  readonly issues: ConfigIssue[];

  constructor(processName: string, issues: ConfigIssue[]) {
    const summary = issues
      .map((issue) => `${issue.variable} [${issue.category}]: ${issue.code}`)
      .join("; ");
    super(`Invalid configuration for "${processName}": ${summary}`);
    this.name = "ConfigValidationError";
    this.process = processName;
    this.issues = issues;
  }

  toSafeDiagnostics(): SafeConfigDiagnostics {
    return {
      process: this.process,
      issues: this.issues,
    };
  }
}
