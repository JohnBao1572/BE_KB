import { Router } from "express";
import { addWishItem, getWishItem, removeWishItem, updateWishItem } from "../controllers/listItem";


const router = Router();

router.post('/add-new-wishList', addWishItem);
router.get('/', getWishItem)
router.put('/update-wish-item', updateWishItem);
router.delete('/delete', removeWishItem)

export default router;