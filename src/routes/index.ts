/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { Response } from "express";
import { helloSchema } from "../validators/schemas";
import { TypedRequest, validateRequest } from "../middlewares/requestValidator";

const router = express.Router();

router.post("/", validateRequest(helloSchema), (req: TypedRequest<typeof helloSchema>, res: Response) => {
    const { message } = req.body;

    res.status(200).json({ message });
});

export default router;
