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

firebase.initializeApp({
  apiKey: "AIzaSyBig_htEJTY6jZ1LpuT6DvXnrqrXaa2heY",
  authDomain: "cse134b-527c4.firebaseapp.com",
  projectId: "cse134b-527c4",
});
var db  =firebase.firestore();
var name, email, photoUrl, uid, emailVerified, team;




/* -------------- other javascript -------------------- */
/* start of stats javascript */
function loadStats() {
  firebase.firestore().enablePersistence()
  .then(function() {
    // Initialize Cloud Firestore through firebase
    var db = firebase.firestore();
    console.log("This is after the db call");
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        email = user.email;

        var userEmail = email.replace(/[^a-zA-Z0-9 ]/g,"");

        db.doc("users/"+userEmail).get().then(function(userData){
          team = userData.data().team;

          db.doc('/teams/'+team+'/teamStats/teamStats').get().then(function(tStats){
            document.getElementById('teamwins').innerHTML =tStats.data().wins;
            document.getElementById('teamlosses').innerHTML=tStats.data().losses;
            document.getElementById('teamties').innerHTML=tStats.data().ties;
            document.getElementById('teamgoalsfor').innerHTML=tStats.data().goalsFor;
            document.getElementById('teamgoalsagainst').innerHTML=tStats.data().goalsAgainst;
            console.log("Inside of team stats");
          }).catch(function(error){
            console.log("Error getting document:", error);
          });

          console.log("After team stats");
          console.log("Team: " + team);
          db.doc('/teams/'+team).collection('schedule').get().then(function(snapshot){

            console.log("Inside of schedule");
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


            console.log("Ends here aaa");
            if(localStorage.getItem("eventcount")) {
              count = parseInt(localStorage.getItem("eventcount"), 10);
            }

            var i = 1;
            console.log("Snapshot: " + snapshot);
            snapshot.forEach(function(child){
              console.log("Goes in here");
              var key = child.id;
              var value = child.data();

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

                console.log("Key: " + key);
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
          }).catch(function(error){
            console.log("Error getting document:", error);
          });
        }).catch(function(error){
          console.log("Error getting document:", error);
        });
      } else {
        console.log("User is not logged in - stats");
        window.location = "login.html";
      }
    });
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
  });





}

function editstats(element) {

  localStorage.setItem("editingstatsfor", element.previousElementSibling.innerHTML);
  window.location = "edit-statistics.html";
  return false;
}

function addstats(element) {
  console.log("editing for: " + element.previousElementSibling.previousElementSibling.innerHTML);
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
      var userEmail = email.replace(/[^a-zA-Z0-9 ]/g,"");
      db.doc("users/"+userEmail).get().then(function(userData){
        team = userData.data().team;

        if(document.getElementById("winorloss").value && document.getElementById("homescore").value &&
        document.getElementById("awayscore").value && document.getElementById("fouls").value &&
        document.getElementById("cards").value && document.getElementById("shotsongoal").value &&
        document.getElementById("goalsmade").value && document.getElementById("cornerkicks").value &&
        document.getElementById("goalkicks").value && document.getElementById("posstime").value) {

          db.doc('/teams/'+team+'/teamStats/teamStats').get().then(function(tStats){

            var teamwins = parseInt(tStats.data().wins, 10);
            var teamlosses = parseInt(tStats.data().losses, 10);
            var teamties = parseInt(tStats.data().ties, 10);
            var teamgoalsfor = parseInt(tStats.data().goalsFor, 10);
            var teamgoalsagainst = parseInt(tStats.data().goalsAgainst, 10);

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

            var updateTeamStats = db.doc('/teams/'+team+'/teamStats/teamStats');
            updateTeamStats.update(postData);

            currentEvent = localStorage.getItem("editingstatsfor").toString();
            db.doc('/teams/'+team+'/schedule/'+currentEvent).get().then(function(snapshot){

              var updateData = {
                eventType: snapshot.data().eventType,
                location: snapshot.data().location,
                startDate: snapshot.data().startDate,
                startTime: snapshot.data().startTime,
                team: snapshot.data().team,
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

              if(snapshot.data().notes){
                updateData['notes'] = snapshot.data().notes;
              }

              if(snapshot.data().endDate) {
                updateData['endDate'] =snapshot.data().endDate;
              }

              if(snapshot.data().endTime) {
                updateData['endTime'] = snapshot.data().endTime;
              }

              var addStats =  db.doc('/teams/'+team+'/schedule/'+currentEvent);
              addStats.update(updateData);
              window.location = "statistics-admin.html";

            }).catch(function(error){
              console.log("Error getting document:", error);
            });

          }).catch(function(error){
            console.log("Error getting document:", error);
          });
        }

      }).catch(function(error) {
        console.log("Error getting documents: ", error);
      });


    } else {
      window.location = "login.html";
    }
    /* should be the end */
  });
}

function loadEditStats() {
  firebase.firestore().enablePersistence()
  .then(function() {
    // Initialize Cloud Firestore through firebase
    var db = firebase.firestore();
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        email = user.email;

        var userEmail = email.replace(/[^a-zA-Z0-9 ]/g,"");
        db.doc("users/"+userEmail).get().then(function(userData){
          team = userData.data().team;
          var eventName = localStorage.getItem("editingstatsfor");

          db.doc('/teams/'+team+'/schedule/'+eventName).get().then(function(snapshot){
            document.getElementById("winorloss").value = snapshot.data().winLoss;
            document.getElementById("homescore").value = snapshot.data().homeScore;
            document.getElementById("awayscore").value = snapshot.data().awayScore;
            document.getElementById("fouls").value = snapshot.data().fouls;
            document.getElementById("cards").value = snapshot.data().cards;
            document.getElementById("shotsongoal").value = snapshot.data().shotsOnGoal;
            document.getElementById("goalsmade").value = snapshot.data().goalsMade;
            document.getElementById("cornerkicks").value = snapshot.data().cornerKicks;
            document.getElementById("goalkicks").value = snapshot.data().goalKicks;
            document.getElementById("posstime").value = snapshot.data().possensionTime;
          }).catch(function(error) {
            console.log("Error getting documents: ", error);
          });


        }).catch(function(error) {
          console.log("Error getting documents: ", error);
        });


      } else {
        window.location = "login.html";
      }
    });
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
  });



}



