$(document).ready(function () {
  track("<i class='icon-file'></i> Document Ready");
  getFromDatabase();  
}); // end ready

function getFromDatabase() {  

  $('#teamList').empty();
  $('#teamTable tbody').empty();
  $('#signUpButton').empty();
  $('#gameSchedules').empty();
  track("<i class='icon-trash'></i> Cleared old data")

  $.ajax({
    url: 'backliftapp/team',
    type: "GET",
    dataType: "json",
    success: function (data) {
      track("<i class='icon-hdd'></i> Connected to database");
      track("<i class='icon-download-alt'></i> Fresh data loaded");
      
      // add scheduleId and wpc to records
      for (var i = 0; i < data.length; i++) {
        data[i]['scheduleId'] = i + 1;
        data[i]['wpc'] = (parseInt(data[i].wins)/(parseInt(data[i].wins)+parseInt(data[i].losses))).toFixed(3);
      }

      // Teams Playing This Year
      populateTeamList(data);
      displayButton(data.length);

      // League Standings      
      data.sort(sort_by('wpc', true, parseFloat));
      track("<i class='icon-random'></i> Teams sorted");
      populateTeamTable(data);
    
      // Game Schedules
      data.sort(sort_by('scheduleId', false, parseFloat));
      populateGameSchedules(data);

      doPopovers();
    
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
      track("<i class='icon-plus'></i> Team: " + team.name + " added!");
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
      success: function() { 
        track("<i class='icon-minus'></i> Deleted: " + id);
        getFromDatabase();
      }
    });
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
  track("<i class='icon-wrench'></i> You are now logged in");
  $(".manage").css("display", "inline");
}

function startSeason() {
  $(".playing").css("display", "none");
  $(".standings").css("display", "inline");
  track("<i class='icon-warning-sign'></i>  Season Started!")
}

function populateTeamList(team) {
  for (var i = 0; i < team.length; i++) {
    $(
      "<h4 class='show'>" + team[i].name + " <em>sponsored by</em> " + team[i].sponsor + " </h4>" + 
      "<p class='more'>" +
      "Manager: " + team[i].mgrFirst + " " + team[i].mgrLast + "<br>" +
      "Phone: " + team[i].mgrPhone + "<br>" +
      "E-mail: " + team[i].mgrEmail + "<br>" +
      "<button class='btn btn-mini btn-danger manage' onclick='deleteTeam(\"" + team[i].id + "\")'>Delete Team</button>" +
      "</p>").appendTo('#teamList');
  };
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
  $(
    "<table id='teamTable' class='table'><thead><tr>" +
    "<th>#</th>" +
    "<th>Team Name</th>" +
    "<th>Wins</th>" +
    "<th>losses</th>" +
    "<th>Percent</th>" +
    "</tr></thead><tbody></tbody>"
  ).appendTo('#teamTable');

  for (var i = 0; i < team.length; i++) {
    $(
      "<tr>" +
      "<td>" + (i+1) + "</td>" +
      "<td><span class='show'>" + team[i].name + " <em>sponsored by</em> " + team[i].sponsor + "</span>" +
      "<p class='more'><br>" +
      "Manager: " + team[i].mgrFirst + " " + team[i].mgrLast + "<br>" +
      "Phone: " + team[i].mgrPhone + "<br>" +
      "E-mail: " + team[i].mgrEmail + "<br></p>" +
      "</td>" +
      "<td>" + team[i].wins + "</td>" +
      "<td>" + team[i].losses + "</td>" +
      "<td>" + team[i].wpc + "</td>" +
      "</tr>"
    ).appendTo('#teamTable tbody');
  }
}

function doPopovers() { 
  $('.more').hide();
  $('.show').click(
  function () {
    $(this).next('.more').toggle();
    track("<i class='icon-resize-vertical'></i> Popover working!")
  });
}

function populateGameSchedules(t) {

  if (t.length === 4) {
    var s = blankSchedule4;
  } else if (t.length === 5 || t.length === 6) {
    var s = blankSchedule6;
  } else if (t.length === 7 || t.length === 8) {
    var s = blankSchedule8;
  } else {
    $('<p class="text-error">There is not a schedule for the current amount of teams<p>').appendTo('#gameSchedules');
    return; // dump from function
  }

  if (t.length % 2 === 1) {
    var oe = "Odd";
    var x = 1;
    var y = 0;
    var z = 2;
  } else {
    var oe = "Even";
    var x = 0;
    var y = 1;
    var z = 1;
  }

  // t-team s-schedule w-week g-game 0/1-Home/Away x,y,x,oe-variables to make odd schedules work
  for (var w = 0; w < s.length; w++) {
    $("<table class='table'><thead><tr>" +
      "<th>Week " + (w + 1) + "</th>" +
      "<th>Matchup</th>" +
      "<th>Score</th>" +
      "</tr></thead><tbody>" +
        // will be populated by next for loop
      "</tbody></table>").appendTo('#gameSchedules');
    for (var g = x; g < s[w].length; g++) {
      $("<tr>" +
        "<td>" + (g + y) + ":00 pm" + "</td>" +
        "<td>" + t[(s[w][g][0] - z)].name + " vs. " + t[(s[w][g][1] - z)].name + "</td>" +
        "<td>" + "0-0 " + "<button class='btn btn-mini manage'>Log Score</button>" + "</a>" +
        "</tr>").appendTo('tbody:last');
    };
    if (t.length % 2 === 1){
      $("<tr class='warning'>" +
        "<td>&nbsp;</td>" +
        "<td>Team off: " + t[(s[w][0][1] - z)].name + "</td>" +
        "<td>&nbsp;</td>" +
        "<tr>").appendTo('tbody:last'); 
    };
  };
  track("<i class='icon-calendar'></i>&nbsp;" + oe + " Schedule Loaded");
}
  
  // // The raw Populate game schedule Magic -- Props to dmoore5050
  // // t-team s-schedule w-week g-game 0/1-Home/Away
  // for (var w = 0; w < s.length; w++) {
  //   $("Week " + (w+1) + " Schedule<br>").appendTo('#gameSchedules');
  //   for (var g = 0; g < s[w].length; g++) {
  //     $(  t[s[w][g][0]].name + " vs. " + t[s[w][g][1]].name + "<br>").appendTo('#gameSchedules');
  //   };
  // };

var blankSchedule4 = [ 
[ [1, 4], [2, 3] ],
[ [1, 3], [2, 4] ],
[ [1, 2], [3, 4] ]
];

var blankSchedule6 = [ 
[ [1, 6], [2, 5], [3, 4] ],
[ [1, 5], [4, 6], [2, 3] ],
[ [1, 4], [3, 5], [2, 6] ],
[ [1, 3], [2, 4], [5, 6] ],
[ [1, 2], [3, 6], [4, 5] ]
];

var blankSchedule8 = [
[ [1, 8], [2, 7], [3, 6], [4, 5] ],
[ [1, 7], [6, 8], [2, 5], [3, 4] ],
[ [1, 6], [5, 7], [4, 8], [2, 3] ],
[ [1, 5], [4, 6], [3, 7], [2, 8] ],
[ [1, 4], [3, 5], [2, 6], [7, 8] ],
[ [1, 3], [2, 4], [5, 8], [6, 7] ],
[ [1, 2], [3, 8], [4, 7], [5, 6] ]
];

function logGameOutcome() {
  var gameOutcome = {
    homeTeamId: $("#inputHomeTeamId").val(),
    homeTeamScore: $("#inputHomeTeamScore").val(),
    awayTeamId: $("#inputAwayTeamId").val(),
    awayTeamScore: $("#inputAwayTeamScore").val(),
    stamp: 0,
    game: 0
  };
  $.ajax({
    url: 'backliftapp/outcomes',
    type: "POST",
    dataType: "json",
    data: gameOutcome,
    success: function (data) {
      track(
        gameOutcome.stamp + ", game " + gameOutcome.game + " score: " +
        gameOutcome.homeTeamScore + " - " + gameOutcome.awayTeamScore + " logged!"
        );
      //add clear score function
    }
  }); // end ajax
}; // end log game outcome


// reusable sort functions, and sort by any field
// http://stackoverflow.com/questions/979256/how-to-sort-an-array-of-javascript-objects
var sort_by = function (field, reverse, primer) {
    var key = primer ? function (x) {
            return primer(x[field]);
        } : function (x) {
            return x[field];
        }
    return function (a, b) {
        var A = key(a),
            B = key(b);
        return (A < B ? -1 : (A > B ? 1 : 0)) * [1, -1][+ !! reverse];
    }
}