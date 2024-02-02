import { z } from "zod";

export const helloSchema = z.object({
    body: z.object({
        message: z.string().max(200),
    }),
});
