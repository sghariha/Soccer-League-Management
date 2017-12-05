if(typeof(Storage) !== "undefined") {
	if(localStorage.getItem("rememberstatus")) {
		//window.location = "scheduleadmin.html";
	}
}

function login() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var rememberMe = document.getElementById("rememberme").checked;
	var storage = false;
	if(typeof(Storage) !== "undefined") {
		storage = true;
	}
	if(username === "userOne" && password === "password") {
		if(rememberMe === true && storage === true) {
			localStorage.setItem("rememberstatus", "remember");
		}
		window.location = "statistics-admin.html"
		return false;
	}
	if(localStorage.getItem("username") && localStorage.getItem("email") && localStorage.getItem("password")) {
		if((username === localStorage.getItem("username") || username === localStorage.getItem("email")) &&
			password === localStorage.getItem("password")) {
			if(rememberMe === true && storage === true) {
				localStorage.setItem("rememberstatus", "remember");
			}
			window.location = "statistics-admin.html"
			return false;
		}
	}
	else {
		document.getElementById("loginform").reset();
		document.getElementById("warning").innerHTML = "Incorrect login. Please try again.";
		return false;
	}
}
