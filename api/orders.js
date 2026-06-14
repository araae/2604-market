import express from "express";
const router = express.Router();
export default router;

import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  getProductsByOrderId,
} from "#db/queries/orders";
import { createOrderProduct } from "#db/queries/orders_products";
import { getProductById } from "#db/queries/products";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

router.use(requireUser);

// create a new order for the logged in user
router.post("/", requireBody(["date"]), async (req, res) => {
  const { date, note } = req.body;
  const order = await createOrder(date, note, req.user.id);
  res.status(201).send(order);
});

// get all orders by the logged in user
router.get("/", async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id);
  res.send(orders);
});

// load order by id and attach to req
// send 404 if order not found
// send 403 if logged in user does not own the order
router.param("id", async (req, res, next, id) => {
  const order = await getOrderById(id);
  if (!order) return res.status(404).send("Order not found.");
  if (order.user_id !== req.user.id)
    return res
      .status(403)
      .send("You do not have permission to access this order.");
  req.order = order;
  next();
});

// get a single order by id
router.get("/:id", (req, res) => {
  res.send(req.order);
});

// add a product to an order
// send 400 if product does not exist
router.post(
  "/:id/products",
  requireBody(["productId", "quantity"]),
  async (req, res) => {
    const { productId, quantity } = req.body;
    const product = await getProductById(productId);
    if (!product) return res.status(400).send("Product not found.");
    const orderProduct = await createOrderProduct(
      req.order.id,
      productId,
      quantity,
    );
    res.status(201).send(orderProduct);
  },
);

// get all products in an order
router.get("/:id/products", async (req, res) => {
  const products = await getProductsByOrderId(req.order.id);
  res.send(products);
});
