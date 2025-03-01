import { Router } from "express";
import { create, getVerifyCode, resendCode, login, updateCus, getAccCus } from "../controllers/customer";

const router = Router();

router.post('/add-new', create)
router.put('/verify', getVerifyCode)
router.get('/resend-verify', resendCode)
router.post('/login', login)
router.put('/update', updateCus)
router.get('/get-profile', getAccCus)


export default router;
