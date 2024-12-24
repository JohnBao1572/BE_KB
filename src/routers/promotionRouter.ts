import { Router } from "express";
import { addNewPromotion } from "../controllers/protion";

const router = Router();

router.post('/add-new-promotion', addNewPromotion)

export default router;