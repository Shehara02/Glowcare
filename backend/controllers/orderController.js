/* ========================================
   ORDER CONTROLLER
   ======================================== */

const Order = require('../models/Order');
const Product = require('../models/Product');
const { ErrorHandler } = require('../middleware/errorHandler');

// Create Order
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return next(new ErrorHandler('Cart is empty', 400));
    }

    if (!shippingAddress) {
      return next(new ErrorHandler('Shipping address is required', 400));
    }

    // Validate and fetch product details
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return next(new ErrorHandler(`Product ${item.productId} not found`, 404));
      }

      if (product.stock < item.quantity) {
        return next(
          new ErrorHandler(`Insufficient stock for ${product.name}`, 400)
        );
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        subtotal: itemSubtotal
      });

      // Reduce product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate totals
    const shippingCost = subtotal > 100 ? 0 : 10;
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const totalPrice = subtotal + shippingCost + tax;

    // Create order
    const order = new Order({
      user: req.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      totalPrice
    });

    await order.save();
    await order.populate('items.product user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Get User Orders
const getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNum - 1) * pageSize;

    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('items.product', 'name image price')
      .populate('user', 'name email');

    const total = await Order.countDocuments({ user: req.userId });

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Order Details
const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('items.product', 'name image price description')
      .populate('user', 'name email phone');

    if (!order) {
      return next(new ErrorHandler('Order not found', 404));
    }

    // Check if order belongs to user or user is admin
    if (order.user._id.toString() !== req.userId && req.role !== 'admin') {
      return next(new ErrorHandler('Unauthorized', 403));
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Get All Orders (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNum - 1) * pageSize;

    const filter = {};
    if (status) {
      filter.deliveryStatus = status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('items.product', 'name image')
      .populate('user', 'name email phone');

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update Order Status (Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deliveryStatus, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        deliveryStatus: deliveryStatus || undefined,
        paymentStatus: paymentStatus || undefined
      },
      { new: true, runValidators: true }
    ).populate('items.product user');

    if (!order) {
      return next(new ErrorHandler('Order not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Cancel Order
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return next(new ErrorHandler('Order not found', 404));
    }

    if (order.user.toString() !== req.userId && req.role !== 'admin') {
      return next(new ErrorHandler('Unauthorized', 403));
    }

    if (order.deliveryStatus !== 'pending') {
      return next(new ErrorHandler('Cannot cancel shipped/delivered orders', 400));
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      product.stock += item.quantity;
      await product.save();
    }

    order.deliveryStatus = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};
