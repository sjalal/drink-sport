function manage() {
    alert("You are now logged in");
    $(".manage").css("display", "inline");
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
    this.percent = stat.toFixed(3);
    }

// Now we can make an array of people
var league = new Array();
league[0] = new Team("Ardvarks", "Christopher", "Fryman", 9016045976, "farfromguam@gmail.com", 37210, "Fryman and Assoiciates", 67, 17);
league[1] = new Team("Boss Hoggs", "Joe", "Shepherd", 6154840875, "shepright@comcast.net", 37205, "Brewhouse West", 3, 2);

