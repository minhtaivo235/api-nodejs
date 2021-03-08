module.exports = app => {
    const users = require("../controllers/user.controller.js");
  
    // Create a new Customer
    app.post("/users", users.create);
    
    app.post("/users/refreshToken", users.refreshToken);

    // Find User with username and password
    app.post("/users/login", users.login);

    // Retrieve all Customers
    app.get("/users", users.findAll);
  
    // Retrieve a single Customer with customerId
    app.get("/users/:userId", users.findOne);
  
    // // Update a Customer with customerId
    // app.put("/users/:userId", users.update);
  
    // // Delete a Customer with customerId
    // app.delete("/users/:userId", users.delete);
  
    // // Create a new Customer
    // app.delete("/users", users.deleteAll);
  };
  