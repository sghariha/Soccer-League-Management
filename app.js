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
			document.getElementById('password').value).then(function(result) {
				var storedEmail = document.getElementById('email').value.replace('.', '').replace('@', '');
				firebase.database().ref('users').update({[storedEmail] : document.getElementById('jointeam').value});
				window.location = "login.html";
			}).catch(function(error) {
  				var errorCode = error.code;
  				var errorMessage = error.message;
  				document.getElementById("warningregister").innerHTML = "Ensure email is valid and if password is at least 6 characters!";
  				return false;
			});
		}
		else {
			document.getElementById("warningregister").innerHTML = "Passwords do not match!";
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
				window.location = "login.html";
			}).catch(function(error) {
  				var errorCode = error.code;
  				var errorMessage = error.message;
  				document.getElementById("warningregister").innerHTML = "Ensure email is valid and if password is at least 6 characters!";
  				return false;
			});
		}
		else {
			document.getElementById("warningregister").innerHTML = "Passwords do not match!";
		}
	}
}

function login() {
	firebase.auth().signInWithEmailAndPassword(document.getElementById('usernamelogin').value, 
	document.getElementById('passwordlogin').value).then(function(result) {
		window.location = "statistics-admin.html";
	}).catch(function(error) {
  		var errorCode = error.code;
  		var errorMessage = error.message;
  		document.getElementById("warninglogin").innerHTML = "Incorrect login!";
  		return false;
	});
}

function displayUser() {
	var user = firebase.auth().currentUser;
	var email;

	if (user != null) {
	  email = user.email;
	  console.log(email);
	}
}