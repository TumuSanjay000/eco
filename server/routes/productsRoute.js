const router = require("express").Router();
const Product = require("../models/productModul");
const authMiddleWare = require("../middlewares/authMiddleware");
const  cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");

// add a new product
router.post("/add-product", authMiddleWare, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.send({
      message: "Product added successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

// get all products
router.post("/get-products", async (req, res) => {
  try {
    const {seller, categories=[], age=[]} = req.body;
    let filters = {};
    if (seller){
      filters.seller = seller;
    }
    const products = await Product.find(filters).sort({ createdAt: -1 });
    res.send({
      products,
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

router.put('/edit-product/:id', authMiddleWare, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "error.message",
    });
  }
});

router.delete('/delete-product/:id', authMiddleWare, async (req, res) => {
  try {
    const products = await Product.find().sort({createdAt: -1});
    res.send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "error.message",
    });
  }
});

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});


router.post('/upload-image-to-product',authMiddleWare,multer({ storage: storage }).single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {folder:"ecom_images",});
    const productId = req.body.productId;
    await Product.findByIdAndUpdate(productId,{
      $push: {image: result.secure_url},
    });
    res.send({
      success: true,
      message: "Image uploded suddessfully",
      data : result.secure_url,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "error.message",
    })
  }
});


// update product status
router.put('/update-product-status/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Received request to update status:', req.params.id, req.body.status); // Debug log
    const { status } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { status });
    res.send({
      success: true,
      message: 'Product status updated successfully',
    });
  } catch (error) {
    console.log('Error updating product status:', error.message); // Debug log
    res.send({
      success: false,
      message: error.message,
    });
  }
});


module.exports = router;