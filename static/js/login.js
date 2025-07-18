submit = document.getElementById("Submit");
username = document.getElementById("Username");
password = document.getElementById("Password");

submit.addEventListener("click", async function () {
	let res = await (await fetch("/api/User/login", {
		method: "GET",
		headers: {"Username": username.value, "Password": password.value}
	}));
	if (res["ok"]) {
		let JWT = await res.text();
		const date = new Date();
		date.setTime(Date.now() + (24 * 60 * 60 * 1000));
		document.cookie = "JWT=" + JWT + ";" + "Expires=" + date.toUTCString() + ";SameSite=strict;Path=/";
		window.location.href = "/items";
	}
})