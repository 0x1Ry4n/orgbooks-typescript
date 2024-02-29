import { Router } from "express";
import { BookstoreController } from "@/controllers";
import { validateRequest } from "@/middlewares";
import { createBookstoreSchema, updateBookstoreSchema, bookstoreIdParamSchema } from "@/validators/bookstore";
import passportHandler from "@/services/passport";
import permissionsMiddleware from "@/middlewares/permissions";

const bookstoreController = new BookstoreController();

const routes = Router();

routes.use(passportHandler.forceAuthenticated);

routes.post(
    "/create", 
    permissionsMiddleware({ flags: ["BOOKSTORE_CREATE"] }), 
    validateRequest({ body: createBookstoreSchema }), 
    bookstoreController.createBookstore
)

routes.put(
    "/:id/update",
    permissionsMiddleware({ flags: ["BOOKSTORE_EDIT"] }),
    validateRequest({ body: updateBookstoreSchema, params: bookstoreIdParamSchema }),
    bookstoreController.updateById,
);

routes.get(
    "/:id", 
    permissionsMiddleware({ flags: ["BOOKSTORE_LIST"] }), 
    validateRequest({ params: bookstoreIdParamSchema }), 
    bookstoreController.findById
);

routes.delete(
    "/:id/delete", 
    permissionsMiddleware({ flags: ["BOOKSTORE_DELETE"] }), 
    validateRequest({ params: bookstoreIdParamSchema }), 
    bookstoreController.deleteById
);

export default routes;
