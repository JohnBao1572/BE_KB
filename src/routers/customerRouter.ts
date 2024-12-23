import { Router } from "express";
import { create, getVerifyCode, resendCode } from "../controllers/customer";

const router = Router();

router.post('/add-new', create)
router.put('/verify', getVerifyCode)
router.get('/resend-verify', resendCode)

export default router;
