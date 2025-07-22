submit = document.getElementById("Submit");
username = document.getElementById("Username");
phoneNumber = document.getElementById("Phone Number");
address = document.getElementById("Address");
password = document.getElementById("Password");
confirmPassword = document.getElementById("Confirm Password");
error=document.getElementById("Error");

submit.addEventListener("click", async function () {
    if (password.value === confirmPassword.value) {
        let res = (await fetch("/api/User", {
            method: "POST",
            headers: {
                "Username": username.value,
                "PhoneNo": phoneNumber.value,
                "Address": address.value,
                "Password": password.value,
                "Role": "User"
            }
        }))
        if (res["ok"]) {
            window.location.href = "/login";
        } else {
            error.classList.remove("hidden");
            error.innerText = await res.text()
        }

    }else{
        error.classList.remove("hidden");
        document.getElementById("Error").innerText = "Password does not match with Confirm Password"
    }
})