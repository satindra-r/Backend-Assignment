module.exports = {
	verifyCreateUser,
	verifyUserLogin,
	verifyCreateOrder,
	verifyPreparedDish,
	verifyPaidOrder,
	verifyGetOrders,
	verifyGetDishes
}

function verifyCreateUser(req, res, next) {
	if (!req.header("UserName")) {
		res.status(400).send("No UserName provided");
		return;
	}

	if (!req.header("Password")) {
		res.status(400).send("No Password provided")
		return;
	} else if (req.header("Password").length < 8) {
		res.status(400).send("Password must be at least 8 characters");
		return;
	}

	if (!req.header("Role")) {
		res.status(400).send("No Role provided");
		return;
	}

	if (!req.header("PhoneNo")) {
		res.status(400).send("No PhoneNo");
		return;
	} else if (!req.header("PhoneNo").match("^(?:\\+[0-9]{1,2})?[0-9]{10}$")) {
		res.status(400).send("Invalid PhoneNo");
		return;
	}

	if (!req.header("Address")) {
		res.status(400).send("No Address provided");
		return;
	}
	next();
}

function verifyUserLogin(req, res, next) {
	if (!req.header("UserName")) {
		res.status(400).send("No UserName provided");
		return;
	}
	if (!req.header("Password")) {
		res.status(400).send("No Password provided");
		return;
	}
	next();
}

function verifyCreateOrder(req, res, next) {
	if (!req.body["Items"]) {
		res.status(400).send("No Items provided");
		return;
	}
	for (let i = 0; i < req.body["Items"].length; i++) {
		if (!req.body["Items"][i]["Id"] || !req.body["Items"][i]["Count"] || !req.body["Items"][i]["splInstructions"]) {
			res.status(400).send("Item Details Missing");
			return;
		}
	}
	next();
}

function verifyPreparedDish(req, res, next) {
	if (!req.header("DishId")) {
		res.status(400).send("No DishId provided");
		return;
	}
	if (!req.header("Prepared")) {
		res.status(400).send("No Preparation State provided");
		return;
	}
	next();
}


function verifyPaidOrder(req, res, next) {
	if (!req.header("OrderId")) {
		res.status(400).send("No OrderId provided");
		return;
	}
	if (!req.header("Paid")) {
		res.status(400).send("No Paid State provided");
		return;
	}
	next();
}

function verifyGetOrders(req, res, next) {
	if (!req.header("StartIndex")) {
		res.status(400).send("No StartIndex provided");
	}
	if (!req.header("Count")) {
		res.status(400).send("No Count provided");
	}
	next();
}

function verifyGetDishes(req, res, next) {
	if (!req.header("OrderId")) {
		res.status(400).send("No OrderId provided");
	}
	next();
}