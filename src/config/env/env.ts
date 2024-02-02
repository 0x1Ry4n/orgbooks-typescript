import { z } from "zod";
import logger from "../logger";
import "dotenv/config";

const envSchema = z.object({
    NODE_ENV: z.enum(["dev", "prod"]).default("dev"),
    DATABASE_URL: z.string(),
    API_LOCAL_PORT: z.coerce.number().default(3000),
    API_DOCKER_PORT: z.coerce.number().default(3000),
    POSTGRESDB_LOCAL_PORT: z.coerce.number().default(5432),
    POSTGRESDB_DOCKER_PORT: z.coerce.number().default(5432),
    EXPIRES_IN: z.string().default("7days"),
});

const envParsing = envSchema.safeParse(process.env);

if (envParsing.success === false) {
    logger.error("Invalid environment variables", envParsing.error.format());
    throw new Error("Invalid environment variables");
}

export const env = envParsing.data;
