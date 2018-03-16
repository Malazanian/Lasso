$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyD-C8fCk0JV3EVUlXQHGLLpLlg8HJI_Tbw",
        authDomain: "project-1-jfe.firebaseapp.com",
        databaseURL: "https://project-1-jfe.firebaseio.com",
        projectId: "project-1-jfe",
        storageBucket: "project-1-jfe.appspot.com",
        messagingSenderId: "38105637620"
    };
    firebase.initializeApp(config);

    let api = "";
    let searchTerm = "";
    let queryURL = "";

    $(".button-collapse").sideNav();

    queryURL = "" + api + "" + searchTerm

    $.get(queryURL).then(function(response) {
        console.log(response)
    });

})