const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create an order
exports.createOrder = async (req, res) => {
  const { buyerId, products } = req.body; // products should be an array of { productId, quantity }
  
  try {
    // Calculate total amount
    const orderProducts = await Promise.all(products.map(async (prod) => {
      const product = await prisma.product.findUnique({ where: { id: prod.productId } });
      if (!product) {
        throw new Error(`Product with ID ${prod.productId} not found`);
      }
      return {
        productId: prod.productId,
        quantity: prod.quantity,
        orderId: null, // Will be filled later
        amount: product.price * prod.quantity,
      };
    }));

    const totalAmount = orderProducts.reduce((sum, item) => sum + item.amount, 0);

    const order = await prisma.order.create({
      data: {
        buyer: { connect: { id: buyerId } },
        totalAmount,
        products: {
          create: orderProducts.map(prod => ({
            product: { connect: { id: prod.productId } },
            quantity: prod.quantity,
          })),
        },
      },
    });

   

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders
exports.getAllOrdersBySeller = async (req, res) => {
    const sellerId = req.user.id; 
  console.log("REC****************",sellerId)
    try {
      const orders = await prisma.order.findMany({
        where: {
          products: {
            some: { // Filter to include only products sold by this seller
              product: { sellerId: sellerId },
            },
          },
        },
        include: {
          products: {
            include: {
              product: true, // Include product details in the order
            },
          },
          buyer: true, // Include buyer details
        },
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Get orders by buyer
exports.getOrdersByBuyer = async (req, res) => {
    const buyerId = req.user.id; // Get buyer's ID from authenticated user
  
    try {
      const orders = await prisma.order.findMany({
        where: { buyerId: buyerId },
        include: {
          products: {
            include: {
              product: true, // Include product details in the order
            },
          },
        },
      });

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
