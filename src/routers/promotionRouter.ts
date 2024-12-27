import { Router } from "express";
import { addNewPromotion, deletePromotion, getPromotions, updatePromotion } from "../controllers/protion";

const router = Router();

router.post('/add-new', addNewPromotion)
router.get('/get-promotions', getPromotions)
router.put('/update-promotion', updatePromotion)
router.delete('/delete-promotion', deletePromotion)

export default router;