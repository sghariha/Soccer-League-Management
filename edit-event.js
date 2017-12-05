var storage = false;
if(typeof(Storage) !== "undefined") {
  storage = true;
}
if(storage === true) {
  console.log("Don't drop that dun dun dun")
  var num = localStorage.getItem("editevent")
  console.log(num);

  if(localStorage.getItem("opponent"+num)) {
    document.getElementById("game").selected = true;
    document.getElementById("opponent").value = localStorage.getItem("opponent"+num);

    document.getElementById('team-option').style.display = "flex";
    document.getElementById('other-option').style.display = "none";

  }
  else {
    if(localStorage.getItem("type"+num) == "practice") {
      document.getElementById("practice").selected = true;
    }
    else {
      document.getElementById("other").selected = true;
    }

    document.getElementById('team-option').style.display = "none";
    document.getElementById('other-option').style.display = "flex";

    document.getElementById("title").value = localStorage.getItem("title"+num);
  }


  document.getElementById("location").value = localStorage.getItem("location"+num);

  document.getElementById("start-date").value = localStorage.getItem("start-date"+num);

  document.getElementById("start-time").value = localStorage.getItem("start-time"+num);

  if(localStorage.getItem("end-date")) {
    var elements = document.getElementsByClassName('hidden');
    for(var i=0; i < elements.length; i++) {
      elements[i].style.display = 'none';
    }

    var elements2 = document.getElementsByClassName('visible');
    for(var i=0; i < elements2.length; i++) {
      elements2[i].style.display = 'inline';
    }

    document.getElementById("end-date").value = localStorage.getItem("end-date"+num);

    document.getElementById("end_time").value = localStorage.getItem("end-time"+num);
  }

  document.getElementById("notes").value = localStorage.getItem("notes"+num);
}


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
    document.getElementById('team-option').style.display = "flex";
    document.getElementById('other-option').style.display = "none";
  }
  else if(selected == "other") {
    document.getElementById('team-option').style.display = "none";
    document.getElementById('other-option').style.display = "flex";
  }
  else {
    document.getElementById('team-option').style.display = "none";
    document.getElementById('other-option').style.display = "flex";
  }
}



function editevent() {
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

      var num = localStorage.getItem("editevent");


      localStorage.setItem("event-type" + num, document.getElementById("event-type").value);

      /* If a game */
      if(document.getElementById("opponent")) {
        localStorage.setItem("opponent" + num, document.getElementById("opponent").value);
      }
      /* if other */
      else if(document.getElementById("title")) {
        localStorage.setItem("title" + num, document.getElementById("title").value);
      }

      localStorage.setItem("location" + num, document.getElementById("location").value);

      var startDate = document.getElementById("start-date").value;

      localStorage.setItem("start-date" + num,startDate);

      localStorage.setItem("start-time" + num, document.getElementById("start-time").value);

      /* If an end date is given */
      if(!$('#remove-time:hidden')[0]) {
        var endDate = document.getElementById("end-date").value;
        localStorage.setItem("end-date" + num, endDate);
        localStorage.setItem("end-time" + num, document.getElementById("end_time").value);
      }

      localStorage.setItem("notes" + num, document.getElementById("notes").value);

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
