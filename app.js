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

function loadRegister() {
	document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('new-team-signup').style.display = "none";
    var team = [];
    var query = database.ref("teams").orderByKey();
	query.once("value")
	.then(function(snapshot) {
    	snapshot.forEach(function(childSnapshot) {
      		team.push(childSnapshot.key);
      		var x = document.getElementById("jointeam");
			var option = document.createElement("option");
			option.text = childSnapshot.key;
			option.value = childSnapshot.key;
			x.add(option, x[0]);
  		});
	});
});
}

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
	}
}

function addPlayer() {
	if(document.getElementById("firstname").value && document.getElementById("lastname").value && 
	document.getElementById("feet").value && document.getElementById("inches").value && 
	document.getElementById("weight").value) {
		var email;
	    firebase.auth().onAuthStateChanged(function(user) {
	    	if (user) {
	      		email = user.email.replace('.', '').replace('@', '');
	      		return firebase.database().ref('users/' + email).once('value').then(function(snapshot) {
  					var team = snapshot.val();
  					var pf = 0;
  					var rc = 0;
  					var yc = 0;
  					var sog = 0;
  					var g = 0;
  					var cka = 0;
  					var gka = 0;
  					var pka = 0;
  					var ti = 0;
  					var app = 0;
  					if(document.getElementById("playerfoul").value) {
  						pf = document.getElementById("playerfoul").value;
  					}
  					if(document.getElementById("playerrc").value) {
  						rc = document.getElementById("playerrc").value;
  					}
  					if(document.getElementById("playeryc").value) {
  						yc = document.getElementById("playeryc").value;
  					}
  					if(document.getElementById("playersog").value) {
  						sog = document.getElementById("playersog").value;
  					}
  					if(document.getElementById("playerg").value) {
  						g = document.getElementById("playerg").value;
  					}
  					if(document.getElementById("playercka").value) {
  						cka = document.getElementById("playercka").value;
  					}
  					if(document.getElementById("playergka").value) {
  						gka = document.getElementById("playergka").value;
  					}
  					if(document.getElementById("playerpka").value) {
  						pka = document.getElementById("playergka").value;
  					}
  					if(document.getElementById("playerti").value) {
  						ti = document.getElementById("playerti").value;
  					}
  					if(document.getElementById("playerapp").value) {
  						app = document.getElementById("playerapp").value;
  					}
  					firebase.database().ref('teams/' + team + '/roster/' + document.getElementById('firstname').value + 
  						document.getElementById('lastname').value).update({
  						position : document.getElementById('position').value,
  						status : document.getElementById('status').value,
  						firstName : document.getElementById('firstname').value,
  						lastName : document.getElementById('lastname').value,
  						feet : document.getElementById("feet").value,
  						inches : document.getElementById("inches").value,
  						weight: document.getElementById("weight").value,
  						playerFouls : pf,
  						redCards : rc,
  						yellowCards : yc,
  						shotsOnGoal : sog,
  						goals : g,
  						cornerKickAttempts : cka,
  						goalKickAttempts : gka,
  						penaltyKickAttempts : pka,
  						throwIns : ti,
  						appearances : app
  					});
  					window.location = "roster-admin.html";
				});
	    	} 
	  	});
	}
	else {
		document.getElementById("warning").innerHTML = "Please fill out all player vitals!";
		return false;
	}
}

function loadEditPlayer() {
	var edit = sessionStorage.getItem("edit");
	var email;
    firebase.auth().onAuthStateChanged(function(user) {
    	if (user) {
      		email = user.email.replace('.', '').replace('@', '');
      		return firebase.database().ref('users/' + email).once('value').then(function(snapshot) {
				var team = snapshot.val();
			    var query = database.ref('teams/' + team + '/roster').orderByKey();
			    var counter = 0;
				query.once("value")
				.then(function(snapshot) {
			    	snapshot.forEach(function(childSnapshot) {
			    		if(childSnapshot.key === edit) {
			    			document.getElementById("firstname").value = childSnapshot.child("firstName").val();
			    			document.getElementById("lastname").value = childSnapshot.child("lastName").val();
			    			document.getElementById("position").value = childSnapshot.child("position").val();
			    			document.getElementById("status").value = childSnapshot.child("status").val();
			    			document.getElementById("feet").value = childSnapshot.child("feet").val();
			    			document.getElementById("inches").value = childSnapshot.child("inches").val();
			    			document.getElementById("weight").value = childSnapshot.child("weight").val();
			    			document.getElementById("firstname").value = childSnapshot.child("firstName").val();

			    			document.getElementById("playerfoul").value = childSnapshot.child("playerFouls").val();
			    			document.getElementById("playerrc").value = childSnapshot.child("redCards").val();
			    			document.getElementById("playeryc").value = childSnapshot.child("yellowCards").val();
			    			document.getElementById("playersog").value = childSnapshot.child("shotsOnGoal").val();
			    			document.getElementById("playerg").value = childSnapshot.child("goals").val();
			    			document.getElementById("playercka").value = childSnapshot.child("cornerKickAttempts").val();
			    			document.getElementById("playergka").value = childSnapshot.child("goalKickAttempts").val();
			    			document.getElementById("playerpka").value = childSnapshot.child("penaltyKickAttempts").val();
			    			document.getElementById("playerti").value = childSnapshot.child("throwIns").val();
			    			document.getElementById("playerapp").value = childSnapshot.child("appearances").val();
			    		}
			    	});
			    });
			});
		}
	});
}

