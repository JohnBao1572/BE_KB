import { Router } from "express";
import { addBill, customerDeleteBill, getBillCustomer, getBillForAdmin, updateOrderForCustom } from "../controllers/paymentController";
import { verifyToken } from "../middlewares/verifyToken";
import { handleSendMail } from "../utils/handleSendmail";
import path from "path";
import { readFileSync } from "fs";

const htmlFile = path.join(__dirname, '../../mails/paymentDone.html');
// console.log(readFileSync(htmlFile, 'utf-8'));
const html = readFileSync(htmlFile, 'utf-8');

const router = Router();

router.post('/add-bill', addBill);
router.get('/get-bill-admin', getBillForAdmin);
router.get('/', getBillCustomer);
router.delete('/delete-bill', customerDeleteBill);
router.put('/update', updateOrderForCustom);

router.post('/test-sendmail', async (req, res) => {
    try {
        const item = await handleSendMail({
            to: 'jonnguyen1572@gmail.com',
            subject: 'subject',
            html,
        });

        res.status(200).json({
            message: 'Done',
            data: item,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        })
    }
})

export default router;