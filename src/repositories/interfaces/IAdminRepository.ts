import { Admin } from "@prisma/client";

export type AdminData = {
    username: string;
    email: string;
    passwordHash: string;
    salt: string;
    phoneNumber: string;
    birthDate?: Date;
    imageLocation?: string;
    bookstoreId?: string;
};

export interface IAdminRepository {
    create(data: AdminData): Promise<Admin>;
    update(id: string, data: AdminData): Promise<Admin | null>;
    delete(id: string): Promise<Admin | null>;
    findById(id: string): Promise<Admin | null>;
    list(): Promise<Admin[]>;
}
