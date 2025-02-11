import { Router } from "express";
import { addCartProduct, addNewAddress, clearCardByUser, getAddressCus, getCartItems, removeCartItem, updateNewAddress, updateProductInCart } from "../controllers/cart";

const router = Router();

router.post('/add-cart', addCartProduct);
router.put('/update', updateProductInCart);
router.get('/', getCartItems);
router.delete('/remove-cart', removeCartItem);
router.post('/addNewAddress', addNewAddress);
router.put('/updateNewAddress', updateNewAddress);
router.get('/getAddCus', getAddressCus);
router.get('/clearCart', clearCardByUser);


export default router;