var config = {
    apiKey: "AIzaSyBig_htEJTY6jZ1LpuT6DvXnrqrXaa2heY",
    authDomain: "cse134b-527c4.firebaseapp.com",
    projectId: "cse134b-527c4",
  };
  firebase.initializeApp(config);
  var db = firebase.firestore();

/*
firebase.firestore().enablePersistence()
  .then(function() {
      db = firebase.firestore();

  })
  .catch(function(err) {
      if (err.code == 'failed-precondition') {
          alert("Multiple tabs open!");
      } else if (err.code == 'unimplemented') {
      	  alert("Browser does not support persistence.")
      }
  });*/

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

function loadRegister() {
	document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('new-team-signup').style.display = "none";
    db.collection("teams").get().then(function(querySnapshot) {
	    querySnapshot.forEach(function(doc) {
	    	var x = document.getElementById("jointeam");
			var option = document.createElement("option");
			option.text = querySnapshot.id;
			option.value = querySnapshot.id;
			x.add(option, x[0]);
	    });
	});
	});
}

function registerExisting() {
	if(document.getElementById('username').value && document.getElementById('email').value &&
	document.getElementById('password').value && document.getElementById('confirmpassword').value && 
	document.getElementById('jointeam').value) {
		if(document.getElementById('password').value === document.getElementById('confirmpassword').value) {
			var storedEmail = document.getElementById('email').value.replace('.', '').replace('@', '');
			db.collection("users").get().then(function(querySnapshot) {
			    querySnapshot.forEach(function(doc) {
			        if(doc.id === storedEmail) {
			        	document.getElementById("warningregister").innerHTML = "This email is already being used!";
  						return false;
			        }
			        else {
			        	db.collection('users/' + storedEmail).set({
			        		username: document.getElementById('username').value,
			        		email: document.getElementById('email').value,
			        		password: document.getElementById('password').value,
			        		team: document.getElementById('jointeam').value
			        	});
			        }
			    });
			});
		}
		else {
			document.getElementById("warningregister").innerHTML = "Passwords do not match!";
			return false;
		}
	}
	else {
		document.getElementById("warningregister").innerHTML = "Please fill out all fields!";
		return false;
	}
}

function registerNew() {
	if(document.getElementById('username').value && document.getElementById('email').value &&
	document.getElementById('password').value && document.getElementById('confirmpassword').value && 
	document.getElementById('team-new').value) {
		if(document.getElementById('password').value === document.getElementById('confirmpassword').value) {
			var storedEmail = document.getElementById('email').value.replace('.', '').replace('@', '');
			db.collection("users").get().then(function(querySnapshot) {
			    querySnapshot.forEach(function(doc) {
			        if(doc.id === storedEmail) {
			        	document.getElementById("warningregister").innerHTML = "This email is already being used!";
  						return false;
			        }
			        else {
			        	db.collection('users/' + storedEmail).set({
			        		username: document.getElementById('username').value,
			        		email: document.getElementById('email').value,
			        		password: document.getElementById('password').value,
			        		team: document.getElementById('team-new').value
			        	});
			        }
			    });
			});
		}
		else {
			document.getElementById("warningregister").innerHTML = "Passwords do not match!";
			return false;
		}
	}
	else {
		document.getElementById("warningregister").innerHTML = "Please fill out all fields!";
		return false;
	}
}