const sql = require("./db.js");

// constructor
const Product = function (product) {
    this.categoryId = product.categoryId;
    this.name = product.name;
    this.price = product.price;
    this.expDate = product.expDate;
    this.createAt = new Date();
    this.createBy = product.createBy;
};

Product.create = (newProduct, result) => {
    sql.query("INSERT INTO product SET ?", newProduct, (err, res) => {
        console.log(newProduct);
        console.log(res);
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created category: ", { id: res.insertId, ...newProduct });
        result(null, { id: res.insertId, ...newProduct });
    });
};

Product.findById = (id, result) => {
    sql.query(`SELECT * FROM product WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found product: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Customer with the id
        result({ kind: "not_found" }, null);
    });
};

Product.getAll = result => {
    sql.query("SELECT * FROM product", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("product: ", res);
        result(null, res);
    });
};

Product.updateById = (id, product, result) => {
    sql.query(
        "UPDATE product SET categoryId = ?, name = ?, price = ?, expDate = ?, createBy = ? WHERE id = ?",
        [product.categoryId, product.name, product.price, product.expDate, product.createBy, id],
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
            console.log(res);

            console.log("updated product: ", { id: id, ...product });
            result(null, { id: id, ...product });
        }
    );
};

Product.remove = (id, result) => {
    sql.query("DELETE FROM product WHERE id = ?", id, (err, res) => {
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

        console.log("deleted product with id: ", id);
        result(null, res);
    });
};

// Customer.removeAll = result => {
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

module.exports = Product;
