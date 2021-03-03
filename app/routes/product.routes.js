module.exports = app => {
    const product = require("../controllers/product.controller");
  
    // Create a new Customer
    app.post("/product", product.create);
  
    // Retrieve all Customers
    app.get("/product", product.findAll);
  
    // Retrieve a single Customer with customerId
    app.get("/product/:id", product.findOne);
  
    // Update a Customer with customerId
    app.put("/product/:id", product.update);
  
    // Delete a Customer with customerId
    app.delete("/product/:id", product.delete);
  
    // // Create a new Customer
    // app.delete("/product", product.deleteAll);
  };
  