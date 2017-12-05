if(!localStorage.getItem("teamwins")) {
  localStorage.setItem("teamwins", "0");
  localStorage.setItem("teamlosses", "0");
  localStorage.setItem("teamties", "0");
  localStorage.setItem("teamgoalsfor", "0");
  localStorage.setItem("teamgoalsagainst", "0");
}

document.getElementById('teamwins').innerHTML = localStorage.getItem("teamwins");
document.getElementById('teamlosses').innerHTML = localStorage.getItem("teamlosses");
document.getElementById('teamties').innerHTML = localStorage.getItem("teamties");
document.getElementById('teamgoalsfor').innerHTML = localStorage.getItem("teamgoalsfor");
document.getElementById('teamgoalsagainst').innerHTML = localStorage.getItem("teamgoalsagainst");

var eventList = document.getElementById('stats-container');
var count = 0;

var weekday = new Array(7);
weekday[0] = "Fri";
weekday[1] = "Sat";
weekday[2] = "Sun";
weekday[3] = "Mon";
weekday[4] = "Tues";
weekday[5] = "Wed";
weekday[6] = "Thurs";



if(localStorage.getItem("eventcount")) {
  count = parseInt(localStorage.getItem("eventcount"), 10);
}

for (var i = 1; i <= count; i++) {
  // Start

  var tmpl = document.getElementById('eventrow').content.cloneNode(true);
  var startdate = localStorage.getItem("start-date"+i.toString());
  var arr = startdate.split('-');             // year, month, day
  console.log(arr[0]+" - "+arr[1]+" - "+arr[2]);
  var day = new Date(arr[0], arr[1]-1, arr[2]);
  var c_day = new Date();

  if(c_day.getTime() > day.getTime() && localStorage.getItem("event-type"+i.toString()) =="game"){

    day = day.getUTCDay();
    day = weekday[day];


    startdate = arr[1] + "/" + arr[2];

    tmpl.querySelector('.remove-button').innerHTML = i;
    tmpl.querySelector('.event-date').innerHTML = startdate;
    tmpl.querySelector('.event-day').innerHTML = day;

    var title = "Game: " + localStorage.getItem("opponent"+i.toString());

    tmpl.querySelector('.statname').innerHTML = title;
    tmpl.querySelector('.location').innerHTML = localStorage.getItem("location"+i.toString());

    var time = localStorage.getItem("start-time"+i.toString());

    var timeArr = time.split(':');

    var apm = timeArr[0] >= 12 ? "pm" : "am";
    var hours = timeArr[0] > 12 ? timeArr[0] - 12 : timeArr[0];

    time = hours+":"+timeArr[1]+apm;

    if(localStorage.getItem("end-time"+i.toString())) {
      console.log(localStorage.getItem("end-time"+i.toString()));
      timeArr = localStorage.getItem("end-time"+i.toString()).split(':');
      apm = timeArr[0] >= 12 ? "pm" : "am";
      hours = timeArr[0] > 12 ? timeArr[0] - 12 : timeArr[0];
      time = time + " - " + hours+":"+timeArr[1]+apm;
    }

    tmpl.querySelector('.time').innerHTML = time;

    if(!localStorage.getItem("winorloss" + i.toString())) {
      tmpl.querySelector('.editbtn').style.display = 'none'; 
    }
    else {
      tmpl.querySelector('.addbtn').style.display = 'none'; 
      if(localStorage.getItem("winorloss" + i.toString()) === "win") {
        tmpl.querySelector('.overallscore').innerHTML = "W: " + localStorage.getItem("homescore" + i.toString()) + " - " + 
      localStorage.getItem("awayscore" + i.toString());
      }
      else if(localStorage.getItem("winorloss" + i.toString()) === "loss") {
        tmpl.querySelector('.overallscore').innerHTML = "L: " + localStorage.getItem("homescore" + i.toString()) + " - " + 
      localStorage.getItem("awayscore" + i.toString());
      }
      else {
        tmpl.querySelector('.overallscore').innerHTML = "T: " + localStorage.getItem("homescore" + i.toString()) + " - " + 
      localStorage.getItem("awayscore" + i.toString());
      }
    }

    tmpl.querySelector('.sfoul').innerHTML = localStorage.getItem("fouls" + i.toString());
    tmpl.querySelector('.scards').innerHTML = localStorage.getItem("cards" + i.toString());
    tmpl.querySelector('.ssog').innerHTML = localStorage.getItem("shotsongoal" + i.toString());
    tmpl.querySelector('.sg').innerHTML = localStorage.getItem("goalsmade" + i.toString());
    tmpl.querySelector('.scka').innerHTML = localStorage.getItem("cornerkicks" + i.toString());
    tmpl.querySelector('.sgka').innerHTML = localStorage.getItem("goalkicks" + i.toString());
    tmpl.querySelector('.spt').innerHTML = localStorage.getItem("posstime" + i.toString());

    eventList.appendChild(tmpl);
  }
}

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

