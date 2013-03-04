$(document).ready(function () {
  track("<i class='icon-file'></i> Document Ready");

  // code to make loading icon show
  $(document).ajaxSend(function(event, request, settings) {
    $('#loading-indicator').show();
  });
  // code to make loading icon hide
  $(document).ajaxComplete(function(event, request, settings) {
    $('#loading-indicator').hide();
  });

  getFromDatabase();  
$('#myModal').on('shown', function () {
    $("#signupForm :text:first").focus();
});

var validator = $("#signupForm").validate({
       rules: {
        teamName: 'required',
        mgrFirst : "required",
        mgrLast : "required",
        mgrPhone : {
              required : true,
              minlength : 12
          },
        email : "required",
        zip: {
              required : true,
              digits : true,
              minlength : 5,
              maxlength : 5
          },
        sponsor : "required",
        }, //end of rules
       messages: {
        mgrPhone : {
          minlength : "Make sure you entered a 10-digit number."
       },
        zip : {
          minlength : "Make sure you entered a 5 digit zipcode.",
          maxlength : "Make sure you entered a 5 digit zipcode."
      }
    }, //end messages
}); //end validate

$("#addTeam").click(function(){
    if($('#signupForm').valid() == true){
  addTeamToDatabase();
  $("#myModal").modal('hide');
}
return false;

}); //end click

$("#login").click(function() {
  track("<i class='icon-wrench'></i> You are now logged in");
  $(".manage").css("display", "inline");
});

function addTeamToDatabase(){
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
}; 

   $("body").on("click", ".clear", function(){
    clearForm();
    validator.resetForm();
  });

}); // end ready

function getFromDatabase() {
  $('#teamList').empty();
  $('#teamTable').empty();
  $('#signUpButton').empty();
  $('#gameSchedules').empty();
  track("<i class='icon-trash'></i> Cleared old data")

  $.ajax({
    url: 'backliftapp/team',
    type: "GET",
    dataType: "json",
    success: function (data) {
      track("<i class='icon-download-alt'></i> Fresh data loaded");
      
      // add scheduleId and wpc to records
      for (var i = 0; i < data.length; i++) {
        data[i]['scheduleId'] = i + 1;
        // fix for NAN in win Percent Calculation
        if (data[i].wins === "0" && data[i].losses === "0") {
          data[i]['wpc'] = "<span class='muted'>-NGP-</span>";
        } else {
          data[i]['wpc'] = (parseFloat(data[i].wins)/(parseFloat(data[i].wins)+parseFloat(data[i].losses))).toFixed(3);
        }
      }

      //start season logic
      for (var i = 0; i < data.length; i++) {
        if (data[i].wins > 0) { startSeason(); }
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
}; //end getFromDatabase

    function clearForm(){
    $('#signupForm').each (function(){  
    this.reset();
   }); 
  };

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
};

function track(item) {
  $('#console').append(item + "<br>");
};

function populateTeamList(team) {
  for (var i = 0; i < team.length; i++) {
    $(
      "<h4 class='show'>" + team[i].name + " <em>sponsored by</em> " + team[i].sponsor + " </h4>" + 
      "<p class='more'>" +
      "Manager: " + team[i].mgrFirst + " " + team[i].mgrLast + "<br>" +
      "Phone: " + team[i].mgrPhone + "<br>" +
      "E-mail: " + team[i].mgrEmail + "<br>" +
      "<button class='btn btn-mini manage' id='delete_me' type='button' onclick='deleteTeam(\"" + team[i].id + "\")'>Delete Team</button>" +
      "</p>").appendTo('#teamList');
  }
};

function displayButton(x) {
  if (x < 4) {
    $('#signUpButton').append('<a href="#myModal" role="button" class="btn btn-warning" data-toggle="modal">We need you to sign up!</a>');
  } else if (x >= 4 && x < 8) {
    $('#signUpButton').append('<a href="#myModal" role="button" class="btn" data-toggle="modal">Sign up your team today!</a>');
  } else {
    $('#signUpButton').append('<a class="btn btn-danger">Sorry! Our league is full for this seaon.</a>');
  }
};

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
      "</tr>").appendTo('#teamTable tbody');
  }
};

function doPopovers() { 
  $('.more').hide();
  $('.show').click(
  function () {
    $(this).next('.more').toggle();
    track("<i class='icon-resize-vertical'></i> Popover working!")
  });
};

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
  };

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
        "<td>" + "Game " + (g + y) + "</td>" +
        "<td>" + t[(s[w][g][0] - z)].name + " vs. " + t[(s[w][g][1] - z)].name + "</td>" +
        "<td>" + scoreOrTime( t[(s[w][g][0] - z)].name, t[(s[w][g][0] - z)].id, t[(s[w][g][1] - z)].name, t[(s[w][g][1] - z)].id, 'Season', w, g, (g+y) ) + "</td>" +
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
  
