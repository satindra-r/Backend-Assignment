module.exports = {
	createUser,
	getUserCredentials,
	getUser,
	createOrder,
	setDishPrepared,
	setOrderPaid,
	getAllOrders,
	getUserOrders,
	getOrderDishes,
	getUserOrderDishes
}

DB = require('./db');

async function createUser(req, res) {
	try {
		await DB.createUser(req.header("UserName"), req.header("Role"), req.header("PhoneNo"), req.header("Address"), req.hash);
	} catch (err) {
		res.status(500).send("Database error");
		return;
	}
	res.status(200).send("User created successfully.");
}

async function getUserCredentials(req, res, next) {
	try {
		req.credentials = await DB.getUserCredentials(req.header("UserName"));
	} catch (err) {
		res.status(500).send("Database error");
		return;
	}
	next();
}

async function getUser(req, res, next) {
	try {
		req.User = await DB.getUser(req.UserId);
	} catch (err) {
		res.status(500).send("Database error");
		return;
	}
	next();
}

async function createOrder(req, res) {
	try {
		let price = 0;
		for (let i = 0; i < req.body["Items"].length; i++) {
			let item = await DB.getItem(req.body["Items"][i]["Id"]);
			price += item["Price"] * req.body["Items"][i]["Count"];
		}

		let OrderID = await DB.createOrder(req.UserId, price);
		for (let i = 0; i < req.body["Items"].length; i++) {
			await DB.createDish(req.body["Items"][i]["Id"], OrderID, req.body["Items"][i]["Count"], req.body["Items"][i]["splInstructions"]);
		}
	} catch (err) {
		res.status(500).send("Database error");
	}
	res.status(200).send("Order created successfully.");
}

async function setDishPrepared(req, res) {
	try {
		await DB.setDishPrepared(req.header("DishId"), req.header("Prepared"));
	} catch (err) {
		res.status(500).send("Database error");
	}
}

async function setOrderPaid(req, res) {
	try {
		await DB.setOrderPaid(req.header("OrderId"), req.header("Paid"));
	} catch (err) {
		res.status(500).send("Database error");
	}
}

async function getAllOrders(req, res) {
	try {
		res.status(200).json(await DB.getAllOrders(req.header("StartIndex"), req.header("Count")));
	} catch (err) {
		res.status(500).send("Database error");
	}
}

async function getUserOrders(req, res) {
	try {
		res.status(200).json(await DB.getUserOrders(req.UserId, req.header("StartIndex"), req.header("Count")));
	} catch (err) {
		res.status(500).send("Database error");
	}
}

async function getOrderDishes(req, res) {
	try {
		res.status(200).json(await DB.getOrderDishes(req.header("OrderId")));
	} catch (err) {
		res.status(500).send("Database error");
	}
}

async function getUserOrderDishes(req, res) {
	try {
		if ((await DB.getUserOrder(req.UserId, req.headers("OrderId"))).length > 0) {
			res.status(200).json(DB.getOrderDishes(req.headers("OrderId")));
		}else{
			res.status(403).send("Order does not belong to User")
		}
	} catch (err) {
		res.status(500).send("Database error");
	}
}