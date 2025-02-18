import { Router } from "express";
import { getDailyReport, getMonthlyReport } from "../controllers/reportController";

const router = Router();
router.get('/getBillInThatDay', getDailyReport)
router.get('/getBillInThatMonth', getMonthlyReport)

export default router