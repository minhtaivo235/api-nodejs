const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
// app.use(function(req, res, next) {
//   // Mọi domain
//   res.header("Access-Control-Allow-Origin", "*");
 
//   // Domain nhất định
//   // res.header("Access-Control-Allow-Origin", "https://freetuts.net");
 
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to minh tai application." });
});

require("./app/routes/customer.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/category.routes")(app);
require("./app/routes/product.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
