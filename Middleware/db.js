module.exports = {
	createUser,
	getUserCredentials,
	getUser,
	createOrder,
	createDish,
	getItem,
	setDishPrepared,
	setOrderPaid,
	getAllOrders,
	getUserOrders,
	getUserOrder,
	getOrderDishes
}

const dotenv = require("dotenv");
dotenv.config();

const mysql = require("mysql2/promise");
const user = process.env.DB_USERNAME;
const passwd = process.env.DB_PASSWORD;
const pool = mysql.createPool({
	host: "localhost", user: user, password: passwd, database: "ChefDB",
})

async function getNextUserID() {
	let rows = await pool.query(`select max(UserId)
                                 from Users`)[0];
	if (!rows[0]["max(UserId)"]) {
		return 1;
	}
	return rows[0]["max(UserId)"] + 1;

}

async function createUser(UserName, Role, PhoneNo, Address, Hash) {
	let UserId = await getNextUserID()
	await pool.execute(`insert into Users(UserId, UserName, Role, PhoneNo, Address, Hash) value (?, ?, ?, ?, ?, UNHEX(?))`, [UserId, UserName, Role, PhoneNo, Address, Hash]);
	return UserId;
}

async function getUserCredentials(UserName) {
	return await pool.query(`select UserId, HEX(hash)
                             from Users
                             where UserName = ? `, [UserName])[0];
}

async function getUser(UserId) {
	let rows = await pool.query(`select *
                                 from Users
                                 where UserId = ? `, [UserId])[0];
	return rows[0];

}

async function getNextOrderID() {
	let rows = await pool.query(`select max(OrderId)
                                 from Orders`)[0];
	if (!rows[0]["max(OrderId)"]) {
		return 1;
	}
	return rows[0]["max(OrderId)"] + 1;
}

async function createOrder(UserId, Price) {
	let OrderId = await getNextOrderID();
	await pool.execute(`insert into Orders(OrderId, UserId, Price, Paid) value (?, ?, ?, false)`, [OrderId, UserId, Price]);
	return OrderId;
}

async function getNextDishID() {
	let rows = await pool.query(`select max(DishID)
                                 from Dishes`)[0];
	if (!rows[0]["max(DishID)"]) {
		return 1;
	}
	return rows[0]["max(DishID)"] + 1;
}

async function createDish(ItemId, OrderId, DishCount, splInstructions) {
	let DishId = await getNextDishID()
	await pool.execute(`insert into Dishes(DishId, ItemId, OrderId, DishCount, splInstructions, Prepared) value (?, ?, ?, ?, ?, false)`, [DishId, ItemId, OrderId, DishCount, splInstructions]);
	return DishId;
}

async function getItem(ItemId) {
	let rows = await pool.query(`select *
                                 from Items
                                 where ItemId = ?`, [ItemId])[0];
	return rows[0];
}

async function setDishPrepared(DishId, Prepared) {
	await pool.execute(`update Dishes
                        set Prepared = ?
                        where DishId = ?`, [Prepared, DishId]);
}

async function setOrderPaid(OrderId, Paid) {
	await pool.execute(`update Dishes
                        set Prepared = ?
                        where DishId = ?`, [Paid, OrderId]);
}

async function getAllOrders(StartIndex, Count) {
	return await pool.execute(`select *
                               from Orders
                               order by OrderId desc
                               limit ? offset ?`, [Count, StartIndex])[0]
}

async function getUserOrders(UserId, StartIndex, Count) {
	return await pool.execute(`select *
                               from Orders
                               where UserId = ?
                               order by OrderId desc
                               limit ? offset ?`, [UserId, Count, StartIndex])[0]
}

async function getUserOrder(UserId, OrderId){
	let rows = await pool.query(`select * from Orders where UserId = ? and OrderId = ?`, [UserId, OrderId])[0];
	return rows[0];
}

async function getOrderDishes(OrderId){
	return await pool.query(`select * from Dishes where OrderId = ?`, [OrderId])[0];
}
