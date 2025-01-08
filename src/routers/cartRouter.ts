import { Router } from "express";
import { addCartProduct } from "../controllers/cart";

const router = Router();

router.post('/add-cart', addCartProduct);

export default router;