// Initialize Firebase
var config = {
    apiKey: "AIzaSyDZMBOwqFORi_N4xp8sqDBYZf0Y22KAGTw",
    authDomain: "train-49266.firebaseapp.com",
    databaseURL: "https://train-49266.firebaseio.com",
    projectId: "train-49266",
    storageBucket: "train-49266.appspot.com",
    messagingSenderId: "411164405540"
  };
  firebase.initializeApp(config);

var database = firebase.database();

//Initialize document ready function
$(document).ready(function() {  

var currentTime = moment();

//Adds current time to top of page
function ticktock() {
    $('#clock').html('Current time: ' + moment().format('hh:mm a'));
  }
  
setInterval(ticktock, 1000);

//Pull data from Firebase and adds to Trains table
database.ref().on("child_added", function(snapshot) {

    var name = snapshot.val().name;
    var destination = snapshot.val().destination;
    var firstTrain = snapshot.val().firstTrain;
    var frequency = snapshot.val().frequency;
    var min = snapshot.val().min;
    var next = snapshot.val().next;

    $("#trains > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + next + "</td><td>" + min + "</td></tr>");
});

//Retrieves values from the input
$("#addTrain").on("click", function() {

    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var frequency = $("#frequency").val().trim();

//ensures that each input has a value
    if (trainName == "") {    
        $(".modal").css("display", "block");
        $(".message").text("Please enter your train name.");    
        return false;
    }
    if (destination == "") {
        $(".modal").css("display", "block");
        $(".message").text("Please enter the destination.");
        return false;
    }
    if (firstTrain == "") {
        $(".modal").css("display", "block");
        $(".message").text("Please enter the time of the first train.");
        return false;
    }
    if (frequency == "") {
        $(".modal").css("display", "block");
        $(".message").text("Please enter the train frequency in minutes.");
        return false;
    }

    // THE MATH!

    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract("1, years");
    
    // the time difference between current time and the first train
    var difference = currentTime.diff(moment(firstTrainConverted), "minutes");
    var remainder = difference % frequency;
    var minUntilTrain = frequency - remainder;
    var nextTrain = currentTime.add(minUntilTrain, "minutes").format("hh:mm a");

    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        min: minUntilTrain,
        next: nextTrain
    }

    console.log(newTrain);
    database.ref().push(newTrain);

    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrain").val("00:00");
    $("#frequency").val("");

    return false;
});

$(".close").on("click", function(){
    $(".modal").css("display", "none");
});

});