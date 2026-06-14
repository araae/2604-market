import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createProduct } from "#db/queries/products";
import { createOrder } from "#db/queries/orders";
import { createOrderProduct } from "#db/queries/orders_products";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // not sure if faker was needed here
  // create 10 products
  for (let i = 1; i <= 10; i++) {
    await createProduct("Product" + i, "Description" + i, i * 9.99);
  }

  // create 1 user with 1 order containing 5 distinct products
  const user = await createUser("someuser", "somepassword");
  const order = await createOrder("0001-01-01", "order", user.id);
  for (let i = 1; i <= 5; i++) {
    await createOrderProduct(order.id, i, i);
  }
}
