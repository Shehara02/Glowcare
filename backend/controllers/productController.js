/* ========================================
   PRODUCT CONTROLLER
   ======================================== */

const Product = require('../models/Product');
const { ErrorHandler } = require('../middleware/errorHandler');

// Get All Products
const getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      skinType,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Build filter
    const filter = { isActive: true };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (skinType && skinType !== 'all') {
      filter.skinType = { $in: [skinType] };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNum - 1) * pageSize;

    // Sort
    const sortObj = {};
    sortObj[sortBy] = order === 'asc' ? 1 : -1;

    // Execute query
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(pageSize)
      .populate('reviews.user', 'name');

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / pageSize);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Product
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('reviews.user', 'name profileImage');

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Create Product (Admin)
const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, skinType, price, stock, image } = req.body;

    // Validation
    if (!name || !description || !category || !skinType || !price) {
      return next(new ErrorHandler('Please fill in all required fields', 400));
    }

    const product = new Product({
      name,
      description,
      category,
      skinType: Array.isArray(skinType) ? skinType : [skinType],
      price,
      stock: stock || 0,
      image: image || null
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Update Product (Admin)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Delete Product (Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add Review
const addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return next(new ErrorHandler('Rating must be between 1 and 5', 400));
    }

    const product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.some(
      review => review.user.toString() === req.userId
    );

    if (alreadyReviewed) {
      return next(new ErrorHandler('You have already reviewed this product', 400));
    }

    product.reviews.push({
      user: req.userId,
      rating,
      comment
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
};
