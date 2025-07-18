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
		let cookie = ""
		for (let i = 0; i < req.rawHeaders.length; i++) {
			if (req.rawHeaders[i] === "Cookie") {
				cookie = req.rawHeaders[i + 1];
			}
		}
		let JWT = (cookie.split("JWT=")[1]).split(";")[0];
		if (!JWT) {
			res.redirect(302, "/login");
			return
		}
		let JWTInfo = Auth.decode(JWT);
		if (JWTInfo["iat"] > (Date.now() / 1000) + (24 * 60 * 60)) {
			res.redirect(302, "/login");
			return;
		} else {
			req.UserId = JWTInfo["UserId"];
		}
	} catch (err) {
		res.redirect(302, "/login");
		return;
	}
	next();
}

function verifyChef(req, res, next) {
	if (req.User["Role"] === "Chef" || req.User["Role"] === "Admin") {
		next();
	} else {
		res.status(400).send("You do not have the permission to do this");
	}
}

function verifyAdmin(req, res, next) {
	if (req.User["Role"] === "Admin") {
		next();
	} else {
		res.status(400).send("You do not have the permission to do this");
	}
}