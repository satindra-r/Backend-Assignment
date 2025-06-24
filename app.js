const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const app = express()
app.use(express.json());
const port = 3000

const VerifMid = require('./Middleware/verificationMiddleware');
const AuthMid = require('./Middleware/authMiddleware');
const DBMid = require('./Middleware/dbMiddleware');


app.post("/User", VerifMid.verifyCreateUser, AuthMid.hashCreateUser, DBMid.createUser);
app.get("/User/Login", VerifMid.verifyUserLogin, DBMid.getUserCredentials, AuthMid.checkUserCredentials);

app.get("/Order/Chef", VerifMid.verifyGetOrders, AuthMid.verifyChef, DBMid.getAllOrders);

app.get("/Order/User", VerifMid.verifyGetOrders, AuthMid.verifyUser, DBMid.getUserOrders);

app.get("/Dishes/Chef", VerifMid.verifyGetDishes, AuthMid.verifyChef, DBMid.getOrderDishes);

app.get("/Dishes/User", VerifMid.verifyGetDishes, AuthMid.verifyUser, DBMid.getUserOrderDishes);

app.post("/Order", VerifMid.verifyCreateOrder, AuthMid.verifyUser, DBMid.getUser, DBMid.createOrder);

app.put("/Dish", VerifMid.verifyPreparedDish, AuthMid.verifyUser, DBMid.getUser, AuthMid.verifyChef, DBMid.setDishPrepared);

app.put("/Order", VerifMid.verifyPaidOrder, AuthMid.verifyUser, DBMid.getUser, AuthMid.verifyAdmin, DBMid.setOrderPaid);

app.listen(port, () => {
	console.log("Server is running on port " + port);
})