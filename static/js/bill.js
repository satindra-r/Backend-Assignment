document.getElementById("logout").addEventListener("click", function (e) {
	localStorage.clear();
	document.cookie ='JWT=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
});