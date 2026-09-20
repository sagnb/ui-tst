import { z } from "zod";
import { databaseUrlSchema } from "../primitives";
import { parseEnv } from "../validate";

/**
 * Required before running Prisma migrations against the control database.
 * No `packages/database` Prisma schema exists yet in this repository, so
 * this contract is not currently called from a migration script — see the
 * project report for that gap. It is defined now so the migration tooling
 * can validate against it as soon as it is added, without renegotiating
 * the contract.
 */
export const migrationSchema = z.object({
  DATABASE_URL: databaseUrlSchema,
});
export type MigrationConfig = z.infer<typeof migrationSchema>;

export function loadMigrationConfig(
  env: Record<string, string | undefined> = process.env,
): MigrationConfig {
  return parseEnv(migrationSchema, env, "migration");
}
