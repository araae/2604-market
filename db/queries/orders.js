import db from "#db/client";

// insert a new order and return it
export async function createOrder(date, note, userId) {
  const sql = `
  INSERT INTO orders
    (date, note, user_id)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const {
    rows: [order],
  } = await db.query(sql, [date, note, userId]);
  return order;
}

// get a single order by id
export async function getOrderById(orderId) {
  const sql = `
  SELECT *
  FROM orders
  WHERE id = $1
  `;
  const {
    rows: [order],
  } = await db.query(sql, [orderId]);
  return order;
}

// get all orders by a user
export async function getOrdersByUserId(id) {
  const sql = `
  SELECT *
  FROM orders
  WHERE user_id = $1
  `;
  const { rows: orders } = await db.query(sql, [id]);
  return orders;
}

// get all products in an order
export async function getProductsByOrderId(id) {
  const sql = `
  SELECT products.*
  FROM
    products
    JOIN orders_products ON orders_products.product_id = products.id
    WHERE orders_products.order_id = $1
  `;
  const { rows: products } = await db.query(sql, [id]);
  return products;
}
