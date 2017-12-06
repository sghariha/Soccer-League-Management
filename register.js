var config = {
    apiKey: "AIzaSyBig_htEJTY6jZ1LpuT6DvXnrqrXaa2heY",
    authDomain: "cse134b-527c4.firebaseapp.com",
    databaseURL: "https://cse134b-527c4.firebaseio.com",
    projectId: "cse134b-527c4",
    storageBucket: "cse134b-527c4.appspot.com",
    messagingSenderId: "46669459351"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('new-team-signup').style.display = "none";
    var team = [];
    var query = database.ref("teams").orderByKey();
	query.once("value")
	.then(function(snapshot) {
    	snapshot.forEach(function(childSnapshot) {
      		team.push(childSnapshot.key);
      		console.log(team);
      		var x = document.getElementById("jointeam");
			var option = document.createElement("option");
			option.text = childSnapshot.key;
			option.value = childSnapshot.key;
			x.add(option, x[0]);
  		});
	});
});

function showExistingTeam() {
	document.getElementById('new-team-signup').style.display = "none";
	document.getElementById('existing-team-signup').style.display = "block";
	if(document.getElementById('nav_new').classList.contains("active")) {
		document.getElementById('nav_new').classList.remove("active");
	}
	if(!document.getElementById('nav_existing').classList.contains("active")) {
		document.getElementById('nav_existing').classList.add("active");
	}
}

function showNewTeam() {
	document.getElementById('existing-team-signup').style.display = "none";
	document.getElementById('new-team-signup').style.display = "block";
	if(document.getElementById('nav_existing').classList.contains("active")) {
		document.getElementById('nav_existing').classList.remove("active");
	}
	if(!document.getElementById('nav_new').classList.contains("active")) {
		document.getElementById('nav_new').classList.add("active");
	}
}

function registerExisting() {
	if(document.getElementById('username').value && document.getElementById('email').value && 
	document.getElementById('password').value && document.getElementById('confirmpassword').value) {
		if(document.getElementById('password').value === document.getElementById('confirmpassword').value) {
			firebase.auth().createUserWithEmailAndPassword(document.getElementById('email').value, 
			document.getElementById('password').value).catch(function(error) {
  				var errorCode = error.code;
  				var errorMessage = error.message;
  				document.getElementById("warning").innerHTML = "Ensure email is valid and if password is at least 6 characters!";
  				return false;
			});
			var storedEmail = document.getElementById('email').value.replace('.', '').replace('@', '');
			firebase.database().ref('users').update({[storedEmail] : document.getElementById('jointeam').value})
		}
		else {
			document.getElementById("warning").innerHTML = "Passwords do not match!";
		}
	}
}

function registerNew() {
	if(document.getElementById('username').value && document.getElementById('email').value && 
	document.getElementById('password').value && document.getElementById('confirmpassword').value && 
	document.getElementById('team-new').value) {
		if(document.getElementById('password').value === document.getElementById('confirmpassword').value) {
			firebase.auth().createUserWithEmailAndPassword(document.getElementById('email').value, 
			document.getElementById('password').value).then(function(result) {
				var storedEmail = document.getElementById('email').value.replace('.', '').replace('@', '');
				firebase.database().ref('users').update({[storedEmail] : document.getElementById('team-new').value});
				firebase.database().ref('teams/' + document.getElementById('team-new').value).update({teamname : document.getElementById('team-new').value});
			}).catch(function(error) {
  				var errorCode = error.code;
  				var errorMessage = error.message;
  				document.getElementById("warning").innerHTML = "Ensure email is valid and if password is at least 6 characters!";
  				return false;
			});
		}
		else {
			document.getElementById("warning").innerHTML = "Passwords do not match!";
		}
	}
}

/*
function change(obj) {
	var select = obj;
	var selected = select.options[select.selectedIndex].value;

	if(selected === "player" || selected === "admin-existing-team") {
    var elements2 = document.getElementsByClassName('new-team');
    for(var i=0; i < elements2.length; i++) {
      elements2[i].style.display = 'none';
    }
		document.getElementById('existing-team-signup').style.display = 'flex';
	}
	else {
    var elements2 = document.getElementsByClassName('new-team');
    for(var i=0; i < elements2.length; i++) {
      elements2[i].style.display = 'flex';
    }
		document.getElementById('existing-team-signup').style.display = "none";
	}
}

function register() {
	var storage = false;
	var selected = document.getElementById("mySelect").value;
	if(typeof(Storage) !== "undefined") {
		storage = true;
	}
	if(storage === true) {
		localStorage.setItem("username", document.getElementById("username").value);
		localStorage.setItem("email", document.getElementById("email").value);
		localStorage.setItem("password", document.getElementById("password").value);
		if(selected === "player") {
			localStorage.setItem("accounttype", "player");
			localStorage.setItem("team", document.getElementById("team-existing").value);
		}
		else if(selected === "admin-new-team") {
			localStorage.setItem("accounttype", "admin");
			localStorage.setItem("team", document.getElementById("team-new").value);
		}
		else {
			localStorage.setItem("accounttype", "admin");
			localStorage.setItem("team", document.getElementById("team-existing").value);
		}
	}
	window.location = "login.html"
	return false;
} */
