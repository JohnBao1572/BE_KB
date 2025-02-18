import { Router } from "express";
import { addNewPromotion, checkDiscountCode, deletePromotion, getPromotions, updatePromotion } from "../controllers/protion";

const router = Router();

router.post('/add-new', addNewPromotion)
router.get('/get-promotions', getPromotions)
router.put('/update-promotion', updatePromotion)
router.delete('/delete-promotion', deletePromotion)
router.get('/check', checkDiscountCode)

export default router;