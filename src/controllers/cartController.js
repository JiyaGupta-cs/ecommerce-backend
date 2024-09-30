const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add a product to the cart
exports.addToCart = async (req, res) => {
  const userId = req.user.id; // Authenticated user's ID
  const { productId, quantity } = req.body;

  try {
    // Check if the product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product is already in the user's cart
    const existingCartItem = await prisma.cart.findFirst({
      where: { userId, productId }
    });

    if (existingCartItem) {
      // If product is already in the cart, update the quantity
      const updatedCartItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
      return res.status(200).json(updatedCartItem);
    }

    // If the product is not in the cart, create a new cart item
    const newCartItem = await prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });
    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.viewCart = async (req, res) => {
    const userId = req.userId; // Assuming `userId` is stored in the token and extracted by middleware
  
    try {
      const cart = await prisma.cart.findMany({
        where: { userId },
        include: {
          product: true, // Include product details in the cart
        },
      });
  
      if (cart.length === 0) {
        return res.status(404).json({ message: 'Cart is empty' });
      }
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
