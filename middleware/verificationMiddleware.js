module.exports = {
    verifyCreateUser,
    verifyUserLogin,
    verifyCreateOrder,
    verifyPreparedDish,
    verifyPaidOrder,
    verifyGetDishes,
    verifySwapSections,
    verifyUserRole,
    verifyCreateItem,
    verifyEditItem
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

    if (!(req.header("Role") === "User") && !(req.header("Role") === "Chef") && !(req.header("Role") === "Admin")) {
        res.status(400).send("Invalid Role");
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
    let empty = true;

    for (let i in req.body["Items"]) {
        if (req.body["Items"][i]["count"] > 0) {
            empty = false;
        }
    }

    if (empty) {
        res.status(400).send("No Items provided");
        return;
    }
    for (let i in req.body["Items"]) {
        if (!req.body["Items"][i]["count"]) {
            res.status(400).send("Item Count Missing");
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

function verifyUserRole(req, res, next) {
    if (!req.header("UserId")) {
        res.status(400).send("No UserId provided");
        return;
    }
    if (!req.header("Role")) {
        res.status(400).send("No Paid State provided");
        return;
    }
    if (!(req.header("Role") === "User") && !(req.header("Role") === "Chef") && !(req.header("Role") === "Admin")) {
        res.status(400).send("Invalid Role");
        return;
    }
    next();
}

/*function verifyGetOrders(req, res, next) {
	if (!req.header("StartIndex")) {
		res.status(400).send("No StartIndex provided");
	}
	if (!req.header("Count")) {
		res.status(400).send("No Count provided");
	}
	next();
}*/

function verifyGetDishes(req, res, next) {
    if (!req.header("OrderId")) {
        res.status(400).send("No OrderId provided");
        return;
    }
    next();
}

function verifySwapSections(req, res, next) {
    if (!req.header("SectionId1")) {
        res.status(400).send("No SectionId provided");
        return;
    }
    if (!req.header("SectionId2")) {
        res.status(400).send("No SectionId2 provided");
        return;
    }
    next();
}

function verifyCreateItem(req, res, next) {
    if (!req.header("ItemName")) {
        res.status(400).send("No Item Name provided");
        return;
    }
    if (!req.header("SectionId")) {
        res.status(400).send("No SectionId provided");
        return;
    }
    if (!req.header("Price")) {
        res.status(400).send("No Price provided");
        return;
    }
    next();
}

function verifyEditItem(req, res, next) {
    if (!req.header("ItemId")) {
        res.status(400).send("No Item Id provided");
        return;
    }
    next();
}