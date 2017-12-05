var storage = false;
	if(typeof(Storage) !== "undefined") {
		storage = true;
	}
	if(storage === true) {
		var num = localStorage.getItem("editingstatsfor")
		document.getElementById("winorloss").value = localStorage.getItem("winorloss" + num);
		document.getElementById("homescore").value = parseInt(localStorage.getItem("homescore" + num), 10);
		document.getElementById("awayscore").value = parseInt(localStorage.getItem("awayscore" + num), 10);
		document.getElementById("fouls").value = parseInt(localStorage.getItem("fouls" + num), 10);
		document.getElementById("cards").value = parseInt(localStorage.getItem("cards" + num), 10);
		document.getElementById("shotsongoal").value = parseInt(localStorage.getItem("shotsongoal" + num), 10);
		document.getElementById("goalsmade").value = parseInt(localStorage.getItem("goalsmade" + num), 10);
		document.getElementById("cornerkicks").value = parseInt(localStorage.getItem("cornerkicks" + num), 10);
		document.getElementById("goalkicks").value = parseInt(localStorage.getItem("goalkicks" + num), 10);
		document.getElementById("posstime").value = parseInt(localStorage.getItem("fouls" + num), 10);
	}

function editstats() {
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

			if(localStorage.getItem("winorloss" + (localStorage.getItem("editingstatsfor"))) !== document.getElementById("winorloss").value) {
				if(localStorage.getItem("winorloss" + (localStorage.getItem("editingstatsfor"))) === "win") {
					if(document.getElementById("winorloss").value === "loss") {
						teamwins = teamwins - 1;
						teamlosses = teamlosses + 1;
					}
					else {
						teamwins = teamwins - 1;
						teamties = teamties + 1;
					}
				}
				if(localStorage.getItem("winorloss" + (localStorage.getItem("editingstatsfor"))) === "loss") {
					if(document.getElementById("winorloss").value === "win") {
						teamlosses = teamlosses - 1;
						teamwins = teamwins + 1;
					}
					else {
						teamlosses = teamlosses - 1;
						teamties = teamties + 1;
					}
				}
				if(localStorage.getItem("winorloss" + (localStorage.getItem("editingstatsfor"))) === "tie") {
					if(document.getElementById("winorloss").value === "win") {
						teamties = teamties - 1;
						teamwins = teamwins + 1;
					}
					else {
						teamties = teamties - 1;
						teamlosses = teamlosses + 1;
					}
				}
			}
			teamgoalsfor = teamgoalsfor - 
			parseInt(localStorage.getItem("homescore" + (localStorage.getItem("editingstatsfor"))), 10) + 
			parseInt(document.getElementById("homescore").value, 10);

			teamgoalsagainst = teamgoalsagainst - 
			parseInt(localStorage.getItem("awayscore" + (localStorage.getItem("editingstatsfor"))), 10) + 
			parseInt(document.getElementById("awayscore").value, 10);

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