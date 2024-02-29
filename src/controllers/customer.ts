import { Request, Response, NextFunction } from "express";
import { statusCode, generateHash, errorHandler } from "@/utils";
import { SignUpRequest, LoginRequest, UpdateCustomerRequest } from "@/validators/customer";
import { prisma } from "@/config/database/prisma";
import passport from "passport";

export class CustomerController {
    async authLogin(req: LoginRequest, res: Response, next: NextFunction) {
        try {
            passport.authenticate("customer", (err: Error, user: Express.User, info: object, code: number) => {
                if (err) {
                    return res.status(statusCode.INTERNAL_ERROR).json({ success: false, message: err.message });
                }

                if (!user) {
                    return res.status(code || 401).json({ success: false, message: info });
                }

                req.login(user, (err) => {
                    if (err) res.json({ success: false, message: err });

                    res.json({ success: true, data: user });
                });
            })(req, res, next);
        } catch (error) {
            errorHandler(error, req, res)
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

            const customer = await prisma.customer.create({
                data: {
                    username,
                    authData: {
                        create: {
                            userType: "CUSTOMER",
                            email: email,
                            passwordHash: hashedPassword.hashedString,
                            salt: hashedPassword.passwordSalt,
                            permissions: [
                                "CUSTOMER_CREATE",
                                "CUSTOMER_EDIT",
                                "CUSTOMER_LIST",
                                "CUSTOMER_DELETE",
                                "REVIEW_CREATE",
                                "REVIEW_EDIT",
                                "REVIEW_LIST",
                                "REVIEW_DELETE",
                                "COMMENT_CREATE",
                                "COMMENT_EDIT",
                                "COMMENT_LIST",
                                "COMMENT_DELETE",
                                "BOOKLOAN_LIST",
                                "BOOKSTORE_LIST",
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

            req.login(
                {
                    id: customer.id,
                    email: customer.authData.email,
                    userType: customer.authData.userType,
                    permissions: customer.authData.permissions,
                },
                (err) => {
                    if (err) errorHandler(err, req, res)

                    return res.status(statusCode.CREATED).send({
                        success: true,
                        message: "Customer successfully created!",
                    });
                },
            );
        } catch (error) {
            errorHandler(error, req, res)
        }
    }

    async updateById(req: UpdateCustomerRequest, res: Response) {
        try {
            const { phoneNumber, birthDate } = req.body;

            const updatedCustomer = await prisma.customer.update({
                where: {
                    id: req.params.id,
                },
                data: {
                    phoneNumber,
                    birthDate,
                },
            });

            res.status(statusCode.OK).json({
                success: true,
                data: updatedCustomer,
            });
        } catch (error) {
            errorHandler(error, req, res)
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const customer = await prisma.customer.findFirst({
                where: {
                    id: req.params.id,
                },
            });

            res.status(statusCode.OK).json({
                success: true,
                data: customer,
            });
        } catch (error) {
            errorHandler(error, req, res)
        }
    }

    async deleteById(req: Request, res: Response) {
        try {
            const customer = prisma.customer.delete({
                where: {
                    id: req.params.id,
                },
            });

            res.status(statusCode.OK).json({
                success: true,
                data: customer,
            });
        } catch (error) {
            errorHandler(error, req, res)
        }
    }
}
