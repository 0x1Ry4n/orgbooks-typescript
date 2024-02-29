import { Request } from "express";
import { z } from "zod";

const createBookstoreSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phoneNumber: z.string().min(7).max(15),
    cep: z.string().max(9),
})

const updateBookstoreSchema = z.object({
    name: z.string(),
    cep: z.string()
})

const bookstoreIdParamSchema = z.object({
    id: z.string().uuid(),
});

interface CreateBookstoreRequest extends Request {
    body: z.infer<typeof createBookstoreSchema>
}

interface UpdateBookstoreRequest extends Request {
    body: z.infer<typeof updateBookstoreSchema>
}

export { 
    createBookstoreSchema, 
    updateBookstoreSchema, 
    bookstoreIdParamSchema, 
    CreateBookstoreRequest, 
    UpdateBookstoreRequest 
};



