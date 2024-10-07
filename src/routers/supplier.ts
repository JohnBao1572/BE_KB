import { Router } from "express";
import { addNew, getExportData, getForm, getSuppliers, removeSupplier, update } from "../controllers/supplier";


const router = Router();

router.get('/get-supplier', getSuppliers);
router.post('/get-export-data', getExportData);
router.post('/add-new', addNew);
router.put('/update-supplier',update);
router.delete('/delete-supplier', removeSupplier);
router.get('/get-form',getForm);

export default router;