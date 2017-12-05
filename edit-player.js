var storage = false;
	if(typeof(Storage) !== "undefined") {
		storage = true;
	}
	if(storage === true) {
		var num = localStorage.getItem("editplayer")
		document.getElementById("firstname").value = localStorage.getItem("firstname" + num);
		document.getElementById("lastname").value = localStorage.getItem("lastname" + num);
		document.getElementById("position").value = localStorage.getItem("position" + num);
		document.getElementById("status").value = localStorage.getItem("status" + num);
		document.getElementById("dob").value = localStorage.getItem("dob" + num);
		document.getElementById("feet").value = parseInt(localStorage.getItem("feet" + num), 10);
		document.getElementById("inches").value = parseInt(localStorage.getItem("inches" + num), 10);
		document.getElementById("weight").value = parseInt(localStorage.getItem("weight" + num), 10);

		document.getElementById("playerfoul").value = parseInt(localStorage.getItem("playerfoul" + num), 10);
		document.getElementById("playerrc").value = parseInt(localStorage.getItem("playerrc" + num), 10);
		document.getElementById("playeryc").value = parseInt(localStorage.getItem("playeryc" + num), 10);
		document.getElementById("playersog").value = parseInt(localStorage.getItem("playersog" + num), 10);
		document.getElementById("playerg").value = parseInt(localStorage.getItem("playerg" + num), 10);
		document.getElementById("playercka").value = parseInt(localStorage.getItem("playercka" + num), 10);
		document.getElementById("playergka").value = parseInt(localStorage.getItem("playergka" + num), 10);
		document.getElementById("playerpka").value = parseInt(localStorage.getItem("playerpka" + num), 10);
		document.getElementById("playerti").value = parseInt(localStorage.getItem("playerti" + num), 10);
		document.getElementById("playerapp").value = parseInt(localStorage.getItem("playerapp" + num), 10);
	}

function editplayer() {
	var storage = false;
	if(typeof(Storage) !== "undefined") {
		storage = true;
	}
	if(storage === true) {
		if(document.getElementById("firstname").value && document.getElementById("lastname").value && 
			document.getElementById("dob").value && document.getElementById("feet").value && 
			document.getElementById("inches").value && document.getElementById("weight").value && 
			document.getElementById("profilepic").value) {

			var num = localStorage.getItem("editplayer")
			localStorage.setItem("firstname" + num, document.getElementById("firstname").value);
			localStorage.setItem("lastname" + num, document.getElementById("lastname").value);
			localStorage.setItem("position" + num, document.getElementById("position").value);
			localStorage.setItem("status" + num, document.getElementById("status").value);
			localStorage.setItem("dob" + num, document.getElementById("dob").value);
			localStorage.setItem("feet" + num, document.getElementById("feet").value + "'");
			localStorage.setItem("inches" + num, document.getElementById("inches").value + "\"");
			localStorage.setItem("weight" + num, document.getElementById("weight").value + " lbs");

			if(!document.getElementById("playerfoul").value) {
				localStorage.setItem("playerfoul" + num, "0");
			}
			else {
				localStorage.setItem("playerfoul" + num, document.getElementById("playerfoul").value);
			}

			if(!document.getElementById("playerrc").value) {
				localStorage.setItem("playerrc" + num, "0");
			}
			else {
				localStorage.setItem("playerrc" + num, document.getElementById("playerrc").value);
			}

			if(!document.getElementById("playeryc").value) {
				localStorage.setItem("playeryc" + num, "0");
			}
			else {
				localStorage.setItem("playeryc" + num, document.getElementById("playeryc").value);
			}

			if(!document.getElementById("playersog").value) {
				localStorage.setItem("playersog" + num, "0");
			}
			else {
				localStorage.setItem("playersog" + num, document.getElementById("playersog").value);
			}

			if(!document.getElementById("playerg").value) {
				localStorage.setItem("playerg" + num, "0");
			}
			else {
				localStorage.setItem("playerg" + num, document.getElementById("playerg").value);
			}

			if(!document.getElementById("playercka").value) {
				localStorage.setItem("playercka" + num, "0");
			}
			else {
				localStorage.setItem("playercka" + num, document.getElementById("playercka").value);
			}

			if(!document.getElementById("playergka").value) {
				localStorage.setItem("playergka" + num, "0");
			}
			else {
				localStorage.setItem("playergka" + num, document.getElementById("playergka").value);
			}

			if(!document.getElementById("playerpka").value) {
				localStorage.setItem("playerpka" + num, "0");
			}
			else {
				localStorage.setItem("playerpka" + num, document.getElementById("playerpka").value);
			}

			if(!document.getElementById("playerti").value) {
				localStorage.setItem("playerti" + num, "0");
			}
			else {
				localStorage.setItem("playerti" + num, document.getElementById("playerti").value);
			}

			if(!document.getElementById("playerapp").value) {
				localStorage.setItem("playerapp" + num, "0");
			}
			else {
				localStorage.setItem("playerapp" + num, document.getElementById("playerapp").value);
			}
		}
		else {
			document.getElementById("warning").innerHTML = "Please enter all fields!";
			return false;
		}
	}
	window.location = "roster-admin.html";
	return false;
}