function editStats() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      email = user.email;

      var userEmail = email.replace(/[^a-zA-Z0-9 ]/g,"");
      db.doc("users/"+userEmail).get().then(function(userData){
        team = userData.data().team;
        var eventName = localStorage.getItem("editingstatsfor");

        if(document.getElementById("winorloss").value && document.getElementById("homescore").value &&
        document.getElementById("awayscore").value && document.getElementById("fouls").value &&
        document.getElementById("cards").value && document.getElementById("shotsongoal").value &&
        document.getElementById("goalsmade").value && document.getElementById("cornerkicks").value &&
        document.getElementById("goalkicks").value && document.getElementById("posstime").value) {

          /* Get team stats */

          db.doc("teams/"+team+"/teamStats/teamStats").get().then(function(teamStats){
            db.doc("teams/"+team+"/schedule/"+eventName).get().then(function(gameInfo){
              var teamLosses = teamStats.data().losses;
              var teamTies = teamStats.data().ties;
              var teamWins = teamStats.data().wins;
              var teamGoalsFor = teamStats.data().goalsFor;
              var teamGoalsAgainst = teamStats.data().goalsAgainst;

              if(gameInfo.data().winLoss != document.getElementById("winorloss").value) {
                if(gameInfo.data().winLoss=="win") {
                  teamWins = teamWins -1;
                }
                else if(gameInfo.data().winLoss=="loss") {
                  teamLosses = teamLosses - 1;
                }
                else if(gameInfo.data().winLoss =="tie") {
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


              teamGoalsFor = teamGoalsFor + (document.getElementById("homescore").value-gameInfo.data().homeScore);
              teamGoalsAgainst = teamGoalsAgainst + (document.getElementById("awayscore").value-gameInfo.data().awayScore);

              console.log("team wins: " + teamWins);
              console.log("team losses: " + teamLosses);

              var editTeamStatsData = {
                goalsAgainst: teamGoalsAgainst,
                goalsFor: teamGoalsFor,
                losses: teamLosses,
                ties: teamTies,
                wins: teamWins
              };

              var editTeamStatsUpdates =  db.doc('/teams/'+team+'/teamStats/teamStats');
              editTeamStatsUpdates.update(editTeamStatsData);

              /* Updated team stats ^ */


              var editStatsData = {
                eventType: gameInfo.data().eventType,
                location: gameInfo.data().location,
                startTime: gameInfo.data().startTime,
                startDate: gameInfo.data().startDate,
                team: gameInfo.data().team,
                winLoss: document.getElementById("winorloss").value,
                homeScore: document.getElementById("homescore").value,
                awayScore: document.getElementById("awayscore").value,
                fouls: document.getElementById("fouls").value,
                cards: document.getElementById("cards").value,
                shotsOnGoal: document.getElementById("shotsongoal").value,
                goalsMade: document.getElementById("goalsmade").value, cornerKicks: document.getElementById("cornerkicks").value,
                goalKicks: document.getElementById("goalkicks").value, possensionTime: document.getElementById("posstime").value
              };

              if(gameInfo.data().notes) {
                editStatsData["notes"] = gameInfo.data().notes;
              }

              if(gameInfo.data().endTime) {
                editStatsData["endTime"] = gameInfo.data().endTime;
              }

              if(gameInfo.data().endDate) {
                editStatsData["endDate"] = gameInfo.data().endDate;
              }

              console.log("Win/Loss: " + document.getElementById("winorloss").value);

              var editStatsUpdates =  db.doc('/teams/'+team+'/schedule/'+eventName);
              editStatsUpdates.update(editStatsData).then(function(result) {
                window.location = "statistics-admin.html";
              }
              );

              console.log("System 3");
              //window.location = "statistics-admin.html";

            }).catch(function(error) {
              console.log("Error getting documents: ", error);
            });

          }).catch(function(error) {
            console.log("Error getting documents: ", error);
          });

        }
      }).catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    } else {
      window.location ="login.html";
    }
    console.log("System 1 ");
  });
  console.log("System 2 ");
}

/* end of stats js */





function loginFire() {
  var inputEmail = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  /* Signs us in if correct email and password */
  firebase.auth().signInWithEmailAndPassword(inputEmail, password).then(function(result) {
    console.log("Logs in");
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
      else {
        window.location = "login.html";
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
    else {
      location.window = "login.html";
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
      else {
        window.location = "login.html";
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
    else {
      window.location = "login.html";
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
    else {
      location.window = "login.html";
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
    else {
      window.location = "login.html";
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



function offLineUser() {

  var user = firebase.auth().currentUser;

  if (user) {
    console.log("User is logged in");
  } else {
    console.log("Not logged in");
  }


}

function logOff() {
  firebase.auth().signOut().then(function() {
    console.log("Sign off successful");
    window.location = "login.html";
  }).catch(function(error) {
    console.log("Sign off unsuccessful")
  });
}
