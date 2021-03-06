require('dotenv').config({path: '../.env'});

const express = require("express");
const bodyParser = require("body-parser");


var Acuity = require("acuityscheduling");
var svnShifts = require('7shifts')

const app = express();

//top-level middleware
app.use(bodyParser.json());
app.use(express.json());

const {
    ACUITY_USER_ID,
    ACUITY_API_KEY
} = process.env;

var acuity = Acuity.basic({
  userId: ACUITY_USER_ID,
  apiKey: ACUITY_API_KEY
});

// Acuity Endpoints
let apptData = []

function acuityAPI(){
  acuity.request("appointments", function(err, res, appointments) {
    if (err) return console.error(err);
      // console.log('APPOINTMENTS',appointments);
      apptData = appointments
      sevenShiftsAPI();
      // console.log("ApptData = ",apptData)
  });
}
acuityAPI();

// 7 Shifts Endpoints
let shiftData = {}

function sevenShiftsAPI(){
  svnShifts.Shifts.list("3WX3WZ8BTC8BF49JGF4CSC6XMAKHTE4T")
  .then(function (resp) {
    // console.log("7SHIFTS RESONSE>>>> ",resp.body)
    shiftData = JSON.parse(resp.body)
    consoleLog();
    // console.log("ShiftData = ",shiftData)
  })
  .catch(function (err) {
    console.log(err)
  })
} 

// create shift - WORKS!
// You cannot add more than one user_id when the endpoint is hit, which means that a loop must be created to add more than one user per shift on each day.
// MUST have a user_id (aka employee id) and a department_id (int). role_id (int) = director or supervisor.
// To create an open shift, it MUST indicate "open" as true and "open_offer_type" as 1
// curl -X POST -d '{ "shift": { "start": "2019-04-09 10:00:00", "end": "2019-04-09 11:00:00", "user_id": 0, "role_id": 296565, "location_id": 55212, "department_id": 74580, "open": true, "open_offer_type": 1, "notes": "Type of mission" } }' https://api.7shifts.com/v1/shifts \-u 3WX3WZ8BTC8BF49JGF4CSC6XMAKHTE4T:

function consoleLog(){
  console.log(shiftData.data,apptData)
}






app.listen(5000, function() {
  console.log("Listening on port 5000");
});
