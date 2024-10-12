const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Fetch Users (buyers)
  const user1 = await prisma.user.findUnique({ where: { email: 'user1@example.com' } });
  const user2 = await prisma.user.findUnique({ where: { email: 'user2@example.com' } });

  // Check if users were found
  if (!user1 || !user2) {
    throw new Error('One or both users not found!');
  }

  // Fetch Products using findFirst (because name is not unique)
  const airPodsPro = await prisma.product.findFirst({ where: { name: 'AirPods Pro' } });
  const appleWatch = await prisma.product.findFirst({ where: { name: 'Apple Watch Series 6' } });
  const samsungBuds = await prisma.product.findFirst({ where: { name: 'Samsung Galaxy Buds' } });

  // Check if products were found
  if (!airPodsPro || !appleWatch || !samsungBuds) {
    throw new Error('One or more products not found!');
  }

  // Create Orders
  await prisma.order.create({
    data: {
      buyer: { connect: { id: user1.id } }, // Connect to User 1
      totalAmount: airPodsPro.price * 1 + appleWatch.price * 1, // Example: 1 AirPods and 1 Apple Watch
      products: {
        create: [
          {
            product: { connect: { id: airPodsPro.id } },
            quantity: 1,
          },
          {
            product: { connect: { id: appleWatch.id } },
            quantity: 1,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      buyer: { connect: { id: user2.id } }, // Connect to User 2
      totalAmount: samsungBuds.price * 2, // Example: 2 Samsung Galaxy Buds
      products: {
        create: [
          {
            product: { connect: { id: samsungBuds.id } },
            quantity: 2,
          },
        ],
      },
    },
  });

  console.log('Orders seeded successfully!');
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
