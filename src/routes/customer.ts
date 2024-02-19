import { Router } from "express";
import { CustomerController } from "@/controllers";
import passportHandler from "@/services/passport";
import permissionsMiddleware from "@/middlewares/permissions";

const customerController = new CustomerController();

const routes = Router();

routes.post("/signup", customerController.authSignUp);
routes.post("/login", customerController.authLogin);

routes.use(passportHandler.forceAuthenticated);

routes.post("/logout", customerController.authLogout);

routes.put(
    "/:id/update",
    permissionsMiddleware({
        flags: ["CUSTOMER_EDIT"],
    }),
    customerController.updateById,
);

routes.get(
    "/:id",
    permissionsMiddleware({
        flags: ["CUSTOMER_LIST"],
    }),
    customerController.findById,
);

routes.delete(
    "/:id/delete",
    permissionsMiddleware({
        flags: ["CUSTOMER_DELETE"],
    }),
    customerController.deleteById,
);

export default routes;
