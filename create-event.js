$(function() {
  $('#end-time').click(function() {


    var elements = document.getElementsByClassName('hidden');
    for(var i=0; i < elements.length; i++) {
      elements[i].style.display = 'inline';
    }

    var elements2 = document.getElementsByClassName('visible');
    for(var i=0; i < elements2.length; i++) {
      elements2[i].style.display = 'none';
    }

    return false;
  })
});


$(function() {
  $('#remove-time').click(function() {
    var elements = document.getElementsByClassName('hidden');
    for(var i=0; i < elements.length; i++) {
      elements[i].style.display = 'none';
    }

    var elements2 = document.getElementsByClassName('visible');
    for(var i=0; i < elements2.length; i++) {
      elements2[i].style.display = 'inline';
    }
    return false;
  })
});

function changeEvent(obj) {
  var select = obj;
  var selected = select.options[select.selectedIndex].value;

  if(selected === "game") {
    document.getElementById('team-option').style.display = "block";
    document.getElementById('other-option').style.display = "none";
  }
  else if(selected == "other") {
    document.getElementById('team-option').style.display = "none";
    document.getElementById('other-option').style.display = "block";
  }
  else {
    document.getElementById('team-option').style.display = "none";
    document.getElementById('other-option').style.display = "block";
  }
}



function addEvent() {
  var storage = false;
  if(typeof(Storage) !== "undefined") {
    storage = true;
  }

  if(storage == true){



    if(document.getElementById("event-type").value == "game" && !document.getElementById("opponent").value) {
      console.log("1st");
      document.getElementById("warning").innerHTML = "Please enter all fields!";
      return false;
    }

    if(document.getElementById("event-type").value == "other" && !document.getElementById("title").value) {
      console.log("2nd");
      document.getElementById("warning").innerHTML = "Please enter all fields!";
      return false;
    }

    if(document.getElementById("event-type").value == "practice" && !document.getElementById("title").value) {
      console.log("5th");
      document.getElementById("warning").innerHTML = "Please enter all fields!";
      return false;
    }

    /* Checks if there is an end time */
    if((!$('#remove-time:hidden')[0]) && document.getElementById("end-date").value && document.getElementById("end-time").value) {
      console.log("3rd");
      document.getElementById("warning").innerHTML = "Please enter all fields!";
      return false;
    }

    if(document.getElementById("location").value && document.getElementById("start-date").value && document.getElementById("start-time").value && document.getElementById("notes").value) {

      if(!localStorage.getItem("eventcount")) {
        localStorage.setItem("eventcount", "0");
      }

      count = localStorage.getItem("eventcount");
      newcount = parseInt(count, 10) + 1;


      localStorage.setItem("eventcount", newcount.toString());

      localStorage.setItem("event-type" + newcount.toString(), document.getElementById("event-type").value);

      /* If a game */
      if(document.getElementById("event-type").value=="game") {
        console.log("Goes inside")
        localStorage.setItem("opponent" + newcount.toString(), document.getElementById("opponent").value);
      }
      /* if other */
      else{
        console.log("Does add title data");
        localStorage.setItem("title" + newcount.toString(), document.getElementById("title").value);
      }

      localStorage.setItem("location" + newcount.toString(), document.getElementById("location").value);

      var startDate = document.getElementById("start-date").value;

      localStorage.setItem("start-date" + newcount.toString(),startDate);

      localStorage.setItem("start-time" + newcount.toString(), document.getElementById("start-time").value);

      /* If an end date is given */
      if(!$('#remove-time:hidden')[0]) {
        var endDate = document.getElementById("end-date").value;
        localStorage.setItem("end-date" + newcount.toString(), endDate);
        localStorage.setItem("end-time" + newcount.toString(), document.getElementById("end_time").value);
      }

      localStorage.setItem("notes" + newcount.toString(), document.getElementById("notes").value);

    }
    else {
      console.log("4th");
      document.getElementById("warning").innerHTML = "Please enter all fields!";
      return false;
    }
    window.location = "schedule-admin.html";
    return false;




  }
}
