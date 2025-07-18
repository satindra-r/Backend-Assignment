let upButtons = [];
let downButtons = [];

for (let i = 0; i < 10; i++) {
	let upButton = document.getElementById("button up " + i);
	if (upButton) {
		upButtons.push(upButton);
	}
	let downButton = document.getElementById("button down " + i);
	if (downButton) {
		downButtons.push(downButton);
	} else {
		break;
	}
}

upButtons[0].setAttribute("disabled", "");
downButtons[downButtons.length - 1].setAttribute("disabled", "");


for (let i = 0; i < upButtons.length; i++) {
	upButtons[i].addEventListener("click", async function (e) {
		let res = await fetch("/api/sections", {
			method: "PUT",
			headers: {
				"SectionId1": e.target["dataset"]["sectionid"],
				"SectionId2": downButtons[i - 1]["dataset"]["sectionid"],
			}
		})
		if (res["ok"]) {
			location.reload();
		}
	})
}
for (let i = 0; i < downButtons.length; i++) {
	downButtons[i].addEventListener("click", async function (e) {
		let res = await fetch("/api/sections", {
			method: "PUT",
			headers: {
				"SectionId1": e.target["dataset"]["sectionid"],
				"SectionId2": downButtons[i + 1]["dataset"]["sectionid"],
			}
		})
		if (res["ok"]) {
			location.reload();
		}
	})
}

document.getElementById("logout").addEventListener("click", function (e) {
	localStorage.clear();
	document.cookie = 'JWT=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
});