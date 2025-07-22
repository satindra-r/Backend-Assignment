const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express()
app.use(express.json());
const port = 8090

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const VerifMid = require("./middleware/verificationMiddleware");
const AuthMid = require("./middleware/authMiddleware");
const DBMid = require("./middleware/dbMiddleware");
const DB = require("./middleware/db");


app.set("view engine", "ejs");
app.use(express.static("static"));

app.get("/", AuthMid.verifyUser, async (req, res) => {
    if (req.UserId) {
        res.redirect(302, "/items");
    } else {
        res.redirect(302, "/login");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/signUp", (req, res) => {
    res.render("signUp");
});

app.get("/items", AuthMid.verifyUser, async (req, res) => {
    if (req.UserId) {
        let User = await DB.getUser(req.UserId);
        if (User["Role"] === "Admin") {
            let page = Math.max(1, parseInt(parseInt(req.query.page) || "1"));
            let filters = Math.max(0, parseInt(parseInt(req.query.filters) || "0"));
            let items = await DB.getItems(page, filters);
            let sections = await DB.getSections();
            res.render("adminItems", {"items": items, "sections": sections, "page": page, "filters": filters});
        } else if (User["Role"] === "Chef") {
            res.redirect(302, "/orders");
        } else {
            let page = Math.max(1, parseInt(parseInt(req.query.page) || "1"));
            let filters = Math.max(0, parseInt(parseInt(req.query.filters) || "0"));
            let items = await DB.getItems(page, filters);
            let sections = await DB.getSections();
            res.render("items", {"items": items, "sections": sections, "page": page, "filters": filters});
        }
    } else {
        res.redirect(302, "/login");
    }
});

app.get("/sections", AuthMid.verifyUser, DBMid.getUser, AuthMid.verifyAdmin, async (req, res) => {
    let sections = await DB.getSections();
    res.render("adminSections", {"sections": sections});
})

app.get("/orders", AuthMid.verifyUser, async (req, res) => {
    if (req.UserId) {

        let User = await DB.getUser(req.UserId);
        if (User["Role"] === "Admin") {
            let page = Math.max(1, parseInt(parseInt(req.query.page) || "1"));
            let items = await DB.getAllItems();
            let dishes = await DB.getDishes();
            let orders = await DB.getAllOrders(page);
            res.render("adminOrders", {"items": items, "dishes": dishes, "orders": orders, "page": page});
        } else if (User["Role"] === "Chef") {
            let page = Math.max(1, parseInt(parseInt(req.query.page) || "1"));
            let items = await DB.getAllItems();
            let dishes = await DB.getDishes();
            let orders = await DB.getAllOrders(page);
            res.render("chefOrders", {"items": items, "dishes": dishes, "orders": orders, "page": page});
        } else {
            let page = Math.max(1, parseInt(parseInt(req.query.page) || "1"));
            let items = await DB.getAllItems();
            let dishes = await DB.getDishes();
            let orders = await DB.getUserOrders(req.UserId, page);
            res.render("orders", {"items": items, "dishes": dishes, "orders": orders, "page": page});
        }
    } else {
        res.redirect(302, "/login");
    }
});

app.get("/bill", AuthMid.verifyUser, async (req, res) => {
    if (req.UserId) {
        let OrderId = Math.max(1, parseInt(parseInt(req.query.order) || "1"));
        let order = await DB.getUserOrder(req.UserId, OrderId);
        if (order) {
            let dishes = await DB.getOrderDishes(OrderId);
            let items = await DB.getAllItems();
            res.render("bill", {"items": items, "dishes": dishes, "order": order});
        } else {
            res.redirect(403, "/orders");
        }
    } else {
        res.redirect(302, "/login");
    }
})

app.get("/users", AuthMid.verifyUser, DBMid.getUser, AuthMid.verifyAdmin, async (req, res) => {
    let page = Math.max(1, parseInt(parseInt(req.query.page) || "1"));
    let users = await DB.getUsers();
    res.render("users", {"users": users, "page": page, "adminUser": req.UserId});
})

app.post("/api/User/", VerifMid.verifyCreateUser, AuthMid.hashCreateUser, DBMid.createUser);
app.get("/api/User/Login", VerifMid.verifyUserLogin, DBMid.getUserCredentials, AuthMid.checkUserCredentials);

//app.get("/api/Order/Chef", VerifMid.verifyGetOrders, AuthMid.verifyChef, DBMid.getAllOrders);

//app.get("/api/Order/User", VerifMid.verifyGetOrders, AuthMid.verifyUser, DBMid.getUserOrders);

app.get("/api/Dishes/Chef", VerifMid.verifyGetDishes, AuthMid.verifyChef, DBMid.getOrderDishes);

app.get("/api/Dishes/User", VerifMid.verifyGetDishes, AuthMid.verifyUser, DBMid.getUserOrderDishes);

app.post("/api/Order", VerifMid.verifyCreateOrder, AuthMid.verifyUser, DBMid.getUser, DBMid.createOrder);

app.put("/api/Dish", VerifMid.verifyPreparedDish, AuthMid.verifyUser, DBMid.getUser, AuthMid.verifyChef, DBMid.setDishPrepared);

app.put("/api/Order", VerifMid.verifyPaidOrder, AuthMid.verifyUser, DBMid.getUser, AuthMid.verifyAdmin, DBMid.setOrderPaid);

app.put("/api/Sections", VerifMid.verifySwapSections, AuthMid.verifyUser, DBMid.getUser, AuthMid.verifyAdmin, DBMid.swapSections);

app.put("/api/User", VerifMid.verifyUserRole, AuthMid.verifyUser, DBMid.getUser, AuthMid.verifyAdmin, DBMid.setUserRole);

app.post("/api/Item", VerifMid.verifyCreateItem, AuthMid.verifyUser, DBMid.getUser, AuthMid.verifyAdmin, DBMid.createItem);

app.put("/api/Item", VerifMid.verifyEditItem, AuthMid.verifyUser, DBMid.getUser, AuthMid.verifyAdmin, DBMid.editItem);

app.listen(port, () => {
    console.log("Server is running on port " + port);
})