const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'userrfefdfsd6@example.com',
        password: 'password123', // Hash passwords in production
        name: 'Normal User 1',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'usrser7@rrdsffrrexample.com',
        password: 'password123',
        name: 'Normal User 2',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'ufdseesrsr8@efxfgample.com',
        password: 'password123',
        name: 'Normal User 3',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'selsfdlesresr9f@exdfgdample.com',
        password: 'password456',
        name: 'Seller 1',
        role: 'SELLER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sellesfdersr97@fexampgfle.com',
        password: 'password456',
        name: 'Seller 2',
        role: 'SELLER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'selleserfdsdr33@fexamplgfe.com',
        password: 'password456',
        name: 'Seller 3',
        role: 'SELLER',
      },
    }),
  ]);

  // Create Categories
  const categoryElectronics = await prisma.category.create({
    data: {
      name: 'Electronics',
    },
  });

  const categoryAirpods = await prisma.category.create({
    data: {
      name: 'AirPods',
    },
  });

  const categoryWatches = await prisma.category.create({
    data: {
      name: 'Watches',
    },
  });

  // Create Products and associate with Categories
  await prisma.product.create({
    data: {
      name: 'AirPods Pro',
      description: 'Active noise cancelling earbuds.',
      price: 249.99,
      actualPrice: 599.99,
      quantity: 100,
      imageUrl: 'https://example.com/airpods_pro.jpg',
      colors: ['white'],
      specifications: { weight: '5.4g', dimensions: '3.1x1.8x1.6 cm' },
      seller: { connect: { id: users[3].id } }, // Seller 1
      categories: { connect: [{ id: categoryAirpods.id }] },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Apple Watch Series 6',
      description: 'Smartwatch with fitness tracking.',
      price: 399.99,
      actualPrice: 599.99,
      quantity: 50,
      imageUrl: 'https://example.com/apple_watch.jpg',
      colors: ['black', 'silver', 'gold'],
      specifications: { weight: '36.2g', dimensions: '44x38x10.4 mm' },
      seller: { connect: { id: users[4].id } }, // Seller 2
      categories: { connect: [{ id: categoryWatches.id }] },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Samsung Galaxy Buds',
      description: 'True wireless earbuds with great sound quality.',
      price: 149.99,
      actualPrice: 599.99,
      quantity: 75,
      imageUrl: 'https://example.com/samsung_buds.jpg',
      colors: ['black', 'white'],
      specifications: { weight: '6.3g', dimensions: '1.6x1.5x2.0 cm' },
      seller: { connect: { id: users[5].id } }, // Seller 3
      categories: { connect: [{ id: categoryAirpods.id }] },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Fitbit Versa 3',
      description: 'Fitness smartwatch with GPS.',
      price: 229.99,
      actualPrice: 599.99,
      quantity: 30,
      imageUrl: 'https://example.com/fitbit_versa.jpg',
      colors: ['pink', 'black'],
      specifications: { weight: '30g', dimensions: '40.4x40.4x12.35 mm' },
      seller: { connect: { id: users[3].id } }, // Seller 1
      categories: { connect: [{ id: categoryWatches.id }] },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Sony WH-1000XM4',
      description: 'Wireless noise-cancelling over-ear headphones.',
      price: 349.99,
      actualPrice: 599.99,
      quantity: 60,
      imageUrl: 'https://example.com/sony_headphones.jpg',
      colors: ['black', 'silver'],
      specifications: { weight: '254g', dimensions: '25.3x9.7x21.8 cm' },
      seller: { connect: { id: users[4].id } }, // Seller 2
      categories: { connect: [{ id: categoryElectronics.id }] },
    },
  });

  console.log('Seed data added successfully!');
}

main()
  .catch(async(e) => {

    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
