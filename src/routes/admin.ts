import { Router } from "express";
import { AdminController } from "@/controllers";
import { validateRequest } from "@/middlewares";
import { adminSignUpSchema, adminLoginSchema, adminUpdateBodySchema, adminIdParamSchema } from "@/validators/admin";
import passportHandler from "@/services/passport";
import permissionsMiddleware from "@/middlewares/permissions";

const adminController = new AdminController();

const routes = Router();

routes.post("/signup", validateRequest({ body: adminSignUpSchema }), adminController.authSignUp);
routes.post("/login", validateRequest({ body: adminLoginSchema }), adminController.authLogin);

routes.use(passportHandler.forceAuthenticated);

routes.post("/logout", adminController.authLogout);
routes.put(
    "/:id/update",
    permissionsMiddleware({ flags: ["ADMIN_EDIT"] }),
    validateRequest({ body: adminUpdateBodySchema, params: adminIdParamSchema }),
    adminController.updateById,
);
routes.get("/:id", permissionsMiddleware({ flags: ["ADMIN_LIST"] }), validateRequest({ params: adminIdParamSchema }), adminController.findById);
routes.delete("/:id/delete", permissionsMiddleware({ flags: ["ADMIN_DELETE"] }), validateRequest({ params: adminIdParamSchema }), adminController.deleteById);

export default routes;
