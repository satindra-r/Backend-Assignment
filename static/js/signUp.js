submit = document.getElementById("Submit");
username = document.getElementById("Username");
phoneNumber = document.getElementById("Phone Number");
address = document.getElementById("Address");
password = document.getElementById("Password");
confirmPassword = document.getElementById("Confirm Password");

submit.addEventListener("click", async function () {
	if (password.value === confirmPassword.value) {
		if ((await fetch("/api/User", {
			method: "POST",
			headers: {
				"Username": username.value,
				"PhoneNo": phoneNumber.value,
				"Address": address.value,
				"Password": password.value,
				"Role": "User"
			}
		}))["ok"]) {
			window.location.href = "/login";
		}

	}
})