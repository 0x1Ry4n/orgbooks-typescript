import { Admin } from "@prisma/client";
import { prisma } from "@/config/database/prisma";
import { AdminData, IAdminRepository } from "./interfaces/IAdminRepository";

export class AdminRepository implements IAdminRepository {
    async create(data: AdminData): Promise<Admin> {
        const createdAdmin = await prisma.admin.create({
            data: data,
        });

        return createdAdmin;
    }

    async findById(id: string): Promise<Admin | null> {
        const findedAdmin = await prisma.admin.findFirst({
            where: {
                id,
            },
        });

        if (!findedAdmin) return null;

        return findedAdmin;
    }

    async list(): Promise<Admin[]> {
        return await prisma.admin.findMany();
    }

    async update(id: string, data: AdminData): Promise<Admin | null> {
        const updatedAdmin = await prisma.admin.update({
            where: {
                id,
            },
            data: data,
        });

        if (!updatedAdmin) {
            return null;
        }

        return updatedAdmin;
    }

    async delete(id: string): Promise<Admin> {
        const deletedAdmin = await prisma.admin.delete({
            where: {
                id,
            },
        });

        return deletedAdmin;
    }
}
