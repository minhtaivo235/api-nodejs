const sql = require("./db.js");

// constructor
const User = function (user) {
  this.username = user.username;
  this.password = user.password;
};

User.create = (newUser, result) => {
  const defaultRole = 'USER';
  sql.query("INSERT INTO users (username, password, role) values (?,?,?)", [newUser.username, newUser.password, defaultRole], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.id, ...newUser });
    result(null, { id: res.id, ...newUser });
  });
};

User.login = (reqUser, result) => {
  sql.query("SELECT * FROM users WHERE username = ? and password = ?", [reqUser.username, reqUser.password], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("login success");
    result(null, res[0]);
  })
}

User.findById = (userId, result) => {
  sql.query(`SELECT * FROM users WHERE userId = ${userId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

User.findByUsername = (username, result) => {
  sql.query(`SELECT * FROM users WHERE username = '${username}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result(null, null);
    return;
  });
};

User.getAll = result => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.updateRefreshToken = (username, refreshToken, result) => {
  sql.query(
    "UPDATE users SET refreshToken = ? WHERE username = ?",
    [refreshToken, username],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { username: username, refreshToken: refreshToken });
      result(null, { username: username, refreshToken: refreshToken });
      return;
    }
  );
};

// User.remove = (id, result) => {
//   sql.query("DELETE FROM customers WHERE id = ?", id, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     if (res.affectedRows == 0) {
//       // not found Customer with the id
//       result({ kind: "not_found" }, null);
//       return;
//     }

//     console.log("deleted customer with id: ", id);
//     result(null, res);
//   });
// };

// User.removeAll = result => {
//   sql.query("DELETE FROM customers", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log(`deleted ${res.affectedRows} customers`);
//     result(null, res);
//   });
// };

module.exports = User;
