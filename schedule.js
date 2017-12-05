var eventList = document.getElementById('schedule-container');
var count = 0;

var weekday = new Array(7);

weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tues";
weekday[3] = "Wed";
weekday[4] = "Thurs";
weekday[5] = "Fri";
weekday[6] = "Sat";



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

  if(c_day.getTime() <= day.getTime()){

    day = day.getUTCDay();
    day = weekday[day];


    startdate = arr[1] + "/" + arr[2];

    tmpl.querySelector('.remove-button').innerHTML = i;
    tmpl.querySelector('.event-date').innerHTML = startdate;
    tmpl.querySelector('.event-day').innerHTML = day;


    var title = null;
    if (localStorage.getItem("event-type"+i.toString()) =="game") {
      title = "Game: " + localStorage.getItem("opponent"+i.toString());
    }
    if (localStorage.getItem("event-type"+i.toString()) =="practice") {
      console.log("Does enter practice");
      console.log(localStorage.getItem("title"+i.toString()));
      title = "Practice: " + localStorage.getItem("title"+i.toString());
    }
    if (localStorage.getItem("event-type"+i.toString()) =="other") {
      console.log("Does enter other");
      console.log(localStorage.getItem("title"+i.toString()));
      title = "Other: " + localStorage.getItem("title"+i.toString());
    }

    tmpl.querySelector('.title').innerHTML = title;
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

    eventList.appendChild(tmpl);
  }
  // End
}


$(function() {
  $('#stats-edit').click(function() {
    $('.right').addClass('col-8');
    $('.right').removeClass('col-10');

    var elements = document.getElementsByClassName('hidden');
    for(var i=0; i < elements.length; i++) {
      elements[i].style.display = 'inline-flex';
    }

    var elements2 = document.getElementsByClassName('visible');
    for(var i=0; i<elements2.length; i++) {
      elements2[i].style.display = 'none';
    }

    var elements3 = document.getElementsByClassName('visible-2');
    for(var i=0; i<elements3.length; i++) {
      elements3[i].style.display = 'none';
    }

    var elements4 = document.getElementsByClassName('top-row');
    for(var i=0; i < elements4.length; i++) {
      elements4[i].style.marginTop = '50px';
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

    var elements2 = document.getElementsByClassName('visible');
    for(var i=0; i<elements2.length; i++) {
      elements2[i].style.display = 'inline-flex';
    }

    var elements3 = document.getElementsByClassName('visible-2');
    for(var i=0; i<elements3.length; i++) {
      elements3[i].style.display = 'block';
    }

    var elements4 = document.getElementsByClassName('top-row');
    for(var i=0; i < elements4.length; i++) {
      elements4[i].style.marginTop = '20px';
    }

    return false;
  })
});


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
      }
    }
  }
  var total = parseInt(localStorage.getItem("eventcount"), 10);
  total = total - 1;
  localStorage.setItem("eventcount", total.toString());
  location.reload();
  return false;
}


function displayedit(element) {
  console.log("find me");
var num = element.previousElementSibling.innerHTML;
console.log("Num: " + num);
localStorage.setItem("editevent", num);
window.location = "edit-event.html";
return false;
}
