let app = new Vue({
    el: '#gmaps-app',
    data: {
        apikey: "AIzaSyB2IahrwPpyvfygnrvqEa_lP61ri9w3CxY",
        map: "",
        infoWindow: "",
        service: "",
        pos: "",
        currentPlace: "",
        placeDetails: "",
        showButtons: false,
    },
    methods: {
        initMap() {
            this.map = new google.maps.Map(document.getElementById('gmaps-app'), {
                center: {
                    lat: 30.307182,
                    lng: -97.755996
                },
                zoom: 14,
            });
            this.infoWindow = new google.maps.InfoWindow;

            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    app.pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    app.infoWindow.setPosition(app.pos);
                    app.map.setCenter(app.pos);
                    let request = {
                        location: app.pos,
                        radius: '1609',
                        keyword: 'restaurant',
                        query: 'restaurant'
                    };
                    app.service = new google.maps.places.PlacesService(app.map);
                    app.service.nearbySearch(request, app.callback);
                },
                function () {
                    handleLocationError(true, this.infoWindow, this.map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, this.infoWindow, this.map.getCenter());
            }
        },

        callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
                    let place = results[i];
                    this.createMarker(results[i]);
                }
            }
        },

        createMarker(place) {
            let placeLoc = place.geometry.location;
            let marker = new google.maps.Marker({
                map: this.map,
                position: place.geometry.location,
            });
            google.maps.event.addListener(marker, 'click', function() {
                // Ugly fix for showing the card content and keeping the click handler working across the different vue elements
                placeDetailsApp.markerClicked = true;
                addDestination.showButtons = true;
                app.showButtons = true;
                let request = {
                    placeId: place.place_id
                };
                app._data.service.getDetails(request, function (place, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        app.placeDetails = place;
                        app.currentPlace = request;
                        app.infoWindow.setContent('<div><strong>' + place.name + '</strong><br>');
                        app.infoWindow.open(app.map, marker);
                        placeDetailsApp.showPlaceDetails(place);
                    }
                });
            });
        },

        handleLocationError(browserHasGeolocation, infoWindow, pos) {
            this.infoWindow.setPosition(pos);
            this.infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            this.infoWindow.open(this.map);
        },
    }
})

function gmapsCallback(){
    app.initMap()
}

let placeDetailsApp = new Vue({
    el: '#place-details',
    data: {
        placeDetails: [
            { id: 0, text: "" }, // name
            { id: 1, text: "" }, // address
            { id: 2, text: "" }, // phone number
            { id: 3, text: "" }, // rating
            { id: 4, text: "" }, // website
            { id: 5, text: "" } // photo
        ],
        markerClicked: false,
    },
    methods: {
        showPlaceDetails(place) {
            this.placeDetails[0].text = place.name;
            // this.placeDetails[1].text = "Address: " + place.formatted_address;
            // this.placeDetails[2].text = "Phone number: " + place.formatted_phone_number;
            // this.placeDetails[3].text = "Rating: " + place.rating;
            // this.placeDetails[4].text = "Website: " + place.website;
            this.placeDetails[5].src = place.photos ? place.photos[0].getUrl({maxWidth : 300, maxHeight : 300}) : null;
        }
    }
})
