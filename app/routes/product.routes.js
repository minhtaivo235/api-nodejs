module.exports = app => {
    const product = require("../controllers/product.controller");
    const authMiddleware = require('../auth/auth.middlewares');
    const isAuth = authMiddleware.isAuth;
    // Create a new Customer
    app.post("/product", isAuth, product.create);
  
    // Retrieve all Customers
    app.get("/product", product.findAll);
  
    // Retrieve a single Customer with customerId
    app.get("/product/:id", product.findOne);
  
    // Update a Customer with customerId
    app.put("/product/:id", isAuth, product.update);
  
    // Delete a Customer with customerId
    app.delete("/product/:id", isAuth, product.delete);
  
    // // Create a new Customer
    // app.delete("/product", product.deleteAll);
  };
  