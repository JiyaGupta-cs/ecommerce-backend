const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Fetch one seller from the database (e.g., Seller 1)
  const seller1 = await prisma.user.findUnique({ where: { email: 'c@gmail.com' } });

  if (!seller1) {
    throw new Error('Seller not found!');
  }

  // Fetch all categories from the database
  const categories = await prisma.category.findMany();

  // Filter categories by name
  const categoryElectronics = categories.find(category => category.name === 'Electronics');
  const categoryAirpods = categories.find(category => category.name === 'AirPods');
  const categoryWatches = categories.find(category => category.name === 'Watches');

  if (!categoryElectronics || !categoryAirpods || !categoryWatches) {
    throw new Error('One or more categories not found!');
  }

  // Create Products and associate them with the single seller (Seller 1)
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
      seller: { connect: { id: seller1.id } },
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
      seller: { connect: { id: seller1.id } },
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
      seller: { connect: { id: seller1.id } },
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
      seller: { connect: { id: seller1.id } },
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
      seller: { connect: { id: seller1.id } },
      categories: { connect: [{ id: categoryElectronics.id }] },
    },
  });

  console.log('Products seeded successfully for Seller 1!');
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
