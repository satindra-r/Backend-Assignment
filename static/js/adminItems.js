let checkboxes = [];
let edits = [];

let itemNames = [];
let sectionIds = [];
let prices = [];


let pageCounter = document.getElementById("page");
const pageNo = new URLSearchParams(window.location.search).get("page");
let savedFilters = document.getElementById("filters")["dataset"]["filters"];
let error = document.getElementById("Error");

for (let i = 0; i < 10; i++) {

    let checkbox = document.getElementById("checkbox " + i);
    if (checkbox) {
        if ((savedFilters & (1 << i)) !== 0) {
            checkbox.checked = true;
        }
        checkboxes.push(checkbox);
    }

    let itemName = document.getElementById("itemName " + i);
    if (itemName) {
        itemName.value = "";
        itemNames.push(itemName);
    }

    let sectionId = document.getElementById("sectionId " + i);
    if (sectionId) {
        sectionIds.push(sectionId);
    }

    let price = document.getElementById("price " + i);
    if (price) {
        price.value = "";
        prices.push(price);
    }

    let edit = document.getElementById("edit " + i);
    if (edit) {
        edits.push(edit);
    } else {
        break;
    }
}
if (edits.length === 0) {
    document.location.replace("/items?page=" + Math.max(0, parseInt(pageCounter.value - 1 || "1")));
}

for (let i = 0; i < edits.length; i++) {
    edits[i].addEventListener("click", async function (e) {
        let headers = Object()
        headers["ItemId"] = e.target["dataset"]["itemid"];
        if (itemNames[i].value) {
            headers["ItemName"] = itemNames[i].value;
        }
        if (sectionIds[i].value) {
            headers["SectionId"] = sectionIds[i].value;
        }
        if (prices[i].value) {
            headers["Price"] = prices[i].value;
        }
        let res = await fetch("/api/Item", {
            method: "PUT", headers: headers
        });
        if (res["ok"]) {
            document.location.reload();
        } else {
            error.classList.remove("hidden");
            error.innerText = await res.text()
        }


    })
}

document.getElementById("edit -1").addEventListener("click", async function (e) {

    let res = await fetch("/api/Item", {
        method: "POST", headers: {
            ItemName: document.getElementById("itemName -1").value,
            SectionId: document.getElementById("sectionId -1").value,
            Price: document.getElementById("price -1").value
        }
    });
    if (res["ok"]) {
        document.location.reload();
    } else {
        error.classList.remove("hidden");
        error.innerText = await res.text()
    }


})

for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("click", function (e) {
        savedFilters ^= (1 << (e.target["dataset"]["sectionid"] - 1));
        document.location.href = "/items?page=" + pageCounter.value + "&filters=" + savedFilters;
    })
}

pageCounter.addEventListener("click", function (e) {
    if (pageCounter.value !== pageNo) {
        document.location.href = "/items?page=" + e.target.value + "&filters=" + savedFilters;
    }
})

pageCounter.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        if (pageCounter.value !== pageNo) {
            document.location.href = "/items?page=" + e.target.value + "&filters=" + savedFilters;
        }
    }
})

document.getElementById("logout").addEventListener("click", function (e) {
    localStorage.clear();
    document.cookie = 'JWT=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
});