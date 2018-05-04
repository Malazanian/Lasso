# Metal Friend Finder

Lasso is a mobile round trip route planner for walking in cities and visiting multiple destinations before returning to initial starting point.

**Check it out on your [phone](https://project-1-jfe.firebaseapp.com/)**

## Description

When a user first opens the app, they are prompted to sign in with their Google account.
They can then navigate to the trips tab to see restaurant markers near their location, build a trip for walking to nearby destinations,
and add destinations they want to save to their profile as favorites.

### Trips Tab

The trips tab loads a Google Maps window that shows restaurants within a one mile radius.

- The user can click on any marker and the marker will display the name of the location.
- A window will also appear below that shows a picture for the location and the ability to add a destination, or start the trip.
- The user can add additional destinations by clicking other markers and adding them as destinations before starting the trip.
- Each destination can be favorited by clicking the star button
- Clicking the start trip button builds a round trip from the users current location, and supplies a link to open in Google Maps for step-by-step navigation.

### Profile Tab

The profile tab includes:

- The users profile picture from their Google account
- A search bar where the user can manually add destinations to their favorites
- A list of their favorited restaurants. Clicking on any of the restaraunts in this list will open the location in the Google Maps app.

## Technology Used

- Google Maps Javascript API
- Firebase
- Vue.js
- Materialize CSS

## Future Development

- Allow additional search query terms, so users can navigate to more than restaurants
- Autopopulate search bar on the profile page to pull results from Google Maps
- Rework UI for better user experience
- Handle exceptions for locations where there are a low number of search results
- Allow users to modify search radius and other options

## Authors

[Ian Rutner](https://github.com/Malazanian)
[Joseph Emswiler](https://github.com/josephemswiler)
[Calle LaCouture](https://github.com/celacouture)
[Becky Apo](https://github.com/goalsachiever17)