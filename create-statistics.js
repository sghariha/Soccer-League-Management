function addstats() {
	var storage = false;
	if(typeof(Storage) !== "undefined") {
		storage = true;
	}
	if(storage === true) {
		if(document.getElementById("winorloss").value && document.getElementById("homescore").value && 
			document.getElementById("awayscore").value && document.getElementById("fouls").value && 
			document.getElementById("cards").value && document.getElementById("shotsongoal").value && 
			document.getElementById("goalsmade").value && document.getElementById("cornerkicks").value && 
			document.getElementById("goalkicks").value && document.getElementById("posstime").value) {

			var teamwins = parseInt(localStorage.getItem("teamwins"), 10);
			var teamlosses = parseInt(localStorage.getItem("teamlosses"), 10);
			var teamties = parseInt(localStorage.getItem("teamties"), 10);
			var teamgoalsfor = parseInt(localStorage.getItem("teamgoalsfor"), 10);
			var teamgoalsagainst = parseInt(localStorage.getItem("teamgoalsagainst"), 10);

			if(document.getElementById("winorloss").value === "win") {
				teamwins = teamwins + 1;
			}
			if(document.getElementById("winorloss").value === "loss") {
				teamlosses = teamlosses + 1;
			}
			if(document.getElementById("winorloss").value === "tie") {
				teamties = teamties + 1;
			}
			teamgoalsfor = teamgoalsfor + parseInt(document.getElementById("homescore").value, 10);
			teamgoalsagainst = teamgoalsagainst + parseInt(document.getElementById("awayscore").value, 10);

			gamenum = localStorage.getItem("editingstatsfor");
			console.log(gamenum);
			localStorage.setItem("teamwins", teamwins.toString());
			localStorage.setItem("teamlosses", teamlosses.toString());
			localStorage.setItem("teamties", teamties.toString());
			localStorage.setItem("teamgoalsfor", teamgoalsfor.toString());
			localStorage.setItem("teamgoalsagainst", teamgoalsagainst.toString());
			localStorage.setItem("winorloss" + gamenum, document.getElementById("winorloss").value);
			localStorage.setItem("homescore" + gamenum, document.getElementById("homescore").value);
			localStorage.setItem("awayscore" + gamenum, document.getElementById("awayscore").value);
			localStorage.setItem("fouls" + gamenum, document.getElementById("fouls").value);
			localStorage.setItem("cards" + gamenum, document.getElementById("cards").value);
			localStorage.setItem("shotsongoal" + gamenum, document.getElementById("shotsongoal").value);
			localStorage.setItem("goalsmade" + gamenum, document.getElementById("goalsmade").value);
			localStorage.setItem("cornerkicks" + gamenum, document.getElementById("cornerkicks").value);
			localStorage.setItem("goalkicks" + gamenum, document.getElementById("goalkicks").value);
			localStorage.setItem("posstime" + gamenum, document.getElementById("posstime").value);

		}
		else {
			document.getElementById("warning").innerHTML = "Please enter all fields!";
			return false;
		}
		window.location = "statistics-admin.html";
		return false;
	}
}