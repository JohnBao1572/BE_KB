import { Router } from "express";
import { create, getVerifyCode, resendCode, login, updateCus } from "../controllers/customer";

const router = Router();

router.post('/add-new', create)
router.put('/verify', getVerifyCode)
router.get('/resend-verify', resendCode)
router.post('/login', login)
router.put('/update', updateCus)


export default router;
