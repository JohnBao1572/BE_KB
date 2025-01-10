import { Router } from "express";
import { addCartProduct, getCartItems, removeCartItem } from "../controllers/cart";

const router = Router();

router.post('/add-cart', addCartProduct);
router.get('/', getCartItems);
router.delete('/remove-cart', removeCartItem);

export default router;