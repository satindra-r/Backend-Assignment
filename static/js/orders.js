let dropdowns = [];
let pays = [];
let pageCounter = document.getElementById("page");
const pageNo = new URLSearchParams(window.location.search).get("page");
for (let i = 0; i < 10; i++) {
	let pay = document.getElementById("pay " + i);
	if (pay) {
		pays.push(pay);
	}
	let dropdown = document.getElementById("dropdown " + i);
	if (dropdown) {
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
		let toggleElements = document.getElementsByClassName("hidden-" + i);
		for (let j = 0; j < toggleElements.length; j++) {
			toggleElements[j].classList.toggle("hidden-class");
		}
		if (e.target.innerText === "v") {
			e.target.innerText = ">";
		} else {
			e.target.innerText = "v";
		}
	});
}

for (let i = 0; i < pays.length; i++) {
	pays[i].addEventListener("click", function (e) {
		document.location.href = "/bill?order=" + e.target["dataset"]["orderid"];
	});
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

document.getElementById("logout").addEventListener("click", function (e) {
	localStorage.clear();
	document.cookie ='JWT=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
});