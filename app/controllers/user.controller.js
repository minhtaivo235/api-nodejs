const User = require("../models/user.model.js");

// Create and Save a new Customer
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer
  const user = new User({
    userName: req.body.userName,
    password: req.body.password,
    role: req.body.role
  });

  // Save Customer in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });
};

// Find user with username password to login
exports.login = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // hold user from request
  const user = new User({
    userName: req.body.userName,
    password: req.body.password,
  });

  // Save Customer in the database
  User.login(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });
}

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
  User.getAll((err, data) => {
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
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.params.userId
        });
      }
    } else res.send(data);
  });
};

// // Update a Customer identified by the customerId in the request
// exports.update = (req, res) => {
//   // Validate Request
//   if (!req.body) {
//     res.status(400).send({
//       message: "Content can not be empty!"
//     });
//   }

//   console.log(req.body);

//   Customer.updateById(
//     req.params.customerId,
//     new Customer(req.body),
//     (err, data) => {
//       if (err) {
//         if (err.kind === "not_found") {
//           res.status(404).send({
//             message: `Not found Customer with id ${req.params.customerId}.`
//           });
//         } else {
//           res.status(500).send({
//             message: "Error updating Customer with id " + req.params.customerId
//           });
//         }
//       } else res.send(data);
//     }
//   );
// };

// // Delete a Customer with the specified customerId in the request
// exports.delete = (req, res) => {
//   Customer.remove(req.params.customerId, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found Customer with id ${req.params.customerId}.`
//         });
//       } else {
//         res.status(500).send({
//           message: "Could not delete Customer with id " + req.params.customerId
//         });
//       }
//     } else res.send({ message: `Customer was deleted successfully!` });
//   });
// };

// // Delete all Customers from the database.
// exports.deleteAll = (req, res) => {
//   Customer.removeAll((err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all customers."
//       });
//     else res.send({ message: `All Customers were deleted successfully!` });
//   });
// };
