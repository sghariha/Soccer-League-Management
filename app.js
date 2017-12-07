// Check if service workers are supported by user's browsers
if ('serviceWorker' in navigator) {
  try {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // Register the service worker passing our service worker code
        navigator.serviceWorker.register('/cse134b-hw5/sw.js').then((registration) => {
          // Registration was successful
          console.log('ServiceWorker registration successful!', registration.scope);
        }, (err) => {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  } catch (e) {
       console.log(e) // Probably want to use some free JS error tracking tool here like Sentry
  }
}

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
var name, email, photoUrl, uid, emailVerified, team;

var db  =firebase.firestore();
/*
firebase.firestore().enablePersistence()
  .then(function() {
      // Initialize Cloud Firestore through firebase
      db = firebase.firestore();
      writeToFirestore();
  })
  .catch(function(err) {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });*/

function writeToFirestore() {
db.collection('users').doc('first').set({
  user: 'three',
  name: 'One'
});
}

/* start of stats javascript */
function loadStats() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      email = user.email;
    } else {
    }


    var teamN = email.replace(/[^a-zA-Z0-9 ]/g,"");
    firebase.database().ref('/users/' + teamN).once('value').then(function(snapshot) {

      team = (snapshot.val()) || 'Anonymous';

      /* Start */
      document.getElementById("set-team").innerHTML = team;
      document.getElementById("set-email").innerHTML = email;

      firebase.database().ref('/teams/'+team+'/teamStats').once('value').then(function(snapshot) {
        document.getElementById('teamwins').innerHTML =snapshot.val().wins;
        document.getElementById('teamlosses').innerHTML=snapshot.val().losses;
        document.getElementById('teamties').innerHTML=snapshot.val().ties;
        document.getElementById('teamgoalsfor').innerHTML=snapshot.val().goalsFor;
        document.getElementById('teamgoalsagainst').innerHTML=snapshot.val().goalsAgainst;
      });

      firebase.database().ref('/teams/'+team+"/schedule").once('value').then(function (snapshot) {

        var eventList = document.getElementById('stats-container');
        var count = 0;

        var weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tues";
        weekday[3] = "Wed";
        weekday[4] = "Thurs";
        weekday[5] = "Fri";
        weekday[6] = "Sat"



        if(localStorage.getItem("eventcount")) {
          count = parseInt(localStorage.getItem("eventcount"), 10);
        }

        var i = 1;
        snapshot.forEach(function(child){

          var key = child.key;
          var value = child.val();

          if(value.eventType !="game") {
            return false;
          }


          var tmpl = document.getElementById('eventrow').content.cloneNode(true);
          var startdate = value.startDate;           // year, month, day
          var arr = startdate.split('-');
          var day = new Date(arr[0], arr[1]-1, arr[2]);
          var c_day = new Date();



          if(c_day.getTime() > day.getTime()){

            day = day.getUTCDay();
            day = weekday[day];

            var startdate = arr[1] + "/" + arr[2];

            tmpl.querySelector('.remove-button').innerHTML = key;
            tmpl.querySelector('.event-date').innerHTML = startdate;
            tmpl.querySelector('.event-day').innerHTML = day;

            var title = "Game: " + value.team;
            tmpl.querySelector('.statname').innerHTML = title;
            tmpl.querySelector('.location').innerHTML = value.location;

            var time = value.startTime;
            var timeArr = time.split(':');

            var apm = timeArr[0] >= 12 ? "pm" : "am";
            var hours = timeArr[0] > 12 ? timeArr[0] - 12 : timeArr[0];

            time = hours+":"+timeArr[1]+apm;

            if(value.endTime) {
              timeArr = value.endTime.split(':');
              apm = timeArr[0] >= 12 ? "pm" : "am";
              hours = timeArr[0] > 12 ? timeArr[0] - 12 : timeArr[0];
              time = time + " - " + hours+":"+timeArr[1]+apm;
            }

            tmpl.querySelector('.time').innerHTML = time;

            if(!value.winLoss) {
              tmpl.querySelector('.editbtn').style.display = 'none';
            }
            else {
              tmpl.querySelector('.addbtn').style.display = 'none';

              if(value.winLoss === "win") {
                tmpl.querySelector('.overallscore').innerHTML = "W: " + value.homeScore+ " - " + value.awayScore;
              }
              else if(value.winLoss === "loss") {
                tmpl.querySelector('.overallscore').innerHTML = "L: " + value.homeScore + " - " + value.awayScore;
              }
              else {
                tmpl.querySelector('.overallscore').innerHTML = "T: " + value.homeScore + " - " + value.awayScore;
              }
            }

            tmpl.querySelector('.sfoul').innerHTML = value.fouls;
            tmpl.querySelector('.scards').innerHTML = value.cards;
            tmpl.querySelector('.ssog').innerHTML = value.shotsOnGoal;
            tmpl.querySelector('.sg').innerHTML = value.goalsMade;
            tmpl.querySelector('.scka').innerHTML = value.cornerKicks;
            tmpl.querySelector('.sgka').innerHTML = value.goalKicks;
            tmpl.querySelector('.spt').innerHTML = value.possensionTime;
            eventList.appendChild(tmpl);
          }
          i++;
        });
      });

      /*end*/
    });



  });
}

