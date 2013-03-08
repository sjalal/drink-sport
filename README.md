Drink-Sport, a rec league signup, scheduling, and scores management app.
===========

A joint collaboration by:
Joe Shepherd
  and
The guy with suspenders, Christopher Fryman
Play with it live @ https://drinksport-3g3ez.backliftapp.com/

Code repo for Nashvile Software School beer league project

Functioning features 
Phases 1 and 2:
- Uses Bootstrap framework
- Allows user to add and save a team to the league via a form in a modal window.
- Validates form inputs, confirming all fields are filled out and that phone, zipcode, and email are in the proper          
  formats before submitting info to the server.
- User can clear the form or cancel out of the form.
- The data populates a list of teams and creates a schedule of games (once the list reaches 4 teams). 
- The schedule updates when a new team is added and compensates for an even or odd number of teams.
- The add team button changes based on whether there are enough teams to start the season. 
- Once the list reaches 8 teams, the button changes again to a dummy and user cannot enter new teams.
- User can click on a team and manager info will appear.
- User can login (for now, you just click the "secure login" link) and:
  A "Delete Team" button appears at end of manager info.
  A "LogEm" button appears in the schedules for adding scores (This also begins the season, locking out 
  the addition of new teams).
- Adding scores calculates winning percentage for the teams and updates/sorts the league list with a table of 
  each team's wins and losses and winning percentage. The team with the highest winning percentage is listed first.
  The scores also appear in the schedule table in place of the scheduled game time. 
- Fixed sorting bug and No ties and No negative scores functionality
