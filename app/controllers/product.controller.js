const Product = require("../models/product.model");

// Create and Save a new Customer
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer
  const product = new Product({    
    categoryId: req.body.categoryId,
    name: req.body.name,
    price: req.body.price,
    expDate: req.body.expDate,
    // createAt: req.body.createAt,
    createBy: req.body.createBy       
  });

  // Save Customer in the database
  Product.create(product, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
    Product.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
    Product.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Product with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Product with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  Product.updateById(
    req.params.id,
    new Product(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Product with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Product with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Customer with the specified customerId in the request
exports.delete = (req, res) => {
  Product.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Customer with id " + req.params.id
        });
      }
    } else res.send({ message: `Product was deleted successfully!` });
  });
};

// // Delete all Customers from the database.
// exports.deleteAll = (req, res) => {
//     Category.removeAll((err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all Category."
//       });
//     else res.send({ message: `All Category were deleted successfully!` });
//   });
// };
