import { Router } from "express";
import { create } from "../controllers/customer";

const router = Router();

router.post('/add-new', create)

export default router;
