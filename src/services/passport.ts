import { Request, Response, NextFunction } from "express";
import { statusCode, compareHash } from "@/utils";
import { prisma } from "@/config/database/prisma";
import { PassportStatic } from "passport";
import passportLocal from "passport-local";

const initialize = (passport: PassportStatic) => {
    passport.serializeUser((user: Express.User, done) => {
        done(null, {
            id: user.id,
            email: user.email,
            userType: user.userType,
            permissions: user.permissions,
        });
    });

    passport.deserializeUser(async (user: Express.User, done) => {
        switch (user.userType) {
            case "ADMIN": {
                const admin = await prisma.admin.findFirst({
                    where: { id: user.id },
                    include: { authData: true },
                });

                if (!admin) return done(new Error("Passport: Admin not found!"), null);

                done(null, {
                    id: admin.id,
                    email: admin.authData.email,
                    userType: admin.authData.userType,
                    permissions: admin.authData.permissions,
                });

                break;
            }
            case "CUSTOMER": {
                const customer = await prisma.customer.findFirst({
                    where: { id: user.id },
                    include: { authData: true },
                });

                if (!customer) return done(new Error("Passport: Customer not found!"), null);

                done(null, {
                    id: customer.id,
                    email: customer.authData.email,
                    userType: customer.authData.userType,
                    permissions: customer.authData.permissions,
                });

                break;
            }
            default: {
                done(new Error("Passport: Cannot deserialize user!"), null);
                break;
            }
        }
    });

    passport.use(
        "admin",
        new passportLocal.Strategy(
            {
                usernameField: "email",
                passwordField: "password",
            },
            async (email, password, done) => {
                const admin = await prisma.admin.findFirst({
                    where: {
                        authData: {
                            email,
                        },
                    },
                    include: { authData: true },
                });

                if (!admin) return done(null, false, { message: "Admin email not found!" });

                const isSamePassword = await compareHash({ plainText: password, hash: admin.authData.passwordHash });

                if (!isSamePassword) {
                    return done(null, false, { message: "Incorrect admin password!" });
                }

                return done(null, {
                    id: admin.id,
                    email: admin.authData.email,
                    userType: admin.authData.userType,
                    permissions: admin.authData.permissions,
                });
            },
        ),
    );

    passport.use(
        "customer",
        new passportLocal.Strategy(
            {
                usernameField: "email",
                passwordField: "password",
            },
            async (email, password, done) => {
                const customer = await prisma.customer.findFirst({
                    where: {
                        authData: {
                            email,
                        },
                    },
                    include: { authData: true },
                });

                if (!customer) return done(null, false, { message: "Customer email not found!" });

                const isSamePassword = await compareHash({ plainText: password, hash: customer.authData.passwordHash });

                if (!isSamePassword) {
                    return done(null, false, {
                        message: "Incorrect customer password!",
                    });
                }

                return done(null, {
                    id: customer.id,
                    email: customer.authData.email,
                    userType: customer.authData.userType,
                    permissions: customer.authData.permissions,
                });
            },
        ),
    );
};

const forceAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) return next();

    return res.status(statusCode.UNAUTHORIZED).json({ success: false, message: "User is not authenticated. Please log in to access this resource." });
};

const passportHandler = { initialize, forceAuthenticated };

export default passportHandler;