function scoreOrTime (htn, hti, atn, ati, stamp, when, game, time) {

var sot = time + ":00 pm <button class='manage btn btn-mini' onclick=\"logScoreModal(\'" + htn +"\', \'"+ hti +"\', \'"+ atn +"\', \'"+ ati +"\', \'"+ stamp +"\', \'"+ when +"\', \'"+ game + "\')\">LogEm'</button>";

  $.ajax({ // Get outcome data then check for match
    url: 'backliftapp/outcomes',
    type: "GET",
    dataType: "json",
    async: false,
    success: function (data) {

      if ( data.length > 0 ) {
        // check each record for match
        for (var i = 0; i<data.length; i++) {
          if (data[i].homeTeamId == hti &&
              data[i].awayTeamId == ati &&
              data[i].stamp == stamp &&
              data[i].when == when &&
              data[i].game == game ) { 
           sot = data[i].homeTeamScore + " - " + data[i].awayTeamScore;
          }
        } // end check all for loop 
      } // end if
    } // end sucess
  }); // end Ajax
return sot;
} // end scoreOrTime()

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

// stamp-week, tournament or other cat of game. when-when it happend, week x, round x. game-the game in the order of the when x
// stamp and when are probably confusing, its a way to be hyper specific about tracking when the game happend 
function logScoreModal(htn, hti, atn, ati, stamp, when, game) {
  //launch modal
  $('#scoreModal').modal('show');
  //set text on page
  $("span[id='stamp']").text(stamp);
  $("label[id='homeTeamLabel']").text(htn);
  $("label[id='awayTeamLabel']").text(atn);
  //pass hidden values
  $("#passStamp").val(stamp);
  $("#passWhen").val(when);
  $("#passGame").val(game);
  $("#passHomeId").val(hti);
  $("#passAwayId").val(ati);
};

function logGameOutcome() {
  var gameOutcome = {
    stamp: $("#passStamp").val(),
    when: $("#passWhen").val(),
    game: $("#passGame").val(),
    homeTeamId: $("#passHomeId").val(),
    awayTeamId: $("#passAwayId").val(),
    homeTeamScore: $("#inputHomeTeamScore").val(),
    awayTeamScore: $("#inputAwayTeamScore").val(),
  };
  $.ajax({
    url: 'backliftapp/outcomes',
    type: "POST",
    dataType: "json",
    data: gameOutcome,
    success: function (data) {
      
      //this is the bit that assigns wins and losses
      if (gameOutcome.homeTeamScore > gameOutcome.awayTeamScore) {
        increment(gameOutcome.homeTeamId, "wins", "1");
        increment(gameOutcome.awayTeamId, "losses", "1");
      } else if (gameOutcome.homeTeamScore < gameOutcome.awayTeamScore) {
        increment(gameOutcome.homeTeamId, "losses", "1");
        increment(gameOutcome.awayTeamId, "wins", "1");
      } else if (gameOutcome.homeTeamScore === gameOutcome.awayTeamScore) {
        increment(gameOutcome.homeTeamId, "wins", ".5");
        increment(gameOutcome.homeTeamId, "losses", ".5");
        increment(gameOutcome.awayTeamId, "wins", ".5");
        increment(gameOutcome.awayTeamId, "losses", ".5");   
      }

      // Clear Imput Fields
      $("#inputHomeTeamScore").val("");
      $("#inputAwayTeamScore").val("");

      // wait a bit then refresh the page. Give a sec to allow the kids to finish.
      window.setTimeout(function() {
        getFromDatabase();
      }, 250); // time in miliseconds

    }
  }); // end ajax
}; // end log game outcome

function increment(id, key, amt) {
  $.ajax({
    url: 'backliftapp/team/' + id,
    type: "GET",
    dataType: "json",
    async: false,
    success: function (data) {
      if (key === "wins") {        
        $.ajax({ url: 'backliftapp/team/'+id, type: "PUT", data: {wins: parseFloat(data.wins)+parseFloat(amt)}, dataType: "json", });
      } else if (key === "losses") {
        $.ajax({ url: 'backliftapp/team/'+id, type: "PUT", data: {losses: parseFloat(data.losses)+parseFloat(amt)}, dataType: "json", });
      }
    } // end sucess
  }); // end get ajax
} // end increment function

function resetSeason() {
  var conf = confirm("Are you sure you want to clear all scores");
  if (conf == true) {
    
    $.ajax({ // reset all win/loss numbers
      url: 'backliftapp/team',
      type: "GET",
      dataType: "json",
      success: function (data) {
        for (i = 0; i < data.length; i++) { // clear wins/losses record by record
          $.ajax({ url: "backliftapp/team/"+data[i].id, type: "PUT", data: {wins: "0", losses: "0"}, dataType: "json", });
        } // end for loop
        track("<i class='icon-refresh'></i> Reset Wins and Losses");

        $.ajax({ // Get outcome data then clear all scores from database
          url: 'backliftapp/outcomes',
          type: "GET",
          dataType: "json",
          success: function (data) {
            for (i = 0; i < data.length; i++) { // clear each score record by record
              $.ajax({ url: "backliftapp/outcomes/"+data[i].id, type: "DELETE", dataType: "json", });
            } // end for loop
            track("<i class='icon-fire'></i> Torched all the scores");

            // Reset view of page and get new clean data from database
            $(".playing").css("display", "inline");
            $(".standings").css("display", "none");
            getFromDatabase();

          } // end clear scores sucess
        }); // end inner ajax 
      } // end reset wins loss sucess
    }); // end outer ajax
  } // end if confirm 
} // end resetSeason()


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
};

