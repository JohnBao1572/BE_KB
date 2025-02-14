import { Router } from "express";
import { getAllNotiFromCustomer, updateNoti } from "../controllers/notificationController";


const router = Router();
router.get('/', getAllNotiFromCustomer);
router.put('/updateNewOrderNoti', updateNoti);

export default router;