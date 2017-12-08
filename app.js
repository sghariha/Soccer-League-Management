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
var db = firebase.firestore();

//var database = firebase.database();
//var name, email, photoUrl, uid, emailVerified, team;
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
  user: 'fourrrr',
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


//FUNCTIONS FOR REGISTER USER

function loadRegister() {
	document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('new-team-signup').style.display = "none";
    db.collection("teams").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          var x = document.getElementById("jointeam");
          var option = document.createElement("option");
          option.text = doc.id;
          option.value = doc.id;
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
        db.collection('users').doc(storedEmail).set({
          team: document.getElementById('jointeam').value,
          email: storedEmail
        }).then(function(result) {
          window.location = "login.html";
        });
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        document.getElementById("warningregister").innerHTML = "Ensure email is valid and if password is at least 6 characters!";
        return false;
      });
    }
    else {
      document.getElementById("warningregister").innerHTML = "Passwords do not match!";
      return false;
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
        db.collection('users').doc(storedEmail).set({
          team: document.getElementById('team-new').value
        }).then(function(result) {
          db.collection('teams').doc(document.getElementById('team-new').value).set({
            team: document.getElementById('team-new').value
          }).then(function(result) {
            window.location = "login.html";
          });
        });
			}).catch(function(error) {
  				var errorCode = error.code;
  				var errorMessage = error.message;
  				document.getElementById("warningregister").innerHTML = "Ensure email is valid and if password is at least 6 characters!";
  				return false;
			});
		}
		else {
			document.getElementById("warningregister").innerHTML = "Passwords do not match!";
      return false;
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

//FUNCTIONS FOR ROSTER

function addPlayer() {
	if(document.getElementById("firstname").value && document.getElementById("lastname").value &&
	document.getElementById("feet").value && document.getElementById("inches").value &&
	document.getElementById("weight").value) {
		var email;
    firebase.auth().onAuthStateChanged(function(user) {
    	if(user) {
    		email = user.email.replace('.', '').replace('@', '');

        db.collection("users").get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if(doc.id === email) {
              var team = doc.data().team;
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
              db.collection('teams').doc(team).collection('roster').doc(document.getElementById('firstname').value +
              document.getElementById('lastname').value).set({
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
              }).then(function(result) {
                window.location = "roster-admin.html";
              });
            }
          });
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
	var edit = localStorage.getItem("editPlayer");
	var email;
  firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      email = user.email.replace('.', '').replace('@', '');
      db.collection("users").where("email", "==", email).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          var team = doc.data().team;
          db.collection("teams").doc(team).collection('roster').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              console.log(localStorage.getItem("editPlayer"));
              if(doc.id === localStorage.getItem("editPlayer")) {
                document.getElementById("firstname").value = doc.data().firstName;
                document.getElementById("lastname").value = doc.data().lastName;
                document.getElementById("position").value = doc.data().position;
                document.getElementById("status").value = doc.data().status;
                document.getElementById("feet").value = doc.data().feet;
                document.getElementById("inches").value = doc.data().inches;
                document.getElementById("weight").value = doc.data().weight;

                document.getElementById("playerfoul").value = doc.data().playerFouls;
                document.getElementById("playerrc").value = doc.data().redCards;
                document.getElementById("playeryc").value = doc.data().yellowCards;
                document.getElementById("playersog").value = doc.data().shotsOnGoal;
                document.getElementById("playerg").value = doc.data().goals;
                document.getElementById("playercka").value = doc.data().cornerKickAttempts;
                document.getElementById("playergka").value = doc.data().goalKickAttempts;
                document.getElementById("playerpka").value = doc.data().penaltyKickAttempts;
                document.getElementById("playerti").value = doc.data().throwIns;
                document.getElementById("playerapp").value = doc.data().appearances;
              }
            });
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
      if(user) {
        email = user.email.replace('.', '').replace('@', '');

        db.collection("users").get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if(doc.id === email) {
              var team = doc.data().team;
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
              if(localStorage.getItem("editPlayer") !== document.getElementById("firstname").value + 
              document.getElementById("lastname").value) {
                db.collection("teams").doc(team).collection("roster").doc(localStorage.getItem("editPlayer")).delete().then(function() {
                  console.log("Document successfully deleted!");
                }).catch(function(error) {
                  console.error("Error removing document: ", error);
                });
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
              db.collection('teams').doc(team).collection('roster').doc(document.getElementById('firstname').value +
              document.getElementById('lastname').value).set({
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
              }).then(function(result) {
                window.location = "roster-admin.html";
                return false;
              });
            }
          });
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
  firebase.auth().onAuthStateChanged(function(user) {
  	if(user) {
      var email = user.email.replace('.', '').replace('@', '');
      db.collection("users").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(dc) {
          if(dc.id === email) {
            var team = dc.data().team;
            var counter = 0;
            document.getElementById('playerrow0').style.display = 'none';
            db.collection("teams").doc(team).collection('roster').get().then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                var clone = document.getElementById('playerrow0').cloneNode(true);
                clone.querySelector('.playername').innerHTML = doc.data().firstName + " " +
                doc.data().lastName;
                clone.id = doc.data().firstName + doc.data().lastName;
                clone.querySelector('.playerposition').innerHTML = doc.data().position;
                clone.querySelector('.playerheight').innerHTML = doc.data().feet + "' " + doc.data().inches + "\"";
                clone.querySelector('.playerweight').innerHTML = doc.data().weight + " lbs";
                clone.querySelector('.pfoul').innerHTML = doc.data().playerFouls;
                clone.querySelector('.prc').innerHTML = doc.data().redCards;
                clone.querySelector('.pyc').innerHTML = doc.data().yellowCards;
                clone.querySelector('.psog').innerHTML = doc.data().shotsOnGoal;
                clone.querySelector('.pg').innerHTML = doc.data().goals;
                clone.querySelector('.pcka').innerHTML = doc.data().cornerKickAttempts;
                clone.querySelector('.pgka').innerHTML = doc.data().goalKickAttempts;
                clone.querySelector('.ppka').innerHTML = doc.data().penaltyKickAttempts;
                clone.querySelector('.pti').innerHTML = doc.data().throwIns;
                clone.querySelector('.papp').innerHTML = doc.data().appearances;
                clone.querySelector('.editplayer').name = doc.data().firstName + doc.data().lastName;
                clone.querySelector('.deleteplayer').name = doc.data().firstName + doc.data().lastName;
                clone.querySelector('.playername').name = doc.data().firstName + doc.data().lastName;
                document.getElementById('cont').appendChild(clone);
                document.getElementById(doc.data().firstName + doc.data().lastName).style.display = 'block';
              });
            });
          }
        });
      });
    }
  });
}

