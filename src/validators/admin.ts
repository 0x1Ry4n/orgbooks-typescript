import { z } from "zod";
import { Request } from "express";

const adminSignUpSchema = z.object({
    username: z.string().min(1).max(50),
    email: z.string().email().min(1).max(254),
    password: z.string().min(1).max(50),
    phoneNumber: z.string().min(7).max(15),
    birthDate: z.coerce.date().optional(),
    imageLocation: z.string().optional(),
});

const adminLoginSchema = z.object({
    email: z.string().email().min(1).max(254),
    password: z.string().min(1).max(50),
});

const adminUpdateBodySchema = z.object({
    phoneNumber: z.string().min(7).max(15),
    birthDate: z.coerce.date().optional(),
});

const adminIdParamSchema = z.object({
    id: z.string().uuid(),
});

interface SignUpRequest extends Request {
    body: z.infer<typeof adminSignUpSchema>;
}

interface LoginRequest extends Request {
    body: z.infer<typeof adminLoginSchema>;
}

interface UpdateAdminRequest extends Request {
    params: z.infer<typeof adminIdParamSchema>;
    body: z.infer<typeof adminUpdateBodySchema>;
}

export { adminLoginSchema, adminSignUpSchema, adminIdParamSchema, adminUpdateBodySchema, LoginRequest, SignUpRequest, UpdateAdminRequest };
