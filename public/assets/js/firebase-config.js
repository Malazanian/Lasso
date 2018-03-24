(function () {

    var config = {
        apiKey: "AIzaSyD-C8fCk0JV3EVUlXQHGLLpLlg8HJI_Tbw",
        authDomain: "project-1-jfe.firebaseapp.com",
        databaseURL: "https://project-1-jfe.firebaseio.com",
        projectId: "project-1-jfe",
        storageBucket: "project-1-jfe.appspot.com",
        messagingSenderId: "38105637620"
    };
    firebase.initializeApp(config);

    let database = firebase.database();
    let localUser = new Object();
    let currentFavorites = [];
    let emailKey = "";
    let passedName = "";

    //add places from google api to loadPlaces function

    //   let placeList = addDestination.waypoints;

    //Google login
    $('.google-login').click(function () {

        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function (result) {

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            let name = user.email.substr(0, user.email.indexOf('@'));

            currentUserName = name;

        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
        });
    }) //Google login

    function userSetup(currentUser) {

        $('.profile-img').attr('src', currentUser.photoURL);

        $('.profile-name').text(currentUser.displayName);

        emailKey = currentUser.email.substr(0, currentUser.email.indexOf('@'));

        database.ref('users/' + emailKey).on('value', function (snap) {
            let data = snap.val()
            if (!data) {
                database.ref('users/' + emailKey).set({
                    name: currentUser.displayName,
                    isActive: false,
                    authenticated: false
                });
            }
        })

        localUser = JSON.parse(localStorage.getItem('firebase:authUser:' + currentUser.G + ':[DEFAULT]'));

        if (currentUser.G) {
            database.ref('users/' + emailKey).onDisconnect().update({
                isActive: false
            })
        }
    }

    function favBtns() {

        $('.poi-collection').empty();

        if (localUser.email) {

            emailKey = localUser.email.substr(0, localUser.email.indexOf('@'));

            database.ref('users/' + emailKey + '/favoritePlaces/').off("value")
            database.ref('users/' + emailKey + '/favoritePlaces/').on("value", function (snap) {

                snap.forEach(function (data) {

                    database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).off("value")
                    database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).on("value", function (snap) {
                        if (currentFavorites.includes(snap.val())) {} else {
                            currentFavorites.push(snap.val())
                        }
                    });
                });
            });
        }

        for (var i = 0; i < currentFavorites.length; i++) {

            let div = $('<div>')
                .addClass('container-fluid poi-div')
            let anchor = $('<a>')
                .addClass('waves-effect waves-light grey lighten-4 grey-text text-darken-1 btn-large poi-anchor')
            let close = $('<i>')
                .addClass('material-icons close right')
                .text('close')
            let star = $('<i>')
                .addClass('material-icons left deep-orange-text text-lighten-1 fav-star')
                .text('star')
            let place = $('<i>')
                .addClass('material-icons left place-marker cyan-text text-lighten-1')
                .text('place')
            let p = $('<p>')
                .addClass('left')
                .text(currentFavorites[i])

            anchor.append(close).append(star).append(place).append(p)

            div.append(anchor)

            $('.poi-collection').append(div)

        }
    } //favBtns

    $('.profile-link').click(function () {
        favBtns();

    });

    function newBtn() {
        let input = $('.validate').val().trim();

        if (input === '') {
            return
        }

        let div = $('<div>')
            .addClass('container-fluid poi-div')
        let anchor = $('<a>')
            .addClass('waves-effect waves-light grey lighten-4 grey-text text-darken-1 btn-large poi-anchor')
        let close = $('<i>')
            .addClass('material-icons close right')
            .text('close')
        let star = $('<i>')
            .addClass('material-icons left deep-orange-text text-lighten-1 fav-star')
            .text('star')
        let place = $('<i>')
            .addClass('material-icons left place-marker cyan-text text-lighten-1')
            .text('place')
        let p = $('<p>')
            .addClass('left')
            .text(input)

        anchor.append(close).append(star).append(place).append(p);

        div.append(anchor);

        $('.poi-collection').append(div);

        database.ref('users/' + emailKey + '/favoritePlaces/').push(input);

        currentFavorites.push(input);

        $('.validate').val('');
    }


    $(document).on('click', '.start-trip', function () {
        $('.dist').css({
            display: 'block'
        })
    });

    $(document).on('click', '.add-dest', function () {

        console.log($('ol:first-child span').first().text())

        loadPlaces($('ol:first-child span').first().text());

    });

    function loadPlaces(btnText) { //here

        let div = $('<div>')
            .addClass('container-fluid poi-div')
        let anchor = $('<a>')
            .addClass('waves-effect waves-light grey lighten-4 grey-text text-darken-1 btn-large poi-anchor')
        let close = $('<i>')
            .addClass('material-icons close right')
            .text('close')
        let star = $('<i>')
            .addClass('material-icons left grey-text text-darken-1 fav-star new-star')
            .text('star_border')
        let place = $('<i>')
            .addClass('material-icons left place-marker cyan-text text-lighten-1')
            .text('place')
        let p = $('<p>')
            .addClass('left')
            .text(btnText)

        anchor.append(close).append(star).append(place).append(p)

        div.append(anchor)

        $('.places-wrapper').append(div)
    }

    $('.add-form').submit(function (event) {

        event.preventDefault();

        newBtn();
    });

    $('.add-btn').click(function (event) {

        event.preventDefault();

        newBtn();
    })

    //Sign out of current login
    $('.signout').click(function () {

        emailKey = localUser.email.substr(0, localUser.email.indexOf('@'));

        firebase.auth().signOut().then(function () {

            database.ref('users/' + emailKey).update({
                isActive: false,
                authenticated: false
            })
        }).catch(function (error) {
            // An error happened.
        });
    }) //Sign out of current login

    //listen for state change
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $('.signout')
                .css('display', 'inline-block')

            $('.google-login').css('display', 'none');

            $('.auth-message').text("You are signed in with Google as " + user.displayName + ".")

            $('.trip-tab').removeClass('disabled')
            $('.trip-tab a').addClass('active')
            $('.profile-tab').removeClass('disabled')
            $('.auth-tab a').removeClass('active').text('Sign Out')

            userSetup(user);

            favBtns();

            emailKey = user.email.substr(0, user.email.indexOf('@'));

            database.ref('users/' + emailKey).update({
                isActive: true,
                authenticated: true
            })

        } else {
            $('.google-login')
                .css('display', 'inline-block')

            $('.signout').css('display', 'none');

            $('.auth-message').text("Sign in with your Google Account.")

            $('.trip-tab').addClass('disabled')
            $('.trip-tab a').removeClass('active')
            $('.profile-tab').addClass('disabled')
            $('.auth-tab a').addClass('active').text('Sign In')

        }
    }); //listen for state change

    $(document).on('click', '.fav-star', function () {

        let text = ($(this).parent().find('p').text());

        if ($(this).hasClass('grey-text')) {

            $(this)
                .removeClass('grey-text text-darken-1')
                .addClass('deep-orange-text text-lighten-1')
                .text('star')

            if ($('.new-star').parent().find('p').text() === text) {
                $('.new-star')
                    .removeClass('grey-text text-darken-1')
                    .addClass('deep-orange-text text-lighten-1')
                    .text('star')
            }

            emailKey = localUser.email.substr(0, localUser.email.indexOf('@'));

            database.ref('users/' + emailKey + '/favoritePlaces/').off("value")
            database.ref('users/' + emailKey + '/favoritePlaces/').on("value", function (snap) {

                snap.forEach(function (data) {

                    database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).off("value")
                    database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).on("value", function (snap) {
                        if (currentFavorites.includes(snap.val())) {} else {
                            currentFavorites.push(snap.val())
                        }
                    });
                });
            });

            if (currentFavorites.includes(text)) {

            } else {

                database.ref('users/' + emailKey + '/favoritePlaces/').push(text)
            }
        } else {

            $(this)
                .removeClass('deep-orange-text text-lighten-1')
                .addClass('grey-text text-darken-1')
                .text('star_border')

            if ($('.new-star').parent().find('p').text() === text) {
                $('.new-star')
                    .removeClass('deep-orange-text text-lighten-1')
                    .addClass('grey-text text-darken-1')
                    .text('star_border')
            }

            currentFavorites.splice(currentFavorites.indexOf(text), 1);

            database.ref('users/' + emailKey + '/favoritePlaces/').off("value")
            database.ref('users/' + emailKey + '/favoritePlaces/').on("value", function (snap) {

                snap.forEach(function (data) {

                    database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).off("value")
                    database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).on("value", function (snap) {

                        if (text === (snap.val())) {

                            database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).remove();

                        } else {}
                    });
                });
            });
        }
    })

    $(document).on('click', '.close', function () {

        let text = ($(this).parent().find('p').text());

        emailKey = localUser.email.substr(0, localUser.email.indexOf('@'));

        currentFavorites.splice(currentFavorites.indexOf(text), 1);

        database.ref('users/' + emailKey + '/favoritePlaces/').off("value")
        database.ref('users/' + emailKey + '/favoritePlaces/').on("value", function (snap) {

            snap.forEach(function (data) {

                database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).off("value")
                database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).on("value", function (snap) {

                    if (text === (snap.val())) {

                        database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).remove();

                    } else {}
                });
            });
        });
        $(this).parent().remove();
    });

    $(document).on('click', '.poi-anchor p', function () {
        let favoriteLocation = encodeURIComponent($(this).text());
        let googleMapsPlaceLink = "https://maps.google.com/?q=" + favoriteLocation;
        window.open(googleMapsPlaceLink, '_blank');
    });
})()
