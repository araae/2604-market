import db from "#db/client";

// insert a new product
export async function createProduct(title, description, price) {
  const sql = `
  INSERT INTO products
    (title, description, price)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const {
    rows: [product],
  } = await db.query(sql, [title, description, price]);
  return product;
}

// get all products
export async function getProducts() {
  const sql = `
  SELECT *
  FROM products
  `;
  const { rows: products } = await db.query(sql);
  return products;
}

// get a single product by id
export async function getProductById(id) {
  const sql = `
  SELECT *
  FROM products
  WHERE id = $1
  `;
  const {
    rows: [product],
  } = await db.query(sql, [id]);
  return product;
}

// get all orders that contain a specific product
export async function getOrdersByProductId(id) {
  const sql = `
  SELECT orders.*
  FROM orders
  JOIN orders_products ON orders.id = orders_products.order_id
  WHERE orders_products.product_id = $1
  `;
  const { rows: orders } = await db.query(sql, [id]);
  return orders;
}