function editstats(element) {

  localStorage.setItem("editingstatsfor", element.previousElementSibling.innerHTML);
  window.location = "edit-statistics.html";
  return false;
}

function addstats(element) {
  localStorage.setItem("editingstatsfor", element.previousElementSibling.previousElementSibling.innerHTML);
  window.location = "create-statistics.html";
  return false;
}

$(function() {
  $('#stats-done').click(function() {
    $('.right').addClass('col-10');
    $('.right').removeClass('col-8');

    var elements = document.getElementsByClassName('hidden');
    for(var i=0; i < elements.length; i++) {
      elements[i].style.display = 'none';
    }

    var elements2 = document.getElementsByClassName('visable');
    for(var i=0; i<elements2.length; i++) {
      elements2[i].style.display = 'inline-flex';
    }
    return false;
  })
});

$(function() {
  $('#stats-edit').click(function() {
    $('.right').addClass('col-8');
    $('.right').removeClass('col-10');

    var elements = document.getElementsByClassName('hidden');
    for(var i=0; i < elements.length; i++) {
      elements[i].style.display = 'inline-flex';
    }

    var elements2 = document.getElementsByClassName('visable');
    for(var i=0; i<elements2.length; i++) {
      elements2[i].style.display = 'none';
    }
    return false;
  })
});

// delete
// display stats

function addStats() {
  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      email = user.email;
    } else {
    }


    var teamN = email.replace(/[^a-zA-Z0-9 ]/g,"");
    firebase.database().ref('/users/' + teamN).once('value').then(function(snapshot) {
      team = (snapshot.val()) || 'Anonymous';

      if(document.getElementById("winorloss").value && document.getElementById("homescore").value &&
      document.getElementById("awayscore").value && document.getElementById("fouls").value &&
      document.getElementById("cards").value && document.getElementById("shotsongoal").value &&
      document.getElementById("goalsmade").value && document.getElementById("cornerkicks").value &&
      document.getElementById("goalkicks").value && document.getElementById("posstime").value) {

        firebase.database().ref('/teams/'+team+'/teamStats').once('value').then(function(snapshot) {
          var teamwins = parseInt(snapshot.val().wins, 10);
          var teamlosses = parseInt(snapshot.val().losses, 10);
          var teamties = parseInt(snapshot.val().ties, 10);
          var teamgoalsfor = parseInt(snapshot.val().goalsFor, 10);
          var teamgoalsagainst = parseInt(snapshot.val().goalsAgainst, 10);

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


          var postData = {
            wins: teamwins,
            losses: teamlosses,
            ties: teamties,
            goalsFor: teamgoalsfor,
            goalsAgainst: teamgoalsagainst
          };
          var updates = {};
          updates['/teams/'+team+'/teamStats/'] = postData;
          firebase.database().ref().update(updates);

          gamenum = localStorage.getItem("editingstatsfor").toString();

          firebase.database().ref('/teams/'+team+'/schedule/'+gamenum).once('value').then(function(snapshot){
            var updateData = {
              eventType: snapshot.val().eventType,
              location: snapshot.val().location,
              startDate: snapshot.val().startDate,
              startTime: snapshot.val().startTime,
              team: snapshot.val().team,
              winLoss: document.getElementById("winorloss").value,
              homeScore: document.getElementById("homescore").value,
              awayScore: document.getElementById("awayscore").value,
              fouls: document.getElementById("fouls").value,
              cards: document.getElementById("cards").value,
              shotsOnGoal: document.getElementById("shotsongoal").value,
              goalsMade: document.getElementById("goalsmade").value,
              cornerKicks: document.getElementById("cornerkicks").value,
              goalKicks: document.getElementById("goalkicks").value,
              possensionTime: document.getElementById("posstime").value
            };

            if(snapshot.val().notes){
              updateData['notes'] = snapshot.val().notes;
            }

            if(snapshot.val().endDate) {
              updateData['endDate'] =snapshot.val().endDate;
            }

            if(snapshot.val().endTime) {
              updateData['endTime'] = snapshot.val().endTime;
            }


            var update =  {};
            update['/teams/'+team+'/schedule/'+gamenum] = updateData;
            firebase.database().ref().update(update);
            window.location = "statistics-admin.html";
          });
        });
      }
    });
  });
}

function loadEditStats() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      email = user.email;
    } else {
    }


    var teamN = email.replace(/[^a-zA-Z0-9 ]/g,"");
    firebase.database().ref('/users/' + teamN).once('value').then(function(snapshot) {
      team = (snapshot.val()) || 'Anonymous';

      var eventName = localStorage.getItem("editingstatsfor");

      firebase.database().ref('/teams/'+team+'/schedule/'+eventName).once('value').then(function(snapshot){

        document.getElementById("winorloss").value = snapshot.val().winLoss;
        document.getElementById("homescore").value = snapshot.val().homeScore;
        document.getElementById("awayscore").value = snapshot.val().awayScore;
        document.getElementById("fouls").value = snapshot.val().fouls;
        document.getElementById("cards").value = snapshot.val().cards;
        document.getElementById("shotsongoal").value = snapshot.val().shotsOnGoal;
        document.getElementById("goalsmade").value = snapshot.val().goalsMade;
        document.getElementById("cornerkicks").value = snapshot.val().cornerKicks;
        document.getElementById("goalkicks").value = snapshot.val().goalKicks;
        document.getElementById("posstime").value = snapshot.val().possensionTime;

      });
    });
  });
}

