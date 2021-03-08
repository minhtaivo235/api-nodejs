const User = require("../models/user.model.js");
const randToken = require('rand-token');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../variables/auth');
const jwtVariable = require('../variables/jwt');
const authMethod = require('../auth/auth.methods');

// Create and Save a new Customer
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const username = req.body.username.toLowerCase();
  const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);

  // Create a Customer
  const newUser = new User({
    username: username,
    password: hashPassword
  });
  User.findByUsername(newUser.username, (err, data) => {
    if (data) {
      res.status(409).send('This name account has already existed.');
    } else {
      // Save Customer in the database
      User.create(newUser, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Customer."
          });
        else res.send(data);
      });
    }
  });
};


exports.refreshToken = async (req, res) => {
  // Lấy access token từ header
  const accessTokenFromHeader = req.headers.x_authorization;
  if (!accessTokenFromHeader) {
    return res.status(400).send('Not found access token.');
  }

  // Lấy refresh token từ body
  const refreshTokenFromBody = req.body.refreshToken;
  if (!refreshTokenFromBody) {
    return res.status(400).send('Not found refresh token.');
  }

  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
  const accessTokenLife =
    process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

  // Decode access token đó
  const decoded = await authMethod.decodeToken(
    accessTokenFromHeader,
    accessTokenSecret,
  );
  if (!decoded) {
    return res.status(400).send('Access token invalid.');
  }

  const username = decoded.payload.username; // Lấy username từ payload

  User.findByUsername(username, async (err, data) => {
    if (!data) return res.status(401).send('User không tồn tại.');
    if (refreshTokenFromBody !== data.refreshToken) {
      return res.status(400).send('Refresh token không hợp lệ.');
    }
    // Tạo access token mới
    const dataForAccessToken = {
      username,
    };
    const accessToken = await authMethod.generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife,
    );
    if (!accessToken) {
      return res
        .status(400)
        .send('Tạo access token không thành công, vui lòng thử lại.');
    }
    return res.json({
      accessToken,
    });
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
      const userPresent = new User({
        username: req.body.username,
        password: req.body.password,
      });

      User.findByUsername(userPresent.username, async (err, data) => {
        if (!data) {
          res.status(409).send('The account name does not exist.');
        }
        else {
          const isPasswordValid = bcrypt.compareSync(userPresent.password, data.password);
          if (!isPasswordValid) {
            return res.status(401).send('Mật khẩu không chính xác.');
          }
          const accessTokenLife =
            process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
          const accessTokenSecret =
            process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

          const dataForAccessToken = {
            username: data.username,
          };
          const accessToken = await authMethod.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife,
          );
          if (!accessToken) {
            return res
              .status(401)
              .send('Đăng nhập không thành công, vui lòng thử lại.');
          }

          let refreshToken = randToken.generate(jwtVariable.refreshTokenSize); // tạo 1 refresh token ngẫu nhiên
          if (!data.refreshToken) {
            // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
            User.updateRefreshToken(data.username, refreshToken, (err, receiveData) => {
              if (err) {
                if (err.kind === "not_found") {
                  res.status(404).send({
                    message: `Not found User`
                  });
                } else {
                  res.status(500).send({
                    message: "Error updating User"
                  });
                }
              }
            });
          } else {
            // Nếu user này đã có refresh token thì lấy refresh token đó từ database
            refreshToken = data.refreshToken;
          }

          return res.json({
            msg: 'Đăng nhập thành công.',
            accessToken,
            refreshToken,
            data,
          });
        }


      })
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
