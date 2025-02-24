import { Router } from "express";
import { addNewRe, getAll, getData, getTopReviewStar, updateRe } from "../controllers/reviewCus";
import { verifyToken } from "../middlewares/verifyToken";


const router = Router();
router.get('/', getAll);
router.get('/getTop5Start',getTopReviewStar)

router.use(verifyToken);

router.post('/add-new', addNewRe);
router.put('/update', updateRe);
router.get('/get-start-count', getData);

export default router;