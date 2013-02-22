// $(document).ready(function () {
//     // get from database
//     $.ajax({
//         url: 'json/drink-sport.json',
//         type: "GET",
//         dataType: "jsonp",
//         success: function(data) {
//             alert(data);
//         },

//     }) // end ajax
// }); // end ready

// The league 
// 0-team name, 1-Manager, 2-Manager Last, 3-Phone, 4-Email, 5-Zip, 6-Sponsor, 7-Wins, 8-Losses, 9-Percent
var league2d = [
    ["Ardvarks", "Christopher", "Fryman", "9016045976", "farfromguam@gmail.com", "37210", "Fryman and Assoiciates", "W", "L", "%"],
    ["Boss Hoggs", "Joe", "Shepherd", "6154840875", "shepright@comcast.net", "37205", "Brewhouse West", "W", "L", "%"]
]

// add team to league
    function addTeam() {
        league2d.push(
        [
        $("#inputTeamName").val(),
        $("#inputMgrFirst").val(),
        $("#inputMgrLast").val(),
        $("#inputMgrPhone").val(),
        $("#inputMgrEmail").val(),
        $("#inputSponsor").val(),
            "W",
            "L",
            "%", ]);
        alert("Thank you, " + $("#inputMgrFirst").val() + ', For registering your team "' + $("#inputTeamName").val() + '"');
        clearForm();
        console.log(JSON.stringify(league2d));
    }; // end add team

function clearForm() {
    $(".teamImput").each(function () {
        $(this).val("");
    });
};

function manage() {
    console.log("You are now logged in");
    $(".manage").css("display", "inline");
}

function startSeason() {
    $(".playing").css("display", "none");
    $(".standings").css("display", "inline");
}

// Popover like functionality 
$(document).ready(function () {
    $('.more').hide();
    $('.show').click(

    function () {
        $(this).next('.more').toggle();
    });
}); // end ready


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