function addplayer() {
	var storage = false;
	if(typeof(Storage) !== "undefined") {
		storage = true;
	}
	if(storage === true) {
		if(document.getElementById("firstname").value && document.getElementById("lastname").value && 
			document.getElementById("dob").value && document.getElementById("feet").value && 
			document.getElementById("inches").value && document.getElementById("weight").value && 
			document.getElementById("profilepic").value) {

			if(!localStorage.getItem("playercount")) {
				localStorage.setItem("playercount", "0");
			}
			count = localStorage.getItem("playercount");
			newcount = parseInt(count, 10) + 1;
			console.log(newcount);
			localStorage.setItem("playercount", newcount.toString());
			localStorage.setItem("playernumber" + newcount.toString(), newcount.toString());
			localStorage.setItem("firstname" + newcount.toString(), document.getElementById("firstname").value);
			localStorage.setItem("lastname" + newcount.toString(), document.getElementById("lastname").value);
			localStorage.setItem("position" + newcount.toString(), document.getElementById("position").value);
			localStorage.setItem("status" + newcount.toString(), document.getElementById("status").value);
			localStorage.setItem("dob" + newcount.toString(), document.getElementById("dob").value);
			localStorage.setItem("feet" + newcount.toString(), document.getElementById("feet").value + "'");
			localStorage.setItem("inches" + newcount.toString(), document.getElementById("inches").value + "\"");
			localStorage.setItem("weight" + newcount.toString(), document.getElementById("weight").value + " lbs");

			if(!document.getElementById("playerfoul").value) {
				localStorage.setItem("playerfoul" + newcount.toString(), "0");
			}
			else {
				localStorage.setItem("playerfoul" + newcount.toString(), document.getElementById("playerfoul").value);
			}

			if(!document.getElementById("playerrc").value) {
				localStorage.setItem("playerrc" + newcount.toString(), "0");
			}
			else {
				localStorage.setItem("playerrc" + newcount.toString(), document.getElementById("playerrc").value);
			}

			if(!document.getElementById("playeryc").value) {
				localStorage.setItem("playeryc" + newcount.toString(), "0");
			}
			else {
				localStorage.setItem("playeryc" + newcount.toString(), document.getElementById("playeryc").value);
			}

			if(!document.getElementById("playersog").value) {
				localStorage.setItem("playersog" + newcount.toString(), "0");
			}
			else {
				localStorage.setItem("playersog" + newcount.toString(), document.getElementById("playersog").value);
			}

			if(!document.getElementById("playerg").value) {
				localStorage.setItem("playerg" + newcount.toString(), "0");
			}
			else {
				localStorage.setItem("playerg" + newcount.toString(), document.getElementById("playerg").value);
			}

			if(!document.getElementById("playercka").value) {
				localStorage.setItem("playercka" + newcount.toString(), "0");
			}
			else {
				localStorage.setItem("playercka" + newcount.toString(), document.getElementById("playercka").value);
			}

			if(!document.getElementById("playergka").value) {
				localStorage.setItem("playergka" + newcount.toString(), "0");
			}
			else {
				localStorage.setItem("playergka" + newcount.toString(), document.getElementById("playergka").value);
			}

			if(!document.getElementById("playerpka").value) {
				localStorage.setItem("playerpka" + newcount.toString(), "0");
			}
			else {
				localStorage.setItem("playerpka" + newcount.toString(), document.getElementById("playerpka").value);
			}

			if(!document.getElementById("playerti").value) {
				localStorage.setItem("playerti" + newcount.toString(), "0");
			}
			else {
				localStorage.setItem("playerti" + newcount.toString(), document.getElementById("playerti").value);
			}

			if(!document.getElementById("playerapp").value) {
				localStorage.setItem("playerapp" + newcount.toString(), "0");
			}
			else {
				localStorage.setItem("playerapp" + newcount.toString(), document.getElementById("playerapp").value);
			}

		}
		else {
			document.getElementById("warning").innerHTML = "Please enter all fields!";
			return false;
		}
		window.location = "roster-admin.html";
		return false;
	}
}