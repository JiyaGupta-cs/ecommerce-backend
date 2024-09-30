const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, description, price, quantity, imageUrl, colors, specifications } = req.body;
  const sellerId = req.user.id; 
  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity,
        imageUrl,
        colors,
        specifications,
        sellerId: sellerId,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products
exports.getAllMyProducts = async (req, res) => {
  const sellerId = req.user.id;
  try {
    const products = await prisma.product.findMany({
      where:{
        sellerId:sellerId
      }
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product
exports.getMyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst(
      {
        where:{
          id:parseInt(id)
        }
      }
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update a product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, imageUrl, colors, specifications } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price,
        quantity,
        imageUrl,
        colors,
        specifications,
      },
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