function addstats(element) {
  console.log(element.previousElementSibling.previousElementSibling.innerHTML);
  localStorage.setItem("editingstatsfor", element.previousElementSibling.previousElementSibling.innerHTML);
  window.location = "create-statistics.html";
  return false;
}

function editstats(element) {
  console.log(element.previousElementSibling.innerHTML);
  localStorage.setItem("editingstatsfor", element.previousElementSibling.innerHTML);
  window.location = "edit-statistics.html";
  return false;
}

function deleteEvent(element) {
  var num = element.nextElementSibling.innerHTML;
  console.log(num);
  
  localStorage.removeItem("event-type" + num);
  if(localStorage.getItem("opponent" + num)) {
    localStorage.removeItem("opponent" + num);
  }
  else {
    localStorage.removeItem("title" + num);
  }
  localStorage.removeItem("location" + num);
  localStorage.removeItem("start-date" + num);
  localStorage.removeItem("start-time" + num);
  if(localStorage.getItem("end-date" + num)) {
    localStorage.removeItem("end-date" + num);
    localStorage.removeItem("end-time" + num);
  }
  localStorage.removeItem("notes" + num);

  if(localStorage.getItem("winorloss" + num)) {
      var teamwins = parseInt(localStorage.getItem("teamwins"), 10);
      var teamlosses = parseInt(localStorage.getItem("teamlosses"), 10);
      var teamties = parseInt(localStorage.getItem("teamties"), 10);
      var teamgoalsfor = parseInt(localStorage.getItem("teamgoalsfor"), 10);
      var teamgoalsagainst = parseInt(localStorage.getItem("teamgoalsagainst"), 10);

      if(localStorage.getItem("winorloss" + num) === "win") {
        teamwins = teamwins - 1;
      }
      if(localStorage.getItem("winorloss" + num) === "loss") {
        teamlosses = teamlosses - 1;
      }
      if(localStorage.getItem("winorloss" + num) === "tie") {
        teamties = teamties - 1;
      }

      teamgoalsfor = teamgoalsfor - 
      parseInt(localStorage.getItem("homescore" + num), 10);

      teamgoalsagainst = teamgoalsagainst - 
      parseInt(localStorage.getItem("awayscore" + num), 10);

      localStorage.setItem("teamwins", teamwins.toString());
      localStorage.setItem("teamlosses", teamlosses.toString());
      localStorage.setItem("teamties", teamties.toString());
      localStorage.setItem("teamgoalsfor", teamgoalsfor.toString());
      localStorage.setItem("teamgoalsagainst", teamgoalsagainst.toString());

      localStorage.removeItem("winorloss" + num);
      localStorage.removeItem("homescore" + num);
      localStorage.removeItem("awayscore" + num);
      localStorage.removeItem("fouls" + num);
      localStorage.removeItem("cards" + num);
      localStorage.removeItem("shotsongoal" + num);
      localStorage.removeItem("goalsmade" + num);
      localStorage.removeItem("cornerkicks" + num);
      localStorage.removeItem("goalkicks" + num);
      localStorage.removeItem("posstime" + num);
  }

  for(var i = 1; i <= parseInt(localStorage.getItem("eventcount"), 10); i++) {
    if(i > parseInt(num, 10)) {
      console.log(i);

      var index = i - 1;
      localStorage.setItem("event-type" + index.toString(), localStorage.getItem("event-type" + i.toString()));

      if(localStorage.getItem("opponent"+i.toString())) {
        localStorage.setItem("opponent" + index.toString(), localStorage.getItem("opponent" + i.toString()));
      }
      else {
        localStorage.setItem("title" + index.toString(), localStorage.getItem("title" + i.toString()));
      }

      localStorage.setItem("location" + index.toString(), localStorage.getItem("location" + i.toString()));

      localStorage.setItem("start-date" + index.toString(), localStorage.getItem("start-date" + i.toString()));

      localStorage.setItem("start-time" + index.toString(), localStorage.getItem("start-time" + i.toString()));

      if(localStorage.getItem("end-time"+i.toString())) {
        localStorage.setItem("end-date" + index.toString(), localStorage.getItem("end-date" + i.toString()));

        localStorage.setItem("end-time" + index.toString(), localStorage.getItem("end-time" + i.toString()));
      }

      localStorage.setItem("notes" + index.toString(), localStorage.getItem("notes" + i.toString()));

      localStorage.setItem("winorloss" + index.toString(), localStorage.getItem("winorloss" + i.toString()));
      localStorage.setItem("homescore" + index.toString(), localStorage.getItem("homescore" + i.toString()));
      localStorage.setItem("awayscore" + index.toString(), localStorage.getItem("awayscore" + i.toString()));
      localStorage.setItem("fouls" + index.toString(), localStorage.getItem("fouls" + i.toString()));
      localStorage.setItem("cards" + index.toString(), localStorage.getItem("cards" + i.toString()));
      localStorage.setItem("shotsongoal" + index.toString(), localStorage.getItem("shotsongoal" + i.toString()));
      localStorage.setItem("goalsmade" + index.toString(), localStorage.getItem("goalsmade" + i.toString()));
      localStorage.setItem("cornerkicks" + index.toString(), localStorage.getItem("cornerkicks" + i.toString()));
      localStorage.setItem("goalkicks" + index.toString(), localStorage.getItem("goalkicks" + i.toString()));
      localStorage.setItem("posstime" + index.toString(), localStorage.getItem("posstime" + i.toString()));

      if(i === parseInt(localStorage.getItem("eventcount"), 10)) {

        localStorage.removeItem("event-type" + i);
        if(localStorage.getItem("opponent" + i)) {
          localStorage.removeItem("opponent" + i);
        }
        else {
          localStorage.removeItem("title" + i);
        }
        localStorage.removeItem("location" + i);
        localStorage.removeItem("start-date" + i);
        localStorage.removeItem("start-time" + i);

        if(localStorage.getItem("end-time" + i)) {
          localStorage.removeItem("end-date" + i);
          localStorage.removeItem("end-time" + i);
        }
        localStorage.removeItem("notes" + i);

        localStorage.removeItem("winorloss" + i);
        localStorage.removeItem("homescore" + i);
        localStorage.removeItem("awayscore" + i);
        localStorage.removeItem("fouls" + i);
        localStorage.removeItem("cards" + i);
        localStorage.removeItem("shotsongoal" + i);
        localStorage.removeItem("goalsmade" + i);
        localStorage.removeItem("cornerkicks" + i);
        localStorage.removeItem("goalkicks" + i);
        localStorage.removeItem("posstime" + i);

      }
    }
  }
  var total = parseInt(localStorage.getItem("eventcount"), 10);
  total = total - 1;
  localStorage.setItem("eventcount", total.toString());
  location.reload();
  return false;
}

function displaystat (element) {
  if(!element.parentElement.parentElement.parentElement.nextElementSibling.style.display) {
    element.parentElement.parentElement.parentElement.nextElementSibling.style.display = 'block';
  }
  else {
    element.parentElement.parentElement.parentElement.nextElementSibling.style.display = '';
  }
}