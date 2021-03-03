module.exports = app => {
    const category = require("../controllers/category.controller");
  
    // Create a new Customer
    app.post("/category", category.create);
  
    // Retrieve all Customers
    app.get("/category", category.findAll);
  
    // Retrieve a single Customer with customerId
    app.get("/category/:id", category.findOne);
  
    // Update a Customer with customerId
    app.put("/category/:id", category.update);
  
    // Delete a Customer with customerId
    app.delete("/category/:id", category.delete);
  
    // Create a new Customer
    app.delete("/category", category.deleteAll);
  };
  