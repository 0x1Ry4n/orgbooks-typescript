import { AnyZodObject, ZodError } from "zod";
import { RequestHandler } from "express";
import { statusCode } from "@/utils";

type ValidatorProps = {
    body?: AnyZodObject;
    params?: AnyZodObject;
    query?: AnyZodObject;
};

export const validateRequest =
    (schema: ValidatorProps): RequestHandler =>
    async (req, res, next) => {
        try {
            const { body, params, query } = schema;

            if (body) req.body = await body.parseAsync(req.body);
            if (params) req.params = await params.parseAsync(req.params);
            if (query) req.query = await query.parseAsync(req.query);

            next();
        } catch (error) {
            const zodError = error as ZodError;

            res.status(statusCode.UNPROCESSABLE_ENTITY).json({ errors: zodError.errors });
        }
    };
