let userRadios = [];
let chefRadios = [];
let adminRadios = [];

let pageCounter = document.getElementById("page");
const pageNo = new URLSearchParams(window.location.search).get("page");

for (let i = 0; i < 10; i++) {

	let userRadio = document.getElementById("radio 1 " + i);
	if (userRadio) {
		userRadios.push(userRadio);
	}

	let chefRadio = document.getElementById("radio 2 " + i);
	if (chefRadio) {
		chefRadios.push(chefRadio);
	}

	let adminRadio = document.getElementById("radio 3 " + i);
	if (adminRadio) {
		adminRadios.push(adminRadio);
	} else {
		break;
	}
}

if (userRadios.length === 0 && pageNo > 1) {
	document.location.replace("/users?page=" + Math.max(0, parseInt(pageCounter.value - 1 || "1")));
}

for (let i = 0; i < userRadios.length; i++) {
	userRadios[i].addEventListener("click", async function (e) {
		let res = await fetch("/api/User", {
			method: "PUT", headers: {
				UserId: e.target["dataset"]["userid"], Role: "User"
			}
		});
		if (res["ok"]) {
			location.reload();
		}
	})

}

for (let i = 0; i < chefRadios.length; i++) {
	chefRadios[i].addEventListener("click", async function (e) {
		let res = await fetch("/api/User", {
			method: "PUT", headers: {
				UserId: e.target["dataset"]["userid"], Role: "Chef"
			}
		});
		if (res["ok"]) {
			location.reload();
		}
	})

}

for (let i = 0; i < adminRadios.length; i++) {
	adminRadios[i].addEventListener("click", async function (e) {
		let res = await fetch("/api/User", {
			method: "PUT", headers: {
				UserId: e.target["dataset"]["userid"], Role: "Admin"
			}
		});
		if (res["ok"]) {
			location.reload();
		}
	})

}

pageCounter.addEventListener("click", function (e) {
	if (pageCounter.value !== pageNo) {
		document.location.href = "/users?page=" + e.target.value;
	}
});

pageCounter.addEventListener("keydown", function (e) {
	if (e.key === "Enter") {
		if (pageCounter.value !== pageNo) {
			document.location.href = "/users?page=" + e.target.value;
		}
	}
});

document.getElementById("logout").addEventListener("click", function () {
	localStorage.clear();
	document.cookie = 'JWT=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
});