function displayEdit(element) {
	var edit = element.name;
  localStorage.setItem("editPlayer", edit);
  window.location = "edit-player.html";
  return false;
}

function addToRoster() {
	window.location = "create-player.html";
  	return false;
}

function deletePlayer(element) {
	var email;
	firebase.auth().onAuthStateChanged(function(user) {
  	if(user) {
      email = user.email.replace('.', '').replace('@', '');
      db.collection("users").where("email", "==", email).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          var team = doc.data().team;
          db.collection("teams").doc(team).collection("roster").doc(element.name).delete().then(function() {
            console.log("Document successfully deleted!");
            location.reload();
            return false;
          }).catch(function(error) {
            console.error("Error removing document: ", error);
          });
        });
      });
    }
  });
}

function displayProfile(element) {
	var num = element.name;
  console.log(num);
	var display = document.getElementById(num);
	if(!display.querySelector('.playerprofile').style.display) {
		display.querySelector('.playerprofile').style.display = 'block';
	}
	else {
		display.querySelector('.playerprofile').style.display = '';
	}
}

//FUNCTIONS FOR SCHEDULE 

function loadCreateSchedule() {
  document.getElementById('practice-other-form').style.display = 'none';
}

function showGameFields() {
  if(document.getElementById('nav_create_game').classList.contains('active')) {
    return false;
  }
  else if(document.getElementById('nav_create_practice').classList.contains('active')) {
    document.getElementById('nav_create_game').classList.add('active');
    document.getElementById('nav_create_practice').classList.remove('active');
    document.getElementById('practice-other-form').style.display = 'none';
    document.getElementById('game-create-form').style.display = 'block';
  }
  else {
    document.getElementById('nav_create_game').classList.add('active');
    document.getElementById('nav_create_other').classList.remove('active');
    document.getElementById('practice-other-form').style.display = 'none';
    document.getElementById('game-create-form').style.display = 'block';
  }
}

function showPracticeFields() {
  if(document.getElementById('nav_create_game').classList.contains('active')) {
    document.getElementById('nav_create_practice').classList.add('active');
    document.getElementById('nav_create_game').classList.remove('active');
    document.getElementById('practice-other-form').style.display = 'block';
    document.getElementById('game-create-form').style.display = 'none';
  }
  else if(document.getElementById('nav_create_practice').classList.contains('active')) {
    return false;
  }
  else {
    document.getElementById('nav_create_practice').classList.add('active');
    document.getElementById('nav_create_other').classList.remove('active');
  }
}