function editPlayer() {
if(document.getElementById("firstname").value && document.getElementById("lastname").value && 
	document.getElementById("feet").value && document.getElementById("inches").value && 
	document.getElementById("weight").value) {
		var email;
	    firebase.auth().onAuthStateChanged(function(user) {
	    	if (user) {
	      		email = user.email.replace('.', '').replace('@', '');
	      		return firebase.database().ref('users/' + email).once('value').then(function(snapshot) {
  					var team = snapshot.val();
  					var pf = 0;
  					var rc = 0;
  					var yc = 0;
  					var sog = 0;
  					var g = 0;
  					var cka = 0;
  					var gka = 0;
  					var pka = 0;
  					var ti = 0;
  					var app = 0;
  					var key = sessionStorage.getItem("edit");
					if(document.getElementById("firstname").value + document.getElementById("lastname").value !== 
					key) {
						firebase.database().ref('teams/' + team + '/roster/' + key).remove();
					}
  					if(document.getElementById("playerfoul").value) {
  						pf = document.getElementById("playerfoul").value;
  					}
  					if(document.getElementById("playerrc").value) {
  						rc = document.getElementById("playerrc").value;
  					}
  					if(document.getElementById("playeryc").value) {
  						yc = document.getElementById("playeryc").value;
  					}
  					if(document.getElementById("playersog").value) {
  						sog = document.getElementById("playersog").value;
  					}
  					if(document.getElementById("playerg").value) {
  						g = document.getElementById("playerg").value;
  					}
  					if(document.getElementById("playercka").value) {
  						cka = document.getElementById("playercka").value;
  					}
  					if(document.getElementById("playergka").value) {
  						gka = document.getElementById("playergka").value;
  					}
  					if(document.getElementById("playerpka").value) {
  						pka = document.getElementById("playergka").value;
  					}
  					if(document.getElementById("playerti").value) {
  						ti = document.getElementById("playerti").value;
  					}
  					if(document.getElementById("playerapp").value) {
  						app = document.getElementById("playerapp").value;
  					}
  					firebase.database().ref('teams/' + team + '/roster/' + document.getElementById('firstname').value + 
  						document.getElementById('lastname').value).update({
  						position : document.getElementById('position').value,
  						status : document.getElementById('status').value,
  						firstName : document.getElementById('firstname').value,
  						lastName : document.getElementById('lastname').value,
  						feet : document.getElementById("feet").value,
  						inches : document.getElementById("inches").value,
  						weight: document.getElementById("weight").value,
  						playerFouls : pf,
  						redCards : rc,
  						yellowCards : yc,
  						shotsOnGoal : sog,
  						goals : g,
  						cornerKickAttempts : cka,
  						goalKickAttempts : gka,
  						penaltyKickAttempts : pka,
  						throwIns : ti,
  						appearances : app
  					});
  					window.location = "roster-admin.html";
				});
	    	} 
	  	});
	}
	else {
		document.getElementById("warning").innerHTML = "Please fill out all player vitals!";
		return false;
	}
}

