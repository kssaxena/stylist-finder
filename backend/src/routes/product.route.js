import { Router } from "express";
import {
  getProducts,
  getProductById,
  listAdminProducts,
  saveProduct,
  updateProductStatus,
  listProductOrders,
  listCustomerProductOrders,
  updateProductOrderStatus,
} from "../controllers/product.controller.js";
import {
  VerifyAdmin,
  VerifyAdminSection,
} from "../middlewares/admin.middleware.js";
import { VerifyCustomer } from "../middlewares/customer.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createProductOrderPayment } from "../controllers/productPayment.controller.js";

const router = Router();

router.get("/", getProducts);
router.get("/by-id/:productId", getProductById);
const productAccess = VerifyAdminSection("E-commerce products & stock");
const orderAccess = VerifyAdminSection("E-commerce orders");

router.get("/admin/list", VerifyAdmin, productAccess, listAdminProducts);
router.post(
  "/admin/save",
  VerifyAdmin,
  productAccess,
  upload.array("images", 5),
  saveProduct,
);
router.post(
  "/admin/save/:productId",
  VerifyAdmin,
  productAccess,
  upload.array("images", 5),
  saveProduct,
);
router.post(
  "/admin/status/:action/:productId",
  VerifyAdmin,
  productAccess,
  updateProductStatus,
);
router.get("/admin/orders", VerifyAdmin, orderAccess, listProductOrders);
router.get("/orders/my", VerifyCustomer, listCustomerProductOrders);
router.post(
  "/admin/orders/:orderId/status",
  VerifyAdmin,
  orderAccess,
  updateProductOrderStatus,
);
router.post("/orders/create-payment", VerifyCustomer, createProductOrderPayment);

export default router;
