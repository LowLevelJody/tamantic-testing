const { format } = require("util");
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { Firestore } = require('@google-cloud/firestore');
const jwt = require('jsonwebtoken');
const { Storage } = require('@google-cloud/storage');
const firestore = new Firestore();
const storage = new Storage();
const productBucketName = process.env.PRODUCT_BUCKET_NAME; 
const marketBucketName = process.env.MARKET_BUCKET_NAME; 
const jwtSecret = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'Tolong isi semua field !' });
    }

    if (!phone.startsWith('+62')) {
        return res.status(400).json({ message: 'Nomor telepon harus dimulai dengan +62' });
    }

    // Remove non-numeric characters and convert to integer
    const phoneNumber = parseInt(phone.replace(/\D/g, ''));

    try {
        // Check if email already exists
        const emailQuery = await firestore.collection('users').where('email', '==', email).get();
        if (!emailQuery.empty) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        const newUser = {
            id: uuidv4(),
            name,
            email,
            phone: phoneNumber,
            password,
            registerDate: new Date().toISOString(),
            updatedDate: new Date().toISOString()
        };

        // Save to Firestore
        const docRef = firestore.collection('users').doc(newUser.id);
        await docRef.set(newUser);

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Tidak bisa register' });
    }
};



const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Tolong isi semua field !' });
    }

    try {
        // Check if email and password match
        const userQuery = await firestore.collection('users').where('email', '==', email).where('password', '==', password).get();
        if (userQuery.empty) {
            return res.status(400).json({ message: 'Email atau password salah' });
        }

        const user = userQuery.docs[0].data();
        const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });

        res.status(200).json({
            msg: 'success',
            result: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                token: token
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Tidak bisa login' });
    }
}

const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const docRef = firestore.collection('users').doc(userId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = doc.data();
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            registerDate: user.registerDate,
            updatedDate: user.updatedDate
        };

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Tidak bisa mendapatkan user' });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const usersRef = firestore.collection('users');
        const snapshot = await usersRef.get();

        const usersData = [];
        snapshot.forEach(doc => {
            const userData = {
                id: doc.id,
                name: doc.data().name,
                phone: doc.data().phone,
                registerDate: doc.data().registerDate
            };
            usersData.push(userData);
        });

        res.status(200).json({ data: usersData });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Tidak bisa mendapatkan data pengguna' });
    }
};

//Handler to upload product
const createProduct = async (req, res) => {
    const { name, owner, alamat, phone, rate, sold, categories, description } = req.body;
    const productImage = req.files.productImage[0];
    const marketImage = req.files.marketImage[0];

    if (!name || !owner || !alamat || !phone || !rate || !sold || !categories || !productImage || !marketImage || !description) {
        return res.status(400).json({ message: 'All fields are required including images and description.' });
    }

    try {
        const productImageUrl = await uploadImageToStorage(productImage, productBucketName);
        const marketImageUrl = await uploadImageToStorage(marketImage, marketBucketName);

        const newProduct = {
            id: uuidv4(),
            name,
            image: productImageUrl,
            imageMarket: marketImageUrl,
            owner,
            alamat,
            phone: parseInt(phone),
            rate: parseFloat(rate),
            sold: parseInt(sold),
            postdate: new Date().toISOString(),
            categories: categories.split(',').map(cat => cat.trim()),
            description
        };

        await firestore.collection('products').doc(newProduct.id).set(newProduct);

        res.status(201).json({ data: [newProduct] });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Cannot create product' });
    }
};

const uploadImageToStorage = (file, bucketName) => {
    return new Promise((resolve, reject) => {
        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype
        });

        blobStream.on('finish', () => {
            const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
            resolve(publicUrl);
        }).on('error', (error) => {
            console.error('Error:', error.message);
            reject('Unable to upload image');
        }).end(file.buffer);
    });
};


const getProductById = async (req, res) => {
    const productId = req.params.id;

    try {
        const productDoc = await firestore.collection('products').doc(productId).get();

        if (!productDoc.exists) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = productDoc.data();
        res.status(200).json({ data: [product] });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Cannot retrieve product' });
    }
};

//product by owner
const getProductsByOwner = async (req, res) => {
    const ownerName = req.params.owner;

    try {
        const productQuery = await firestore.collection('products').where('owner', '==', ownerName).get();

        if (productQuery.empty) {
            return res.status(404).json({ message: 'No products found for the given owner' });
        }

        const products = [];
        productQuery.forEach(doc => {
            products.push(doc.data());
        });

        res.status(200).json({ data: products });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Cannot retrieve products' });
    }
};

//prodcut by category
const getProductByCategory = async (req, res) => {
    const category = req.params.category;

    try {
        const productQuery = await firestore.collection('products').where('categories', 'array-contains', category).get();

        if (productQuery.empty) {
            return res.status(404).json({ message: 'No products found for the given category' });
        }

        const products = [];
        productQuery.forEach(doc => {
            products.push(doc.data());
        });

        res.status(200).json({ data: products });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Cannot retrieve products' });
    }
};

//Middleware to handle error
const handleInvalidMethod = (req, res, next) => {
    res.status(405).json({ message: 'Error: Method not allowed' });
};

module.exports = { registerUser, loginUser, getUserById, getAllUsers, createProduct, handleInvalidMethod, getProductById, getProductByCategory, getProductsByOwner };



