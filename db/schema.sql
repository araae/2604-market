-- drop all tables if they exist, cascading to dependent tables for safety
DROP TABLE IF EXISTS orders_products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- create users table
CREATE TABLE users (
  id serial PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password text NOT NULL
);

-- create products table
CREATE TABLE products (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  price decimal NOT NULL
);

-- create orders table linked to a user with a date and note
CREATE TABLE orders (
  id serial PRIMARY KEY,
  date date NOT NULL,
  note text,
  user_id int NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- create junction table linking orders to products with a quantity
CREATE TABLE orders_products (
  order_id int NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id int NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity int NOT NULL,
  PRIMARY KEY (order_id, product_id)
);