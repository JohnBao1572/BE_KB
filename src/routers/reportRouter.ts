import { Router } from "express";
import { existUpdateBillToReport, get5ProductBought, getDailyReport, getMonthlyReport, getTotalBill } from "../controllers/reportController";

const router = Router();
router.post('/existUpdate', existUpdateBillToReport)
router.get('/getBillInThatDay', getDailyReport)
router.get('/getBillInThatMonth', getMonthlyReport)
router.get('/totalOrder', getTotalBill);
router.get('/top5ProductBestSell', get5ProductBought)

export default router