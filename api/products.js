import express from "express";
const router = express.Router();
export default router;

import {
  getProducts,
  getProductById,
  getOrdersByProductId,
} from "#db/queries/products";
import requireUser from "#middleware/requireUser";

// get all products
router.get("/", async (req, res) => {
  const products = await getProducts();
  res.send(products);
});

// load product by id and attach to req
// send 404 if product not found
router.param("id", async (req, res, next, id) => {
  const product = await getProductById(id);
  if (!product) return res.status(404).send("Product not found.");
  req.product = product;
  next();
});

// get a single product by id
router.get("/:id", (req, res) => {
  res.send(req.product);
});

// get all orders that contain this product
// send 404 if product not found even if user is logged in
router.get("/:id/orders", requireUser, async (req, res) => {
  const orders = await getOrdersByProductId(req.product.id);
  res.send(orders);
});
