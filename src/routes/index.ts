import { Router } from "express";
import adminRoutes from "./admin";
import customerRoutes from "./customer";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/customer", customerRoutes);

export default router;
