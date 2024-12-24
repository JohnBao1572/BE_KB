import { Router } from "express";
import { addCategory, addProduct, addSubProduct, deleteCategories, filterProducts, getCategories, getCategoryDetail, getFilterValues, getProductDetail, getProducts, removeProduct, removeSubProduct, updateCategory, updateProduct, updateSubProduct } from "../controllers/product";
import { verifyToken } from "../middlewares/verifyToken";


const router = Router();
router.get('/', getProducts);
router.get('/detail', getProductDetail);
router.get('/get-categories', getCategories);
router.get('/categories/detail', getCategoryDetail);
router.get('/get-filter-values', getFilterValues);
router.use(verifyToken);

router.post('/add-new', addProduct);


router.post('/add-sub-product', addSubProduct);
router.delete('/delete', removeProduct);
router.put('/update', updateProduct);
router.delete('/remove-sub-product', removeSubProduct);
router.put('/update-sub-product', updateSubProduct);

// categories
router.post('/add-category', addCategory);


router.delete('/delete-category', deleteCategories);
router.put('/update-category', updateCategory);

router.post('/filter-products', filterProducts);

export default router;