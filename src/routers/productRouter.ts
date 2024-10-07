import { Router } from "express";
import { addCategory, addProduct, addSubProduct, deleteCategories, filterProducts, getCategories, getCategoryDetail, getProductDetail, getProducts, removeProduct, removeSubProduct, updateCategory, updateProduct, updateSubProduct } from "../controllers/product";


const router = Router();

// Categoris
router.get('/get-category',getCategories);
router.post('/add-category',addCategory);
router.put('/update-category',updateCategory);
router.delete('delete-category',deleteCategories);
router.get('/categoris/detail',getCategoryDetail);
router.post('/filter-products',filterProducts);

// (Product): getProducts, addProduct, updateProduct,  removeProduct, getProductDetail,
router.post('/add-new', addProduct);
router.get('/', getProducts);
router.get('/detail',getProductDetail);
router.post('/add-sub-product', addSubProduct);
router.delete('/delete-product',removeProduct);
router.put('/update-product',updateProduct);
router.delete('/remove-sub-product',removeSubProduct);
router.put('/update-sub-product', updateSubProduct);

export default router;