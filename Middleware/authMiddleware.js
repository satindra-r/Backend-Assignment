module.exports = {
	hashCreateUser, checkUserCredentials, verifyUser, verifyChef, verifyAdmin
}


const Auth = require('./auth');

function hashCreateUser(req, res, next) {
	let salt = Auth.genSalt();
	req.hash = Auth.hash256(req.header("Password"), salt);
	next();
}

function checkUserCredentials(req, res) {
	let jwtToken;
	let rows = req.credentials;
	for (let i = 0; i < rows.length; i++) {
		let salt = Buffer.from(rows[i]["HEX(hash)"].slice(64), "hex");
		let hash = rows[i]["HEX(hash)"];
		if (hash === Auth.hash256(req.header("password"), salt)) {
			let data = {UserId: rows[i]["UserId"]};
			jwtToken = Auth.sign(data);
			break;
		}
	}
	if (jwtToken) {
		res.status(200).send(jwtToken);
	} else {
		res.status(401).send("Wrong Username or Password");
	}
}

function verifyUser(req, res, next) {
	try {
		let cookies = req.header("Cookies");
		if (!cookies || !cookies.startsWith("JWT=")) {
			res.status(401).send("JWT not found");
			return
		}
		let JWT = cookies.split('=')[1];
		let JWTInfo = Auth.decode(JWT);
		if (JWTInfo["iat"] <= (Date.now() / 1000) + (24 * 60 * 60)) {
			res.status(401).send("JWT expired");
			return;
		} else {
			req.UserId = JWTInfo["UserId"];
		}
	} catch (err) {
		res.status(401).send("Invalid JWT");
		return;
	}
	next();
}

function verifyChef(req, res, next) {
	if (req.User["role"] === "Chef" || req.User["role"] === "Admin") {
		res.status(400).send("You do not have the permission to do this");
		return;
	}
	next();
}

function verifyAdmin(req, res, next) {
	if (req.User["role"] === "Admin") {
		res.status(400).send("You do not have the permission to do this");
		return;
	}
	next();
}