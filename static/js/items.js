let counters = [];
let checkboxes = [];
let instructions = [];
let pageCounter = document.getElementById("page");
const pageNo = new URLSearchParams(window.location.search).get("page");
let savedItems = JSON.parse(localStorage.getItem("Items")) || Object();
let savedFilters = document.getElementById("filters")["dataset"]["filters"];
for (let i = 0; i < 10; i++) {
    let counter = document.getElementById("counter " + i);
    if (counter) {
        if (savedItems[counter["dataset"]["itemid"]]) {
            counter.value = savedItems[counter["dataset"]["itemid"]]["count"] || 0;
        } else {
            counter.value = 0;
        }
        counters.push(counter);
    }
    let checkbox = document.getElementById("checkbox " + i);
    if (checkbox) {
        if ((savedFilters & (1 << i)) !== 0) {
            checkbox.checked = true;
        }
        checkboxes.push(checkbox);
    }
    let instruction = document.getElementById("instruction " + i);
    if (instruction) {
        if (savedItems[instruction["dataset"]["itemid"]]) {
            instruction.value = savedItems[instruction["dataset"]["itemid"]]["splInstructions"] || "";
        }
        instructions.push(instruction);
    } else {
        break;
    }
}
if (counters.length === 0) {
    document.location.replace("/items?page=" + Math.max(0, parseInt(pageCounter.value - 1 || "1")));
}
for (let i = 0; i < counters.length; i++) {
    counters[i].addEventListener("input", function (e) {
        let counterValue = Math.max(0, parseInt(e.target.value || "0"));
        e.target.value = counterValue;
        let items = JSON.parse(localStorage.getItem("Items")) || Object();
        if (!items[e.target["dataset"]["itemid"]]) {
            items[e.target["dataset"]["itemid"]] = Object();
        }
        if (counterValue) {
            items[e.target["dataset"]["itemid"]]["count"] = counterValue;
        } else {
            delete items[e.target["dataset"]["itemid"]];
        }
        localStorage.setItem("Items", JSON.stringify(items));
    })
}

for (let i = 0; i < instructions.length; i++) {
    instructions[i].addEventListener("input", function (e) {
        let instructionValue = e.target.value;
        let items = JSON.parse(localStorage.getItem("Items")) || Object();
        if (!items[e.target["dataset"]["itemid"]]) {
            items[e.target["dataset"]["itemid"]] = Object();
        }
        if (instructionValue) {
            items[e.target["dataset"]["itemid"]]["splInstructions"] = instructionValue;
            if ((items[e.target["dataset"]["itemid"]]["count"] || 0) === 0) {
                items[e.target["dataset"]["itemid"]]["count"] = 1;
                counters[i].value = 1
            }
        } else {
            items[e.target["dataset"]["itemid"]]["splInstructions"] = "";
        }
        localStorage.setItem("Items", JSON.stringify(items));
    })
}

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

document.getElementById("Order").addEventListener("click", async function (e) {
    savedItems = JSON.parse(localStorage.getItem("Items"));
    let orderedItems = Object();
    for (let i in savedItems) {
        if (savedItems[i]["count"] > 0) {
            orderedItems[i] = savedItems[i];
        }
    }
    let res = await fetch("/api/Order", {
        method: "POST", headers: {"Content-Type": "application/json",}, body: JSON.stringify({"Items": orderedItems}),
    })
    if (res["ok"]) {
        localStorage.setItem("Items", "{}");
        document.location.href = "/orders";
    }
})

document.getElementById("logout").addEventListener("click", function (e) {
    localStorage.clear();
    document.cookie = 'JWT=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
});