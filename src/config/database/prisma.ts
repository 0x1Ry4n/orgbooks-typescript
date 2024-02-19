import { env } from "@/config/env/env";
import { PrismaClient } from "@prisma/client";
import logger from "../logger";

const prisma = new PrismaClient({
    log: env.NODE_ENV === "dev" ? ["query"] : [],
});

prisma.$connect().then(() => {
    logger.info("Database connected!");
});

export { prisma };
