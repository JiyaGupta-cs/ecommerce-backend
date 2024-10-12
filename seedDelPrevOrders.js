const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Delete all related records from OrderProduct first
  const deletedOrderProducts = await prisma.orderProduct.deleteMany({});
  console.log(`Deleted ${deletedOrderProducts.count} order products successfully!`);

  // Delete all previous orders
  const deletedOrders = await prisma.order.deleteMany({});
  console.log(`Deleted ${deletedOrders.count} orders successfully!`);

  // Now delete all products
  const deletedProducts = await prisma.product.deleteMany({});
  console.log(`Deleted ${deletedProducts.count} products successfully!`);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