function editStats() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      email = user.email;
    } else {
    }
    var teamN = email.replace(/[^a-zA-Z0-9 ]/g,"");
    firebase.database().ref('/users/' + teamN).once('value').then(function(snapshot) {
      team = (snapshot.val()) || 'Anonymous';

      if(document.getElementById("winorloss").value && document.getElementById("homescore").value &&
      document.getElementById("awayscore").value && document.getElementById("fouls").value &&
      document.getElementById("cards").value && document.getElementById("shotsongoal").value &&
      document.getElementById("goalsmade").value && document.getElementById("cornerkicks").value &&
      document.getElementById("goalkicks").value && document.getElementById("posstime").value) {
        firebase.database().ref('/teams/'+team+'/teamStats').once('value').then(function(teamStats) {
          var eventName = localStorage.getItem("editingstatsfor");
          firebase.database().ref('/teams/'+team+'/schedule/'+eventName).once('value').then(function(gameInfo){

            var teamLosses = teamStats.val().losses;
            var teamTies = teamStats.val().ties;
            var teamWins = teamStats.val().wins;
            var teamGoalsFor = teamStats.val().goalsFor;
            var teamGoalsAgainst = teamStats.val().goalsAgainst;

            if(gameInfo.val().winLoss != document.getElementById("winorloss").value) {
              if(gameInfo.val().winLoss=="win") {
                teamWins = teamWins -1;
              }
              else if(gameInfo.val().winLoss=="loss") {
                teamLosses = teamLosses - 1;
              }
              else if(gameInfo.val().winLoss =="tie") {
                teamTies = teamTies - 1;
              }

              if(document.getElementById("winorloss").value =="win") {
                teamWins +=1;
              }
              else if(document.getElementById("winorloss").value =="loss") {
                teamLosses +=1;
              }
              else if(document.getElementById("winorloss").value =="tie") {
                teamTies +=1;
              }
            }

            teamGoalsFor = teamGoalsFor + (document.getElementById("homescore").value-gameInfo.val().homeScore);
            teamGoalsAgainst = teamGoalsAgainst + (document.getElementById("awayscore").value-gameInfo.val().awayScore);

            var editTeamStatsData = {
              goalsAgainst: teamGoalsAgainst,
              goalsFor: teamGoalsFor,
              losses: teamLosses,
              ties: teamTies,
              wins: teamWins
            };

            var editTeamStatsUpdates = {};
            editTeamStatsUpdates['/teams/' + team + '/teamStats/'] = editTeamStatsData;
            firebase.database().ref().update(editTeamStatsUpdates);
            /* Updated team stats ^ */


            var editStatsData = {
              eventType: gameInfo.val().eventType,
              location: gameInfo.val().location,
              startTime: gameInfo.val().startTime,
              startDate: gameInfo.val().startDate,
              team: gameInfo.val().team,
              winLoss: document.getElementById("winorloss").value,
              homeScore: document.getElementById("homescore").value,
              awayScore: document.getElementById("awayscore").value,
              fouls: document.getElementById("fouls").value,
              cards: document.getElementById("cards").value,
              shotsOnGoal: document.getElementById("shotsongoal").value,
              goalsMade: document.getElementById("goalsmade").value, cornerKicks: document.getElementById("cornerkicks").value,
              goalKicks: document.getElementById("goalkicks").value, possensionTime: document.getElementById("posstime").value
            };

            if(gameInfo.val().notes) {
              editStatsData["notes"] = gameInfo.val().notes;
            }

            if(gameInfo.val().endTime) {
              editStatsData["endTime"] = gameInfo.val().endTime;
            }

            if(gameInfo.val().endDate) {
              editStatsData["endDate"] = gameInfo.val().endDate;
            }

            var editStatsUpdates = {};

            editStatsUpdates['/teams/'+team+'/schedule/'+eventName] = editStatsData;

            firebase.database().ref().update(editStatsUpdates);
            window.location = "statistics-admin.html";
          });
        });
        /* end of this */
      }
    });
  });
}

    /* end of stats js */





    function loginFire() {
      var inputEmail = document.getElementById("username").value;
      var password = document.getElementById("password").value;

      /* Signs us in if correct email and password */
      firebase.auth().signInWithEmailAndPassword(inputEmail, password).then(function(result) {
        window.location = "statistics-admin.html";
      }).catch(function(error) {
        /* Warns that email and password don't match */
        document.getElementById("loginform").reset();
        document.getElementById("warning").innerHTML = "Incorrect login. Please try again.";
        var errorCode = error.code;
        var errorMessage = error.message;
      });
    }



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
