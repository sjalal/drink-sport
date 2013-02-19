function manage() {
    console.log("You are now logged in");
    $(".manage").css("display", "inline");
}

function startSeason() {
    $(".playing").css("display", "none");
    $(".standings").css("display", "inline");
}

//define Variables



// Team constructor
function Team (teamName, mgrFirst, mgrLast, mgrPhone, mgrEmail, mgrZip, sponsor, wins, losses) {
    this.teamName = teamName;
    this.mgrFirst = mgrFirst;
    this.mgrLast = mgrLast;
    this.mgrPhone = mgrPhone;
    this.mgrEmail = mgrEmail;
    this.mgrZip = mgrZip;
    this.sponsor = sponsor;
    this.wins = wins;
    this.losses = losses;
    var stat = wins/(wins+losses);
        //if (stat === NaN) (this.stat = 0);
    this.percent = stat.toFixed(3);
    this.rank = stat * 100;
    }

// Now we can make an array of people
var league = new Array();
league[0] = new Team("Ardvarks", "Christopher", "Fryman", 9016045976, "farfromguam@gmail.com", 37210, "Fryman and Assoiciates", 10, 10);
league[1] = new Team("Boss Hoggs", "Joe", "Shepherd", 6154840875, "shepright@comcast.net", 37205, "Brewhouse West", 4, 1);
//league[2] = new Team("Cozy Bros", "Joe", "Shepherd", 6154840875, "shepright@comcast.net", 37205, "Snuggie corp of America", 6, 10);
//league[3] = new Team("Dudly Doo Doo", "Joe", "Shepherd", 6154840875, "shepright@comcast.net", 37205, "Snuggie corp of America", 43, 2);
//league[4] = new Team("Every Other Thing", "Joe", "Shepherd", 6154840875, "shepright@comcast.net", 37205, "Snuggie corp of America", 5, 1);
//league[5] = new Team("Foo Bar", "Joe", "Shepherd", 6154840875, "shepright@comcast.net", 37205, "Snuggie corp of America", 6, 6);
//league[6] = new Team("Gangnam Style", "Joe", "Shepherd", 6154840875, "shepright@comcast.net", 37205, "Snuggie corp of America", 3, 2);
//league[7] = new Team("Herion Junkies", "Joe", "Shepherd", 6154840875, "shepright@comcast.net", 37205, "Snuggie corp of America", 1, 0);



// reusable sort functions, and sort by any field
// http://stackoverflow.com/questions/979256/how-to-sort-an-array-of-javascript-objects
var sort_by = function(field, reverse, primer){
   var key = primer ? function (x) { return primer(x[field]); } : function (x) { return x[field]; }
   return function (a,b) {
       var A = key(a), B = key(b);
       return (A < B ? -1 : (A > B ? 1 : 0)) * [1,-1][+!!reverse];                  
   }
}




// Joes modal stuff
$(document).ready(function(){
$("#register").click(function(){
  document.write("Hello there.");
});
}); //end of ready