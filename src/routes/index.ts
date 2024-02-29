import { Router } from "express";
import adminRoutes from "./admin";
import customerRoutes from "./customer";
import bookstoreRoutes from "./bookstore";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/customer", customerRoutes);
router.use("/bookstore", bookstoreRoutes);

export default router;
