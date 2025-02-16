import { Router } from "express";
import {  existUpdateBillToReport, getDailyReport, getMonthlyReport } from "../controllers/reportController";

const router = Router();
router.get('/getBillInThatDay', getDailyReport)
router.get('/getBillInThatMonth', getMonthlyReport)
router.post('/existUpdate', existUpdateBillToReport)

export default router