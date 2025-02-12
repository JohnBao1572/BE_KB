import { Router } from "express";
import { addCartProduct, addNewAddress, clearCardByUser, deleteAddressCus, getAddressCus, getCartItems, removeCartItem, updateNewAddress, updateProductInCart } from "../controllers/cart";

const router = Router();

router.post('/add-new', addCartProduct);
router.put('/update', updateProductInCart);
router.get('/', getCartItems);
router.delete('/remove', removeCartItem);
router.post('/add-new-address', addNewAddress);
router.put('/update-address', updateNewAddress);
router.get('/get-address', getAddressCus);
router.delete('/remove-address', deleteAddressCus);
router.get('/clear-carts', clearCardByUser);


export default router;