function showOtherFields() {
  if(document.getElementById('nav_create_game').classList.contains('active')) {
    document.getElementById('nav_create_other').classList.add('active');
    document.getElementById('nav_create_game').classList.remove('active');
    document.getElementById('practice-other-form').style.display = 'block';
    document.getElementById('game-create-form').style.display = 'none';
  }
  else if(document.getElementById('nav_create_practice').classList.contains('active')) {
    document.getElementById('nav_create_other').classList.add('active');
    document.getElementById('nav_create_practice').classList.remove('active');
  }
  else {
    return false;
  }
}

function createGame() {
  if(document.getElementById('opponent').value && document.getElementById('location').value && 
  document.getElementById('start-date').value && document.getElementById('start-time').value) {
    var email;
    firebase.auth().onAuthStateChanged(function(user) {
      if(user) {
        email = user.email.replace('.', '').replace('@', '');
        db.collection("users").where("email", "==", email).get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var team = doc.data().team;
            db.collection("teams").doc(team).collection("events").doc(document.getElementById('start-date').value + 
            " " + document.getElementById('opponent').value).set({
              title: document.getElementById('opponent').value,
              location: document.getElementById('location').value, 
              startDate: document.getElementById('start-date').value,
              startTime: document.getElementById('start-time').value,
              type: 'game'
            }).then(function(result) {
              window.location = "schedule-admin.html";
              return false;
            });                
          });
        });
      }
    });
  }
  else {
    document.getElementById("warning").innerHTML = "Please fill out all event information!";
    return false;
  }
}

function createOther() {
  if(document.getElementById('title').value && document.getElementById('location-prac').value && 
  document.getElementById('start-date-prac').value && document.getElementById('start-time-prac').value) {
    var email;
    firebase.auth().onAuthStateChanged(function(user) {
      if(user) {
        email = user.email.replace('.', '').replace('@', '');
        db.collection("users").where("email", "==", email).get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var team = doc.data().team;
            var type = 'practice';
            if(document.getElementById('nav_create_other').classList.contains('active')) {
              type = 'other';
            }
            db.collection("teams").doc(team).collection("events").doc(document.getElementById('start-date-prac').value + 
            " " + document.getElementById('title').value).set({
              title: document.getElementById('title').value,
              location: document.getElementById('location-prac').value, 
              startDate: document.getElementById('start-date-prac').value,
              startTime: document.getElementById('start-time-prac').value,
              type: type
            }).then(function(result) {
              window.location = "schedule-admin.html";
              return false;
            });                
          });
        });
      }
    });
  }
  else {
    document.getElementById("warning").innerHTML = "Please fill out all event information!";
    return false;
  }
}

function loadSchedule() {
  var eventList = document.getElementById('cont');
  var count = 0;
  var weekday = new Array(7);

  weekday[0] = "Sun";
  weekday[1] = "Mon";
  weekday[2] = "Tues";
  weekday[3] = "Wed";
  weekday[4] = "Thurs";
  weekday[5] = "Fri";
  weekday[6] = "Sat";

  firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      var email = user.email.replace('.', '').replace('@', '');
      db.collection("users").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(dc) {
          if(dc.id === email) {
            var team = dc.data().team;
            var counter = 0;
            document.getElementById('eventrow0').style.display = 'none';
            db.collection("teams").doc(team).collection('events').get().then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                var clone = document.getElementById('eventrow0').cloneNode(true);
                var startdate = doc.data().startDate.toString();
                var arr = startdate.split('-');             // year, month, day
                console.log(arr[0]+" - "+arr[1]+" - "+arr[2]);
                var day = new Date(arr[0], arr[1]-1, arr[2]);
                var c_day = new Date();
                if(c_day.getTime() <= day.getTime()){
                  if(doc.data().type === 'game') {
                    clone.querySelector('.eventtitle').innerHTML = 'Game: ' + doc.data().title;
                  }
                  else {
                    clone.querySelector('.eventtitle').innerHTML = 'Event: ' + doc.data().title;
                  }
                  clone.id = doc.id;
                  clone.querySelector('.eventlocation').innerHTML = 'Location: ' + doc.data().location;
                  clone.querySelector('.eventstartdate').innerHTML = 'Date: ' + doc.data().startDate;
                  clone.querySelector('.eventstarttime').innerHTML = 'Time: ' + doc.data().startTime;
                  clone.querySelector('.editevent').name = doc.id;
                  clone.querySelector('.deleteevent').name = doc.id;
                  document.getElementById('cont').appendChild(clone);
                  document.getElementById(doc.id).style.display = 'block';
                }
              });
            });
          }

        });
      });
    }
  });
}

function addToSchedule() {
  window.location = "create-event.html";
  return false;
}

function displayEditEvent(element) {
  localStorage.setItem('editEvent', element.name);
  window.location = "edit-event.html";
  return false;
}

