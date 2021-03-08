module.exports = app => {
    const category = require("../controllers/category.controller");
    const authMiddleware = require('../auth/auth.middlewares');
    const isAuth = authMiddleware.isAuth;
  
    // Create a new Customer
    app.post("/category", isAuth, category.create);
  
    // Retrieve all Customers
    app.get("/category", category.findAll);
  
    // Retrieve a single Customer with customerId
    app.get("/category/:id", category.findOne);
  
    // Update a Customer with customerId
    app.put("/category/:id", isAuth, category.update);
  
    // Delete a Customer with customerId
    app.delete("/category/:id", isAuth, category.delete);
  
    // Create a new Customer
    app.delete("/category", isAuth, category.deleteAll);
  };
  