$(document).ready(function () {
  // get from database
  $.ajax({
    url: 'backliftapp/team',
    type: "GET",
    dataType: "json",
    success: function (data) {
      leagueAll = data;
      for (var i = 0; i < data.length; i++) {
        addTeamToTable(data[i]);
        populateTeamList(data[i]);
      }
      doPopovers();
      track("Json init!");
      track("Teams loaded!");
    }
  }); // end ajax
}); // end ready

// // The league 
// // 0-team name, 1-Manager, 2-Manager Last, 3-Phone, 4-Email, 5-Zip, 6-Sponsor, 7-Wins, 8-Losses, 9-Percent
// var league2d = [
//     ["Ardvarks", "Christopher", "Fryman", "9016045976", "farfromguam@gmail.com", "37210", "Fryman and Assoiciates", "W", "L", "%"],
//     ["Boss Hoggs", "Joe", "Shepherd", "6154840875", "shepright@comcast.net", "37205", "Brewhouse West", "W", "L", "%"]
// ]

var leagueAll = [];

// add team to league
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
      addTeamToTable(data);
      populateTeamList(data);
      track("Team: " + team.name + " added!");
      doPopovers();
      }
  });

}; // end add team

$(".deleteTeam").click(function () {
  alert(this.data.id);
});

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
    "<a class='manage deleteTeam'>Delete Team</a>" +
    "</p>").appendTo('#teamList');
}

function addTeamToTable(team) {
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
    "<td>" + "calculate %" + "</td>" +
    "</tr>").appendTo('#teamStandings tbody');
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