const jwtVariable = require('../variables/jwt');

const userModle = require('../models/user.model');

const authMethod = require('./auth.methods');

exports.isAuth = async (req, res, next) => {
	// Lấy access token từ header
	const accessTokenFromHeader = req.headers.x_authorization;
	if (!accessTokenFromHeader) {
		return res.status(401).send('Not found access token!');
	}

	const accessTokenSecret =
		process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

	const verified = await authMethod.verifyToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	if (!verified) {
		return res
			.status(401)
			.send('Access deny');
	}

	// const user = await userModle.getUser(verified.payload.username);
	await userModle.findByUsername(verified.payload.username, (err, data) => {
		req.user = data;
	});
	

	return next();
};
