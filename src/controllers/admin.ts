import { Request, Response, NextFunction } from "express";
import { SignUpRequest, LoginRequest, UpdateAdminRequest } from "@/validators/admin";
import { statusCode, generateHash } from "@/utils";
import { prisma } from "@/config/database/prisma";
import passport from "passport";
import logger from "@/config/logger";

export class AdminController {
    async authLogin(req: LoginRequest, res: Response, next: NextFunction) {
        try {
            passport.authenticate("admin", (err: Error, user: Express.User, info: object, code: number) => {
                if (err) {
                    return res.status(statusCode.INTERNAL_ERROR).json({ success: false, message: err.message });
                }

                if (!user) {
                    return res.status(code || 401).json({ success: false, message: info });
                }

                req.login(user, (err) => {
                    logger.info(user);
                    if (err) res.json({ success: false, message: err });

                    res.json({ success: true, data: user });
                });
            })(req, res, next);
        } catch (error) {
            res.status(statusCode.INTERNAL_ERROR).json({
                success: false,
                message: error,
            });
        }
    }

    async authLogout(req: Request, res: Response, next: NextFunction) {
        res.clearCookie("connect.sid");

        req.logout((err) => {
            if (err) return next(err);

            req.session.destroy((err) => {
                if (err) return next(err);

                res.send();
            });
        });
    }

    async authSignUp(req: SignUpRequest, res: Response) {
        try {
            const { username, password, email, phoneNumber, birthDate, imageLocation } = req.body;

            const hashedPassword = await generateHash(password);

            const admin = await prisma.admin.create({
                data: {
                    username,
                    authData: {
                        create: {
                            userType: "ADMIN",
                            email: email,
                            passwordHash: hashedPassword.hashedString,
                            salt: hashedPassword.passwordSalt,
                            permissions: [
                                "ADMIN_CREATE",
                                "ADMIN_EDIT",
                                "ADMIN_LIST",
                                "ADMIN_DELETE",
                                "BOOKSTORE_CREATE",
                                "BOOKSTORE_EDIT",
                                "BOOKSTORE_LIST",
                                "BOOKSTORE_DELETE",
                                "BOOK_CREATE",
                                "BOOK_EDIT",
                                "BOOK_LIST",
                                "BOOK_DELETE",
                                "BOOKLOAN_CREATE",
                                "BOOKLOAN_EDIT",
                                "BOOKLOAN_LIST",
                                "BOOKLOAN_DELETE",
                                "CUSTOMER_LIST",
                                "REVIEW_LIST",
                                "COMMENT_LIST",
                            ],
                        },
                    },
                    phoneNumber,
                    birthDate,
                    imageLocation,
                },
                include: {
                    authData: true,
                },
            });

            logger.info(admin);

            req.login(admin.authData, (err) => {
                if (err) return res.status(500).json({ success: false, message: err });

                return res.status(statusCode.CREATED).send({
                    success: true,
                    message: "Admin successfully created!",
                });
            });
        } catch (error) {
            res.status(statusCode.INTERNAL_ERROR).json({
                success: false,
                message: error,
            });
        }
    }

    async updateById(req: UpdateAdminRequest, res: Response) {
        try {
            const { phoneNumber, birthDate } = req.body;

            const adminUpdated = await prisma.admin.update({
                where: {
                    id: req.params.id,
                },
                data: {
                    phoneNumber,
                    birthDate,
                },
                select: {
                    phoneNumber: true,
                    birthDate: true,
                },
            });

            res.status(statusCode.OK).json({
                success: true,
                data: adminUpdated,
            });
        } catch (error) {
            res.status(statusCode.INTERNAL_ERROR).json({
                success: false,
                message: error,
            });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const adminFounded = await prisma.admin.findFirst({
                where: {
                    id: req.params.id,
                },
                select: {
                    id: true,
                    username: true,
                    phoneNumber: true,
                    birthDate: true,
                    imageLocation: true,
                    bookstoreId: true,
                },
            });

            res.status(statusCode.OK).json({
                success: true,
                data: adminFounded,
            });
        } catch (error) {
            res.status(statusCode.INTERNAL_ERROR).json({
                success: false,
                message: error,
            });
        }
    }

    async deleteById(req: Request, res: Response) {
        try {
            const adminDeleted = await prisma.admin.delete({
                where: {
                    id: req.params.id,
                },
            });

            res.status(statusCode.OK).json({
                success: true,
                data: adminDeleted,
            });
        } catch (error) {
            res.status(statusCode.INTERNAL_ERROR).json({
                success: false,
                message: error,
            });
        }
    }
}
