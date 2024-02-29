/* eslint-disable no-loops/no-loops */
import { PermissionFlags } from "@prisma/client";
import { RequestHandler } from "express";
import { statusCode } from "@/utils";
import logger from "@/config/logger";

type PermissionsProps = {
    flags: PermissionFlags[];
};

const permissionsMiddleware =
    (props: PermissionsProps): RequestHandler =>
    (req, res, next) => {
        let isAuthorized = false;

        const { flags } = props;

        logger.info(req.user);

        for (const requiredFlag of flags) {
            if (req.user!.permissions.includes(requiredFlag)) {
                isAuthorized = true;
            } else {
                isAuthorized = false;
                break;
            }
        }

        if (!isAuthorized) {
            return res.status(statusCode.FORBIDDEN).json({ 
                success: false, 
                message: "User does not have the required permissions" 
            });
        }

        next();
    };

export default permissionsMiddleware;
