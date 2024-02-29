import { Router } from "express";
import { CustomerController } from "@/controllers";
import { validateRequest } from "@/middlewares";
import { customerSignUpSchema, customerLoginSchema, customerUpdateSchema, customerIdParamSchema } from "@/validators/customer";
import passportHandler from "@/services/passport";
import permissionsMiddleware from "@/middlewares/permissions";

const customerController = new CustomerController();

const routes = Router();

routes.post(
    "/signup", 
    validateRequest({ body: customerSignUpSchema }), 
    customerController.authSignUp
);
routes.post(
    "/login",
    validateRequest({ body: customerLoginSchema }), 
    customerController.authLogin
);

routes.use(passportHandler.forceAuthenticated);

routes.post("/logout", customerController.authLogout);

routes.put(
    "/:id/update",
    permissionsMiddleware({ flags: ["CUSTOMER_EDIT"] }),
    validateRequest({ body: customerUpdateSchema, params: customerIdParamSchema }),
    customerController.updateById,
);

routes.get(
    "/:id",
    permissionsMiddleware({ flags: ["CUSTOMER_LIST"], }),
    validateRequest({ params: customerIdParamSchema }),
    customerController.findById,
);

routes.delete(
    "/:id/delete",
    permissionsMiddleware({ flags: ["CUSTOMER_DELETE"] }),
    validateRequest({ params: customerIdParamSchema }),
    customerController.deleteById,
);

export default routes;
