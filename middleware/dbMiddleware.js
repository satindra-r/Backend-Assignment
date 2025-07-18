module.exports = {
	createUser,
	getUserCredentials,
	getUser,
	createOrder,
	setDishPrepared,
	setOrderPaid,
	getOrderDishes,
	getUserOrderDishes,
	swapSections,
	setUserRole
}

DB = require('./db');

async function createUser(req, res) {
	try {
		await DB.createUser(req.header("UserName"), req.header("Role"), req.header("PhoneNo"), req.header("Address"), req.hash);
		res.status(201).send("User created successfully.");
	} catch (err) {
		res.status(500).send("Database error");
		console.error(err);
	}
}

async function getUserCredentials(req, res, next) {
	try {
		req.credentials = (await DB.getUserCredentials(req.header("UserName")));
	} catch (err) {
		res.status(500).send("Database error");
		console.error(err);
		return;
	}
	next();
}

async function getUser(req, res, next) {
	try {
		req.User = await DB.getUser(req.UserId);
	} catch (err) {
		res.status(500).send("Database error");
		console.error(err);
		return;
	}
	next();
}

async function createOrder(req, res) {
	try {
		let price = 0;

		for (let i in req.body["Items"]) {
			let item = await DB.getItem(i);
			price += item["Price"] * req.body["Items"][i]["count"];
		}

		let OrderID = await DB.createOrder(req.UserId, price);
		for (let i in req.body["Items"]) {
			await DB.createDish(i, OrderID, req.body["Items"][i]["count"], req.body["Items"][i]["splInstructions"] || "");
		}
		res.status(201).send("Order created successfully.");
	} catch (err) {
		res.status(500).send("Database error");
		console.error(err);
	}
}

async function setDishPrepared(req, res) {
	try {
		await DB.setDishPrepared(req.header("DishId"), req.header("Prepared"));
		res.status(200).send("Dish Updated successfully.");
	} catch (err) {
		res.status(500).send("Database error");
		console.error(err);
	}
}

async function setOrderPaid(req, res) {
	try {
		await DB.setOrderPaid(req.header("OrderId"), req.header("Paid"));
		res.status(201).send("Order Updated successfully.");
	} catch (err) {
		res.status(500).send("Database error");
		console.error(err);
	}
}

async function setUserRole(req, res) {
	try {
		await DB.setUserRole(req.header("UserId"), req.header("Role"));
		res.status(201).send("User Updated successfully.");
	} catch (err) {
		res.status(500).send("Database error");
		console.error(err);
	}
}

async function getOrderDishes(req, res) {
	try {
		res.status(200).json(await DB.getOrderDishes(req.header("OrderId")));
	} catch (err) {
		res.status(500).send("Database error");
		console.error(err);
	}
}

async function getUserOrderDishes(req, res) {
	try {
		if ((await DB.getUserOrder(req.UserId, req.header("OrderId"))).length > 0) {
			res.status(200).json(DB.getOrderDishes(req.header("OrderId")));
		} else {
			res.status(403).send("Order does not belong to User")
		}
	} catch (err) {
		res.status(500).send("Database error");
		console.error(err);
	}
}

async function swapSections(req, res) {
	try {
		await DB.swapSections(req.header("SectionId1"), req.header("SectionId2"));
		res.status(201).send("SectionIds swapped");
	} catch (err) {
		res.status(500).send("Database error");
		console.error(err);
	}
}