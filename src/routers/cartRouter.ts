import { Router } from "express";
import { addCartProduct, getCartItems } from "../controllers/cart";

const router = Router();

router.post('/add-cart', addCartProduct);
router.get('/', getCartItems);

export default router;