function loadRoster() {
	var email;
    firebase.auth().onAuthStateChanged(function(user) {
    	if (user) {
      		email = user.email.replace('.', '').replace('@', '');
      		return firebase.database().ref('users/' + email).once('value').then(function(snapshot) {
				var team = snapshot.val();
			    var query = database.ref('teams/' + team + '/roster').orderByKey();
			    var counter = 0;
				query.once("value")
				.then(function(snapshot) {
			    	snapshot.forEach(function(childSnapshot) {
			    		var tmpl = document.getElementById('playerrow0');
			    		if(counter === 0) {
			    			tmpl.querySelector('.playername').innerHTML = childSnapshot.child('firstName').val() + " " +
				    		childSnapshot.child('lastName').val();
							tmpl.querySelector('.playerposition').innerHTML = childSnapshot.child('position').val();
							tmpl.querySelector('.playerheight').innerHTML = childSnapshot.child('feet').val() + " " + childSnapshot.child('inches').val();
							tmpl.querySelector('.playerweight').innerHTML = childSnapshot.child('weight').val();
							tmpl.querySelector('.pfoul').innerHTML = childSnapshot.child('playerFouls').val();
							tmpl.querySelector('.prc').innerHTML = childSnapshot.child('redCards').val();
							tmpl.querySelector('.pyc').innerHTML = childSnapshot.child('yellowCards').val();
							tmpl.querySelector('.psog').innerHTML = childSnapshot.child('shotsOnGoal').val();
							tmpl.querySelector('.pg').innerHTML = childSnapshot.child('goals').val();
							tmpl.querySelector('.pcka').innerHTML = childSnapshot.child('cornerKickAttempts').val();
							tmpl.querySelector('.pgka').innerHTML = childSnapshot.child('goalKickAttempts').val();
							tmpl.querySelector('.ppka').innerHTML = childSnapshot.child('penaltyKickAttempts').val();
							tmpl.querySelector('.pti').innerHTML = childSnapshot.child('throwIns').val();
							tmpl.querySelector('.papp').innerHTML = childSnapshot.child('appearances').val();
							tmpl.querySelector('.editplayer').name = counter.toString();
							tmpl.querySelector('.deleteplayer').name = counter.toString();
							tmpl.querySelector('.playername').name = counter.toString();
						}
						else {
							var clone = tmpl.cloneNode(true);
							clone.id = "playerrow" + counter.toString();
							clone.querySelector('.playername').innerHTML = childSnapshot.child('firstName').val() + " " +
				    		childSnapshot.child('lastName').val();
							clone.querySelector('.playerposition').innerHTML = childSnapshot.child('position').val();
							clone.querySelector('.playerheight').innerHTML = childSnapshot.child('feet').val() + " " + childSnapshot.child('inches').val();
							clone.querySelector('.playerweight').innerHTML = childSnapshot.child('weight').val();
							clone.querySelector('.pfoul').innerHTML = childSnapshot.child('playerFouls').val();
							clone.querySelector('.prc').innerHTML = childSnapshot.child('redCards').val();
							clone.querySelector('.pyc').innerHTML = childSnapshot.child('yellowCards').val();
							clone.querySelector('.psog').innerHTML = childSnapshot.child('shotsOnGoal').val();
							clone.querySelector('.pg').innerHTML = childSnapshot.child('goals').val();
							clone.querySelector('.pcka').innerHTML = childSnapshot.child('cornerKickAttempts').val();
							clone.querySelector('.pgka').innerHTML = childSnapshot.child('goalKickAttempts').val();
							clone.querySelector('.ppka').innerHTML = childSnapshot.child('penaltyKickAttempts').val();
							clone.querySelector('.pti').innerHTML = childSnapshot.child('throwIns').val();
							clone.querySelector('.papp').innerHTML = childSnapshot.child('appearances').val();
							clone.querySelector('.editplayer').name = counter.toString();
							clone.querySelector('.deleteplayer').name = counter.toString();
							clone.querySelector('.playername').name = counter.toString();
							tmpl.parentNode.appendChild(clone);
						}
						counter = counter + 1;

			  		});
				});
			});
		}
	});
}

function displayEdit(element) {
  	var email;
  	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
	  		email = user.email.replace('.', '').replace('@', '');
	  		return firebase.database().ref('users/' + email).once('value').then(function(snapshot) {
				var team = snapshot.val();
			    var query = database.ref('teams/' + team + '/roster').orderByKey();
			    var counter = 0;
				query.once("value")
				.then(function(snapshot) {
			    	snapshot.forEach(function(childSnapshot) {
			    		if(counter === parseInt(element.getAttribute("name"))) {
			    			sessionStorage.setItem("edit", childSnapshot.key);
			    			window.location = "edit-player.html";
			    			return false;
			    		}
			    		counter = counter + 1;
			    	});
			    });
			});
		}
   	});
}

function addToRoster() {
	window.location = "create-player.html";
  	return false;
}

function deletePlayer(element) {
	var email;
  	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
	  		email = user.email.replace('.', '').replace('@', '');
	  		return firebase.database().ref('users/' + email).once('value').then(function(snapshot) {
				var team = snapshot.val();
			    var query = database.ref('teams/' + team + '/roster').orderByKey();
			    var counter = 0;
				query.once("value")
				.then(function(snapshot) {
			    	snapshot.forEach(function(childSnapshot) {
			    		if(counter === parseInt(element.getAttribute("name"))) {
			    			database.ref('teams/' + team + '/roster/' + childSnapshot.key).remove();
			    			location.reload();
			    			return false;
			    		}
			    		counter = counter + 1;
			    	});
			    });
			});
		}
   	});
}

function displayProfile(element) {
	var num = element.name;
	var display = document.getElementById('playerrow' + num.toString());
	if(!display.querySelector('.playerprofile').style.display) {
		display.querySelector('.playerprofile').style.display = 'block';
	}
	else {
		display.querySelector('.playerprofile').style.display = '';
	}
}