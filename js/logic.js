// Initialize Firebase
var config = {
  apiKey: "AIzaSyCUg38OrJgc1PsQnTLbnvSNQzlCMpukCp4",
  authDomain: "train-scheduler-2-def7a.firebaseapp.com",
  databaseURL: "https://train-scheduler-2-def7a.firebaseio.com",
  projectId: "train-scheduler-2-def7a",
  storageBucket: "train-scheduler-2-def7a.appspot.com",
  messagingSenderId: "665757700387"
};
// Firebase Initialization
firebase.initializeApp(config);

//Firebase stored in variable
var dataRef = firebase.database();
var trainName = "";
var trainDest = "";
var firstTime = "";
var trainFreq = 0;
var editKey = "";
var currentTime = moment();

// Time input format check
function checkTime() {
  var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
    $("#startTime").val()
  );
  if (isValid) {
    $("#startTime").addClass("bg-success");
    setTimeout(function() {
      $("#startTime").removeClass("bg-success");
    }, 2000);
  } else {
    $("#startTime").addClass("bg-danger");
    setTimeout(function() {
      $("#startTime").removeClass("bg-danger");
    }, 750);
  }
  //after the value is tested then the return holds the value
  return isValid;
}

// Checking input values to be not empty
//750 is milliseconds that resets the color
function notEmpty() {
  var checkName;
  var checkDest;
  var checkArrival;
  if ($("#trainName").val() != "") {
    $("#trainName").addClass("bg-success");
    setTimeout(function() {
      $("#trainName").removeClass("bg-success");
    }, 2000);
    checkName = true;
  } else {
    $("#trainName").addClass("bg-danger");
    setTimeout(function() {
      $("#trainName").removeClass("bg-danger");
    }, 750);
    checkName = false;
  }
  if ($("#destination").val() != "") {
    $("#destination").addClass("bg-success");
    setTimeout(function() {
      $("#destination").removeClass("bg-success");
    }, 2000);
    checkDest = true;
  } else {
    $("#destination").addClass("bg-danger");
    setTimeout(function() {
      $("#destination").removeClass("bg-danger");
    }, 750);
    checkDest = false;
  }
  if ($("#trainFreq").val() != "") {
    $("#trainFreq").addClass("bg-success");
    setTimeout(function() {
      $("#trainFreq").removeClass("bg-success");
    }, 2000);
    checkArrival = true;
  } else {
    $("#trainFreq").addClass("bg-danger");
    setTimeout(function() {
      $("#trainFreq").removeClass("bg-danger");
    }, 750);
    checkArrival = false;
  }
  if (checkName && checkDest && checkArrival) {
    return true;
  } else {
    return false;
  }
}

// Submitting Data to Firebase

$(document).on("click", "#buttonSub", function() {
  if (checkTime() && notEmpty()) {
    trainName = $("#trainName")
      .val()
      .trim();
    trainDest = $("#destination")
      .val()
      .trim();
    firstTime = $("#startTime")
      .val()
      .trim();
    trainFreq = $("#trainFreq").val();
    //edit lets you edit the data
    if (editKey == "") {
      dataRef.ref().push({
        trainName: trainName,
        trainDest: trainDest,
        firstTime: firstTime,
        trainFreq: trainFreq
      });
      //
    } else if (editKey != "") {
      dataRef.ref(editKey).update({
        trainName: trainName,
        trainDest: trainDest,
        firstTime: firstTime,
        trainFreq: trainFreq
      });
    }
    //afer edit and add input is submitted then it resets
    $("#trainName").val("");
    $("#destination").val("");
    $("#startTime").val("");
    $("#trainFreq").val("");
  }
});

// Clearing input values on Cancel
$(document).on("click", "#buttonCan", function() {
  $("#trainName").val("");
  $("#destination").val("");
  $("#startTime").val("");
  $("#trainFreq").val("");
});

// Appending Newly Entered Train information in the Display
//child_added is the keyword

