import type { ZodError, ZodTypeAny, z } from "zod";
import { ConfigValidationError, type ConfigIssue } from "./errors";
import { getVariableMeta, type ConfigCategory } from "./variables";

function toIssues(error: ZodError): ConfigIssue[] {
  return error.issues.map((issue): ConfigIssue => {
    const variable = String(issue.path[0] ?? "unknown");
    const meta = getVariableMeta(variable);
    const missing =
      issue.code === "invalid_type" && issue.received === "undefined";
    return {
      variable,
      category: meta?.category ?? "unknown",
      code: missing ? "CONFIG_MISSING" : "CONFIG_INVALID",
    };
  });
}

/**
 * Parses `source` against `schema`. Throws a `ConfigValidationError` whose
 * message and issues carry only variable names, categories, and codes —
 * never the offending value — so callers can log or surface it directly.
 */
export function parseEnv<Schema extends ZodTypeAny>(
  schema: Schema,
  source: Record<string, string | undefined>,
  processName: string,
): z.infer<Schema> {
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new ConfigValidationError(processName, toIssues(result.error));
  }
  return result.data;
}

/** Safe-for-diagnostics summary of which configuration categories a process' schema touches. */
export function describeCategories(variableNames: readonly string[]): ConfigCategory[] {
  const categories = new Set<ConfigCategory>();
  for (const name of variableNames) {
    const meta = getVariableMeta(name);
    if (meta) categories.add(meta.category);
  }
  return [...categories];
}
