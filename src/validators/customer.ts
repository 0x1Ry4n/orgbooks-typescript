import { z } from "zod";
import { Request } from "express";

const customerSignUpSchema = z.object({
    username: z.string().min(1).max(50),
    email: z.string().email().min(1).max(254),
    password: z.string().min(1).max(50),
    phoneNumber: z.string().min(7).max(15),
    birthDate: z.coerce.date().optional(),
    imageLocation: z.string().optional(),
});

const customerLoginSchema = z.object({
    email: z.string().email().min(1).max(254),
    password: z.string().min(1).max(50),
});

const customerUpdateSchema = z.object({
    phoneNumber: z.string().min(7).max(15),
    birthDate: z.coerce.date().optional(),
});

const customerIdParamSchema = z.object({
    id: z.string().uuid(),
});

interface SignUpRequest extends Request {
    body: z.infer<typeof customerSignUpSchema>;
}

interface LoginRequest extends Request {
    body: z.infer<typeof customerLoginSchema>;
}

interface UpdateCustomerRequest extends Request {
    params: { id: string };
    body: z.infer<typeof customerUpdateSchema>;
}

export {
    customerSignUpSchema, 
    customerLoginSchema, 
    customerUpdateSchema, 
    customerIdParamSchema, 
    SignUpRequest, 
    LoginRequest, 
    UpdateCustomerRequest 
};
