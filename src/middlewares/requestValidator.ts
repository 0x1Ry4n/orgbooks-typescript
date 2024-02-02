/* eslint-disable @typescript-eslint/no-explicit-any */

import { ZodObject, AnyZodObject, TypeOf, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

type ValidatorProps = ZodObject<{
    body?: AnyZodObject;
    params?: AnyZodObject;
    query?: AnyZodObject;
}>;

export type TypedRequest<T extends ValidatorProps> = TypeOf<T>;

export const validateRequest = (schema: ValidatorProps) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            next();
        } catch (error) {
            const zodError = error as ZodError;

            res.status(422).json({ errors: zodError.errors });
        }
    };
};
