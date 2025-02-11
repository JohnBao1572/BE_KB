import { Router } from "express";
import { addCartProduct, clearCardByUser, getCartItems, removeCartItem, updateProductInCart } from "../controllers/cart";

const router = Router();

router.post('/add-cart', addCartProduct);
router.put('/update', updateProductInCart);
router.get('/', getCartItems);
router.delete('/remove-cart', removeCartItem);
router.get('/clearCart', clearCardByUser);


export default router;