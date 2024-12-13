import { Router } from "express";
import { create, getVerifyCode } from "../controllers/customer";

const router = Router();

router.post('/add-new', create)
router.post('/verify', getVerifyCode)

export default router;
