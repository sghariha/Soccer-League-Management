// Initialize Firebase
var config = {
  apiKey: "AIzaSyBig_htEJTY6jZ1LpuT6DvXnrqrXaa2heY",
  authDomain: "cse134b-527c4.firebaseapp.com",
  databaseURL: "https://cse134b-527c4.firebaseio.com",
  projectId: "cse134b-527c4",
  storageBucket: "cse134b-527c4.appspot.com"
};
firebase.initializeApp(config);
var database = firebase.database();
var name, email, photoUrl, uid, emailVerified, team;


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
