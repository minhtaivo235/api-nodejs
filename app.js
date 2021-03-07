const express = require("express");
const createError = require('http-errors');
require('express-async-errors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

// const authRouter = require('./app/auth/auth.routes');
// const userRouter = require('./src/users/users.routes');

const app = express();



// app.use(
// 	bodyParser.urlencoded({
// 		extended: false,
// 	}),
// );
app.use(bodyParser.json());
app.use(cors());

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

// app.use('/auth', authRouter);

app.use((req, res, next) => {
	next(createError(404));
});

app.use((err, req, res) => {
	console.log(err.stack);
	res.status(err.status || 500).send(err.message);
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
