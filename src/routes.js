const express = require("express");
const multer = require("multer");
const { 
    registerUser, 
    loginUser, 
    getUserById, 
    getAllUsers, 
    getProductById, 
    handleInvalidMethod, 
    createProduct, 
    getProductsByOwner, 
    getProductByCategory,
    getAllProducts,
    searchProductByName,
    classifyImage // Import the classifyImage handler
} = require('./handlers.js');

const router = express.Router();
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

// User routes
router.post('/register', upload.single('imageUrl'), registerUser);
router.post('/login', loginUser);
router.get('/users/:id', getUserById);
router.get('/users', getAllUsers);

// Product routes
router.post('/product', upload.fields([{ name: 'productImage' }, { name: 'marketImage' }]), createProduct);
router.get('/products/:id', getProductById);
router.get('/products', getAllProducts);

// Product by owner
router.get('/user/owner/product/:owner', getProductsByOwner);
router.post('/user/owner/product', upload.fields([{ name: 'productImage', maxCount: 1 }, { name: 'marketImage', maxCount: 1 }]), getProductsByOwner);

// Product by category
router.get('/category/categories/product/:category', getProductByCategory);
router.post('/category/categories/product', upload.fields([{ name: 'productImage', maxCount: 1 }, { name: 'marketImage', maxCount: 1 }]), getProductByCategory);

// Product by name
router.get('/products/search/:name', searchProductByName);

// Prediction route
router.post('/predict', upload.single('image'), classifyImage); // Add the /predict route

// Middleware to handle invalid methods
router.use('/register', handleInvalidMethod);
router.use('/login', handleInvalidMethod);
router.use('/users/:id', handleInvalidMethod);
router.use('/users', handleInvalidMethod);
router.use('/product', handleInvalidMethod);
router.use('/products/:id', handleInvalidMethod);

module.exports = router;
