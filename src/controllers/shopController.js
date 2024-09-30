const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
      const products = await prisma.product.findMany();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get single product
  exports.getProduct = async (req, res) => {
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
  

  exports.getAllProductsByCategory=async(req,res)=>{
    const { categoryName } = req.params;

    try {

      console.log("cat:",categoryName)
      const products = await prisma.product.findMany({
        where: {
          categories: {
            some: {
              name: {
                equals: categoryName,
                mode: 'insensitive', 
              },
            },
          },
        },
        include: {
          categories: true, 
          seller: true,     
        },
      });
  
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching products.' });
    }
  
  }
  

  // Get all categories
exports.fetchCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

