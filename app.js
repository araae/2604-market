import express from "express";
const app = express();
export default app;

import morgan from "morgan";
import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "#api/users";
import productsRouter from "#api/products";
import ordersRouter from "#api/orders";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

app.use((err, req, res, next) => {
  switch (err.code) {
    // invalid type
    case "22P02":
      return res.status(400).send(err.message);
    // unique constraint violation
    case "23505":
    // foreign key violation
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
