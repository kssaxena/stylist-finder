import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ProductOrder } from "../models/productOrder.model.js";
import { Address } from "../models/address.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PAYMENT_MODULES } from "../constants/payment.constants.js";
import {
  createTransaction,
  updateGatewayOrder,
} from "../services/payment.service.js";
import { createRazorpayOrder } from "../services/razorpay.service.js";

const createProductOrderPayment = asyncHandler(async (req, res) => {
  const { items, address } = req.body;
  if (!Array.isArray(items) || items.length === 0 || !address) {
    throw new ApiError(
      400,
      "Cart products and a shipping address are required.",
    );
  }
  if (
    items.some(
      (item) =>
        !mongoose.Types.ObjectId.isValid(item?.productId) ||
        !Number.isInteger(Number(item?.quantity)) ||
        Number(item.quantity) < 1,
    )
  ) {
    throw new ApiError(400, "Every cart product needs a valid quantity.");
  }
  const productIds = items.map((item) => item.productId.toString());
  if (new Set(productIds).size !== productIds.length) {
    throw new ApiError(400, "The cart contains duplicate products.");
  }

  const customerAddress = await Address.findOne({
    _id: address,
    customer: req.user._id,
  });
  if (!customerAddress) {
    throw new ApiError(
      400,
      "Select an address saved to your customer account.",
    );
  }

  const products = await Product.find({
    _id: { $in: productIds },
    isActive: true,
  });
  if (products.length !== productIds.length) {
    throw new ApiError(400, "One or more products are no longer available.");
  }
  const productsById = new Map(
    products.map((product) => [product._id.toString(), product]),
  );
  const orderItems = items.map(({ productId, quantity }) => {
    const product = productsById.get(productId.toString());
    const unitPrice = Number(product.price);
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      throw new ApiError(400, `Invalid price for ${product.name}.`);
    }
    return {
      product: product._id,
      name: product.name,
      sku: product.sku,
      image: product.images?.[0]?.url,
      quantity: Number(quantity),
      unitPrice,
    };
  });
  const totalPaise = orderItems.reduce(
    (total, item) => total + Math.round(item.unitPrice * 100) * item.quantity,
    0,
  );
  const amount = totalPaise / 100;
  if (amount <= 0) {
    throw new ApiError(400, "Order total must be greater than zero.");
  }

  const reservedItems = [];
  let order;
  try {
    for (const item of orderItems) {
      const reservedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,
          isActive: true,
          stock: { $gte: item.quantity },
        },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );
      if (!reservedProduct) {
        throw new ApiError(409, `${item.name} does not have enough stock.`);
      }
      reservedItems.push(item);
    }

    order = await ProductOrder.create({
      customer: req.user._id,
      items: orderItems,
      shippingAddress: {
        name: customerAddress.contactDetails?.name,
        contact: customerAddress.contactDetails?.contact,
        flatNumber: customerAddress.flatNumber,
        floor: customerAddress.floor,
        street1: customerAddress.street1,
        street2: customerAddress.street2,
        area: customerAddress.area,
        locality: customerAddress.locality,
        pincode: customerAddress.pincode,
        city: customerAddress.city,
        state: customerAddress.state,
        country: customerAddress.country,
      },
      amount,
    });

    const transaction = await createTransaction({
      module: PAYMENT_MODULES.PRODUCT_ORDER,
      moduleId: order._id,
      user: req.user._id,
      userModel: "Customer",
      amount,
      metadata: { productCount: orderItems.length },
    });
    order.paymentTransaction = transaction._id;
    await order.save();

    const razorpayOrder = await createRazorpayOrder({
      amount,
      currency: "INR",
      receipt: transaction.transactionNumber,
      notes: {
        transactionId: transaction._id.toString(),
        transactionNumber: transaction.transactionNumber,
        module: PAYMENT_MODULES.PRODUCT_ORDER,
        moduleId: order._id.toString(),
        user: req.user._id.toString(),
      },
    });
    if (!razorpayOrder?.id) {
      throw new ApiError(500, "Unable to create Razorpay order.");
    }
    const updatedTransaction = await updateGatewayOrder(transaction._id, {
      orderId: razorpayOrder.id,
      receipt: razorpayOrder.receipt,
      amount: razorpayOrder.amount / 100,
      currency: razorpayOrder.currency,
      notes: razorpayOrder.notes || {},
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          transaction: {
            _id: updatedTransaction._id,
            transactionNumber: updatedTransaction.transactionNumber,
            amount: updatedTransaction.amount,
          },
          order: { _id: order._id },
          razorpay: {
            key: process.env.RAZORPAY_KEY_ID,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "Cute & Glow",
            description: `${orderItems.length} product order`,
          },
        },
        "Product order payment created successfully",
      ),
    );
  } catch (error) {
    if (order) {
      await ProductOrder.findByIdAndUpdate(order._id, {
        status: "Payment Failed",
        stockReleased: true,
      });
    }
    await Promise.all(
      reservedItems.map((item) =>
        Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } },
        ),
      ),
    );
    throw error;
  }
});

export { createProductOrderPayment };
