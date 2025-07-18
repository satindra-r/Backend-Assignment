let dropdownStatus = JSON.parse(localStorage.getItem("dropdownStatus")) || Object();
let dropdowns = [];
let checkboxes = [];
let paymentCheckboxes = [];
let progresses = [];
let pageCounter = document.getElementById("page");
const pageNo = new URLSearchParams(window.location.search).get("page");

function toggleHide(e) {
	let toggleElements = document.getElementsByClassName("hidden-" + e.target.id.slice(9));
	for (let j = 0; j < toggleElements.length; j++) {
		toggleElements[j].classList.toggle("hidden");
	}
	let currDropdownStatus = JSON.parse(localStorage.getItem("dropdownStatus")) || Object();

	if (e.target.innerText === "v") {
		e.target.innerText = ">";
		currDropdownStatus[e.target["dataset"]["orderid"]] = true;
	} else {
		e.target.innerText = "v";
		delete currDropdownStatus[e.target["dataset"]["orderid"]];
	}
	localStorage.setItem("dropdownStatus", JSON.stringify(currDropdownStatus));
}

for (let i = 0; i < 10; i++) {

	let paymentCheckbox = document.getElementById("checkbox " + i);
	if (paymentCheckbox) {
		paymentCheckboxes.push(paymentCheckbox);
	}

	let orderCheckboxes = [];
	for (let j = 0; ; j++) {
		let checkbox = document.getElementById("checkbox " + i + " " + j);
		if (checkbox) {
			orderCheckboxes.push(checkbox);
		} else {
			break;
		}
	}
	if (orderCheckboxes.length > 0) {
		checkboxes.push(orderCheckboxes);
	}

	let progress = document.getElementById("progress " + i);
	if (progress) {
		progresses.push(progress);
	}

	let dropdown = document.getElementById("dropdown " + i);
	if (dropdown) {
		if (dropdownStatus[dropdown["dataset"]["orderid"]]) {
			toggleHide({"target": dropdown});
			dropdown.innerText = ">"
		}
		dropdowns.push(dropdown);
	} else {
		break;
	}
}

if (dropdowns.length === 0 && pageNo > 1) {
	document.location.replace("/orders?page=" + Math.max(0, parseInt(pageCounter.value - 1 || "1")));
}

for (let i = 0; i < dropdowns.length; i++) {
	dropdowns[i].addEventListener("click", function (e) {
		toggleHide(e)
	});
}

for (let i = 0; i < checkboxes.length; i++) {
	for (let j = 0; j < checkboxes[i].length; j++) {
		checkboxes[i][j].addEventListener("click", async function (e) {
			let res = await fetch("/api/dish", {
				method: "PUT",
				headers: {
					DishId: e.target["dataset"]["dishid"],
					Prepared: e.target.checked + 0
				}
			});
			if (res["ok"]) {
				location.reload();
			}
		})
	}
}

for (let i = 0; i < paymentCheckboxes.length; i++) {
	paymentCheckboxes[i].addEventListener("click", async function (e) {
		let res = await fetch("/api/Order", {
			method: "PUT",
			headers: {
				OrderId: e.target["dataset"]["orderid"],
				paid: e.target.checked + 0
			}
		});
		if (res["ok"]) {
			location.reload();
		}
	})

}

pageCounter.addEventListener("click", function (e) {
	if (pageCounter.value !== pageNo) {
		document.location.href = "/orders?page=" + e.target.value;
	}
});

pageCounter.addEventListener("keydown", function (e) {
	if (e.key === "Enter") {
		if (pageCounter.value !== pageNo) {
			document.location.href = "/orders?page=" + e.target.value;
		}
	}
});

document.getElementById("logout").addEventListener("click", function () {
	localStorage.clear();
	document.cookie = 'JWT=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
});