function loadEditSchedule() {
  firebase.auth().onAuthStateChanged(function(user) {
  if(user) {
    console.log("hello");
    var email = user.email.replace('.', '').replace('@', '');
    db.collection("users").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(dc) {
        console.log(dc.id);
        if(dc.id === email) {
          var team = dc.data().team;
          db.collection('teams').doc(team).collection('events').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              if(doc.id === localStorage.getItem('editEvent')) {
                console.log(doc.data().type)
                if(doc.data().type === 'game') {
                  document.getElementById('practice-other-form').style.display = 'none';
                  document.getElementById('opponent').value = doc.data().title;
                  document.getElementById('location').value = doc.data().location;
                  document.getElementById('start-date').value = doc.data().startDate;
                  document.getElementById('start-time').value = doc.data().startTime;
                }
                else if(doc.data().type === 'practice') {
                  document.getElementById('game-create-form').style.display = 'none';
                  document.getElementById('nav_create_practice').classList.add('active');
                  document.getElementById('nav_create_game').classList.remove('active');
                  document.getElementById('title').value = doc.data().title;
                  document.getElementById('location-prac').value = doc.data().location;
                  document.getElementById('start-date-prac').value = doc.data().startDate;
                  document.getElementById('start-time-prac').value = doc.data().startTime;
                }
                else {
                  document.getElementById('game-create-form').style.display = 'none';
                  document.getElementById('nav_create_other').classList.add('active');
                  document.getElementById('nav_create_game').classList.remove('active');
                  document.getElementById('title').value = doc.data().title;
                  document.getElementById('location-prac').value = doc.data().location;
                  document.getElementById('start-date-prac').value = doc.data().startDate;
                  document.getElementById('start-time-prac').value = doc.data().startTime;
                }
              }
            });
          });
        }
      });
    });
  }
  });
}

function editGame() {
  if(document.getElementById('opponent').value && document.getElementById('location').value && 
  document.getElementById('start-date').value && document.getElementById('start-time').value) {
    var email;

    firebase.auth().onAuthStateChanged(function(user) {
      if(user) {
        email = user.email.replace('.', '').replace('@', '');
        db.collection("users").where("email", "==", email).get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var team = doc.data().team;
            if(localStorage.getItem("editEvent") !== document.getElementById('start-date').value + 
            " " + document.getElementById('opponent').value) {
                db.collection("teams").doc(team).collection("events").doc(localStorage.getItem("editEvent")).delete().then(function() {
                  console.log("Document successfully deleted!");
                }).catch(function(error) {
                  console.error("Error removing document: ", error);
                });
            }
            db.collection("teams").doc(team).collection("events").doc(document.getElementById('start-date').value + 
            " " + document.getElementById('opponent').value).set({
              title: document.getElementById('opponent').value,
              location: document.getElementById('location').value, 
              startDate: document.getElementById('start-date').value,
              startTime: document.getElementById('start-time').value,
              type: 'game'
            }).then(function(result) {
              window.location = "schedule-admin.html";
              return false;
            });                
          });
        });
      }
    });
  }
  else {
    document.getElementById("warning").innerHTML = "Please fill out all event information!";
    return false;
  }
}


function editOther() {
  if(document.getElementById('title').value && document.getElementById('location-prac').value && 
  document.getElementById('start-date-prac').value && document.getElementById('start-time-prac').value) {
    var email;

    firebase.auth().onAuthStateChanged(function(user) {
      if(user) {
        email = user.email.replace('.', '').replace('@', '');
        db.collection("users").where("email", "==", email).get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var team = doc.data().team;
            var type = 'practice';
            if(document.getElementById('nav_create_other').classList.contains('active')) {
              type = 'other';
            }
            if(localStorage.getItem("editEvent") !== document.getElementById('start-date').value + 
            " " + document.getElementById('title').value) {
                db.collection("teams").doc(team).collection("events").doc(localStorage.getItem("editEvent")).delete().then(function() {
                  console.log("Document successfully deleted!");
                }).catch(function(error) {
                  console.error("Error removing document: ", error);
                });
            }
            db.collection("teams").doc(team).collection("events").doc(document.getElementById('start-date').value + 
            " " + document.getElementById('title').value).set({
              title: document.getElementById('title').value,
              location: document.getElementById('location-prac').value, 
              startDate: document.getElementById('start-date-prac').value,
              startTime: document.getElementById('start-time-prac').value,
              type: type
            }).then(function(result) {
              window.location = "schedule-admin.html";
              return false;
            });                
          });
        });
      }
    });
  }
  else {
    document.getElementById("warning").innerHTML = "Please fill out all event information!";
    return false;
  }
}

function deleteEvent(element) {
  
}