const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes'); 
const  productRoutes = require('./src/routes/productRoutes'); 
const  orderRoutes = require('./src/routes/orderRoutes'); 
const  shopRoutes = require('./src/routes/shopRoutes'); 

const { verifyToken ,isAdmin,isUser} = require('./src/middlewares/user');

const app = express();

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use('/api/users', userRoutes);

app.get('/seller-dashboard', verifyToken, isAdmin, (req, res) => {
    res.status(200).json({ message: 'Welcome to the Seller Dashboard' });
  });
  
  app.get('/user-dashboard', verifyToken, isUser, (req, res) => {
    res.status(200).json({ message: 'Welcome to the User Dashboard' });
  });

  app.use('/seller-dashboard/products',verifyToken, isAdmin, productRoutes); // Product routes
  app.use('/seller-dashboard/orders',verifyToken, isAdmin, orderRoutes); // Product routes



  app.use('/shop', shopRoutes); // Shop routes
  
  
  // if (process.env.NODE_ENV === "production") {
  //   const path = require("path");
  //   app.use(express.static(path.resolve(__dirname, 'client', 'build')));
  //   app.get("*", (req, res) => {
  //       res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'),function (err) {
  //           if(err) {
  //               res.status(500).send(err)
  //           }
  //       });
  //   })
  // }


  app.get('/',(req,res)=>{
    return res.json({
      msg:"hi"
    })
  })

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





