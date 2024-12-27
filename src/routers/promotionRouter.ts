import { Router } from "express";
import { addNewPromotion, getPromotions } from "../controllers/protion";

const router = Router();

router.post('/add-new', addNewPromotion)
router.get('/get-promotions', getPromotions)

export default router;