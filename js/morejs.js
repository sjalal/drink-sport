$(document).ready(function () {
  track("Document Ready");
  getFromDatabase();  
}); // end ready

function getFromDatabase() {  

  $('#teamList').empty();
  $('#teamTable tbody').empty();
  $('#signUpButton').empty();
  $('#gameSchedules').empty();
  track("Cleared old data")

  $.ajax({
    url: 'backliftapp/team',
    type: "GET",
    dataType: "json",
    success: function (data) {
      track("Connected to database");
      displayButton(data.length);
      populateGameSchedules(data.length);
      for (var i = 0; i < data.length; i++) {
        populateTeamTable(data[i]);
        populateTeamList(data[i]);
      }
      doPopovers();
      track("Fresh data loaded");
    }
  }); // end ajax
};

function addTeam() {
  var team = {
    name: $("#inputTeamName").val(),
    mgrFirst: $("#inputMgrFirst").val(),
    mgrLast: $("#inputMgrLast").val(),
    mgrPhone: $("#inputMgrPhone").val(),
    mgrEmail: $("#inputMgrEmail").val(),
    mgrZip: $("inputMgrZip").val(),
    sponsor: $("#inputSponsor").val(),
    wins: 0,
    losses: 0
  };
  $.ajax({
    url: 'backliftapp/team',
    type: "POST",
    dataType: "json",
    data: team,
    success: function (data) {
      console.dir(data);
      track("Team: " + team.name + " added!");
      clearForm();
      getFromDatabase();
    }
  }); // end ajax
}; // end add team

function deleteTeam(id) {
  var conf = confirm("Are you sure you want to delete this team?");
  if (conf == true) {
    $.ajax({
      url: "backliftapp/team/" + id,
      type: "DELETE",
      dataType: "json",
    });
  track("deleted: " + id);
  getFromDatabase();
  }
}

function track(item) {
  $('#console').append(item + "<br>");
}

function clearForm() {
  $(".teamImput").each(function () {
    $(this).val("");
  });
};

function manage() {
  track("You are now logged in");
  $(".manage").css("display", "inline");
}

function startSeason() {
  $(".playing").css("display", "none");
  $(".standings").css("display", "inline");
  track("Season Started!")
}

function populateTeamList(team) {
  $(
    "<h4 class='show'>" + team.name + " <em>sponsored by</em> " + team.sponsor + " </h4>" + 
    "<p class='more'>" +
    "Manager: " + team.mgrFirst + " " + team.mgrLast + "<br>" +
    "Phone: " + team.mgrPhone + "<br>" +
    "E-mail: " + team.mgrEmail + "<br>" +
    "<a class='manage' onclick='deleteTeam(\"" + team.id + "\")'>Delete Team</a>" +
    "</p>").appendTo('#teamList');
}

function displayButton() {
  $(
    document.write('<a href="#myModal" role="button" class="btn" data-toggle="modal">Sign up your team today!</a>')
    ).appendTo('#signUpButton');
}

function displayButton(x) {
  if (x < 4) {
    $('#signUpButton').append('<a href="#myModal" role="button" class="btn btn-warning" data-toggle="modal">We need you to sign up!</a>');
  } else if (x >= 4 && x < 8) {
    $('#signUpButton').append('<a href="#myModal" role="button" class="btn" data-toggle="modal">Sign up your team today!</a>');
  } else {
    $('#signUpButton').append('<a class="btn btn-danger">Sorry! Our league is full for this seaon.</a>');
  };
}

function populateTeamTable(team) {
  var percent = (parseInt(team.wins)/(parseInt(team.wins)+parseInt(team.losses))).toFixed(3);

  $(
    "<tr>" +
    "<td>" + team.id + "</td>" +
    "<td><span class='show'>" + team.name + " <em>sponsored by</em> " + team.sponsor + "</span>" +
    "<p class='more'><br>" +
    "Manager: " + team.mgrFirst + " " + team.mgrLast + "<br>" +
    "Phone: " + team.mgrPhone + "<br>" +
    "E-mail: " + team.mgrEmail + "<br></p>" +
    "</td>" +
    "<td>" + team.wins + "</td>" +
    "<td>" + team.losses + "</td>" +
    "<td>" + percent + "</td>" +
    "</tr>").appendTo('#teamTable tbody');
}

// Popover like functionality 
function doPopovers() { 
  $('.more').hide();
  $('.show').click(
  function () {
    $(this).next('.more').toggle();
    track("Popover working!")
  });
}

function populateGameSchedules(x) {

$('#gameSchedules').append(x);
  if (x === 4) {
    $('#gameSchedules').append(sched4);
  } else if (x === 5 || x === 6) {
    $('#gameSchedules').append(sched6);
  } else if (x === 7 || x === 8) {
    $('#gameSchedules').append(sched8);
  } else {
    $('#gameSchedules').append('<p class="text-error">There are not enough teams to start season play<p>');
  }
}

var sched4 = [ 
[ [1, 4], [2, 3] ],
[ [1, 3], [2, 4] ],
[ [1, 2], [3, 4] ]
];

var sched6 = [ 
[ [1, 6], [2, 5], [3, 4] ],
[ [1, 5], [4, 6], [2, 3] ],
[ [1, 4], [3, 5], [2, 6] ],
[ [1, 3], [2, 4], [5, 6] ],
[ [1, 2], [3, 6], [4, 5] ]
];

var sched8 = [
[ [1, 8], [2, 7], [3, 6], [4, 5] ],
[ [1, 7], [6, 8], [2, 5], [3, 4] ],
[ [1, 6], [5, 7], [4, 8], [2, 3] ],
[ [1, 5], [4, 6], [3, 7], [2, 8] ],
[ [1, 4], [3, 5], [2, 6], [7, 8] ],
[ [1, 3], [2, 4], [5, 8], [6, 7] ],
[ [1, 2], [3, 8], [4, 7], [5, 6] ]
];

// // reusable sort functions, and sort by any field
// // http://stackoverflow.com/questions/979256/how-to-sort-an-array-of-javascript-objects
// var sort_by = function (field, reverse, primer) {
//     var key = primer ? function (x) {
//             return primer(x[field]);
//         } : function (x) {
//             return x[field];
//         }
//     return function (a, b) {
//         var A = key(a),
//             B = key(b);
//         return (A < B ? -1 : (A > B ? 1 : 0)) * [1, -1][+ !! reverse];
//     }
// }