dataRef.ref().on("child_added", function(childSnapshot) {
  var displayName = childSnapshot.val().trainName;
  var displayDest = childSnapshot.val().trainDest;
  var firstArr = childSnapshot.val().firstTime;
  var frequent = childSnapshot.val().trainFreq;
  var convertedTime = moment(firstArr, "HH:mm").subtract(1, "years");
  var trainId = childSnapshot.key;
  console.log(convertedTime);
  console.log(childSnapshot.key);
  var timeDiff = moment().diff(moment(convertedTime), "minutes");
  var remTime = timeDiff % frequent;
  var timeTill = frequent - remTime;
  var nextTime = moment().add(timeTill, "minutes");
  $("#appendHere").append(
    "<tr id='" +
      trainId +
      "' class='bg-light text-dark'><td class='col s2'><p>" +
      displayName +
      "</p></td><td class='col s2'><p>" +
      displayDest +
      "</p></td><td class='col s2'><p>" +
      frequent +
      "</p></td><td class='col s2'><p>" +
      moment(nextTime).format("HH:mm") +
      "</p></td><td class='col s2'><p>" +
      timeTill +
      "</p></td><td class='col s1'><button class='delete btn' data-train=" +
      trainId +
      "><i class='material-icons' style='font-size:30px; color: red'>delete_forever</i></button></td><td class='col s1'><button class='edit btn' data-train=" +
      trainId +
      "><i class='material-icons' style='font-size:30px; color: blue'>edit</i></button></td></tr>"
  );
});

// Appending updated Train information in the Display
//child_changed is a keyword
//.key calls the unique key id in the database

dataRef.ref().on("child_changed", function(childSnapshot) {
  var displayName = childSnapshot.val().trainName;
  var displayDest = childSnapshot.val().trainDest;
  var firstArr = childSnapshot.val().firstTime;
  var frequent = childSnapshot.val().trainFreq;
  var convertedTime = moment(firstArr, "HH:mm").subtract(1, "years");
  var trainId = childSnapshot.key;
  console.log(convertedTime);
  console.log(childSnapshot.key);
  var timeDiff = moment().diff(moment(convertedTime), "minutes");
  var remTime = timeDiff % frequent;
  var timeTill = frequent - remTime;
  var nextTime = moment().add(timeTill, "minutes");
  $("#" + trainId).html(
    "<td class='col s2'><p>" +
      displayName +
      "</p></td><td class='col s2'><p>" +
      displayDest +
      "</p></td><td class='col s2'><p>" +
      frequent +
      "</p></td><td class='col s2'><p>" +
      moment(nextTime).format("HH:mm") +
      "</p></td><td class='col s2'><p>" +
      timeTill +
      "</p></td><td class='col s1'><button class='delete btn' data-train=" +
      trainId +
      "><i class='material-icons' style='font-size:30px; color: red'>delete_forever</i></button></td><td class='col s1'><button class='edit btn' data-train=" +
      trainId +
      "><i class='material-icons' style='font-size:30px; color: blue'>edit</i></button></td>"
  );
});

// Delete an entire row
$(document).on("click", ".delete", function() {
  var trainKey = $(this).attr("data-train");
  dataRef.ref(trainKey).remove();
  $("#" + trainKey).remove();
  // location.reload(true);
});

// Edit a row

$(document).on("click", ".edit", function() {
  editKey = $(this).attr("data-train");
  dataRef
    .ref(editKey)
    .once("value")
    .then(function(childSnapshot) {
      $("#trainName").val(childSnapshot.val().trainName);
      $("#destination").val(childSnapshot.val().trainDest);
      $("#startTime").val(childSnapshot.val().firstTime);
      $("#trainFreq").val(childSnapshot.val().trainFreq);
    });
});

// Showing current time
$("#currentTime").html("<h4>" + moment().format("HH:mm:ss") + "<h4>");

setInterval(function() {
  $("#currentTime").html("<h4>" + moment().format("HH:mm:ss") + "<h4>");
  // location.reload(true);
}, 1000);

// Reload page every 1 min
// location is keyword and .reload is a method
timeout = setInterval(function() {
  location.reload(true);
}, 60000);

// Prevent page reloading when Data is being entered and starting another interval
document.onkeyup = function() {
  clearInterval(timeout);

  timeout = setInterval(function() {
    location.reload(true);
  }, 60000);
};

// Pseudocode:
// Couldn't figure:
// As a final challenge, make it so that only users who log into the site with their Google or GitHub accounts can use your site. 
// You'll need to read up on Firebase authentication for this bonus exercise.