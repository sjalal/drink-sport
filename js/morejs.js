var leagueAll = [];

$(document).ready(function () {
  getFromDatabase();  
}); // end ready

function getFromDatabase() {
  
  $('#teamList').empty();
  $('#teamTable tbody').empty();
  track("Cleared Old Data!")

  $.ajax({
    url: 'backliftapp/team',
    type: "GET",
    dataType: "json",
    success: function (data) {
      leagueAll = data;
      for (var i = 0; i < data.length; i++) {
        populateTeamTable(data[i]);
        populateTeamList(data[i]);
      }
      doPopovers();
      track("Connected to database!");
      track("Team Data loaded!");
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
