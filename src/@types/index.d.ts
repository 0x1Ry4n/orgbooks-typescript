import { UserType, PermissionFlags } from "@prisma/client";

export {};

declare global {
    namespace Express {
        interface User {
            id: string;
            email: string;
            userType: UserType;
            permissions: PermissionFlags[];
        }
    }
}
