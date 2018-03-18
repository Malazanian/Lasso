let addDestination = new Vue({
    el: '#add-destination',
    data: {
        waypoints: [],
        totalDistance: 0,
        routeResult: {},
    },
    methods: {
        addDest: function (placeId) {
            // this.waypoints.push({ "location": app.currentPlace.placeId });
            // numWaypoints++;
            this.waypoints.push({
                location: app.currentPlace,
                stopover: true,
            });

            // this.waypoints.push(app.currentPlace);
        },

        getPOI() {
            let directionsService = new google.maps.DirectionsService();
            let directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(app.map);
            this.calcRoute(directionsService, directionsDisplay);
        },

        calcRoute(directionsService, directionsDisplay) {
            console.log("calcRoute being called")
            // let start = addDestination.waypoints[0].location;
            // let end = addDestination.waypoints[1]
            let start = app.pos;
            let end = app.pos;
            let request = {
                origin: start,
                destination: end,
                waypoints: this.waypoints,
                optimizeWaypoints: true,
                travelMode: 'WALKING',
            };
            directionsService.route(request, function (result, status) {
                console.log("This is the result: ", result);
                console.log("This is the status: ", status);
                if (status == 'OK') {
                    directionsDisplay.setDirections(result);
                    console.log("Directions results: ", result)
                    addDestination.routeResult = result;
                    computeTotalDistance.computeTotalDistance(result);
                    googleMapsLink.buildMapsLink();
                }
            });
        }
    }
});

let computeTotalDistance = new Vue({
    el: '#total-distance',
    data: {
        totalDistance: "",
    },
    methods: {
        computeTotalDistance(result) {
            let total = 0;
            let myroute = result.routes[0];
            for (let i = 0; i < myroute.legs.length; i++) {
              total += myroute.legs[i].distance.value;
            }
            // Convert distance.value (always in meters) to miles
            function getMiles(meters) {
                return (meters * 0.000621371192).toFixed(2);
            }
            total = getMiles(total);
            this.totalDistance = "Total trip distance: " + total + " miles";
        }
    }
});

// Build a link to open step-by-step navigation in google maps with the selected route:
let googleMapsLink = new Vue({
    el: '#google-maps-link',
    data: {
        addedWaypoints: "&waypoints=",
        addedWaypointPlaceIds: "&waypoint_place_ids=",
        googleMapsBuiltLink: "https://www.google.com/maps/dir/?api=1&origin=",
    },
    methods: {
        buildMapsLink() {
            let startingPoint = addDestination.routeResult.routes["0"].legs["0"].start_address;
            let endingPoint = "&destination=" + addDestination.routeResult.routes["0"].legs["0"].start_address + "&travelmode=walking";
            // Iterate through the routes and build the waypoint address string
            for (let i = 0; i < addDestination.routeResult.routes["0"].legs.length; i++) {
                this.addedWaypoints += encodeURIComponent(addDestination.routeResult.routes["0"].legs[i].start_address)
                // Separate each waypoint with a pipe, URI encoded
                if (i < addDestination.routeResult.routes["0"].legs.length - 1) {
                    this.addedWaypoints += "%7"
                }
            }
            // Iterate through the waypoints and build the placeId string
            for (let j = 0; j < addDestination.waypoints.length; j++) {
                this.addedWaypointPlaceIds += addDestination.waypoints[j].location.placeId;
                // Separate each placeId with a pipe, URI encoded
                if (j < addDestination.waypoints.length - 1) {
                    this.addedWaypointPlaceIds += "%7";
                }
            }
            // Add the starting point, waypoint address strings, and waypoint placeId strings, and destination
            this.googleMapsBuiltLink += startingPoint + endingPoint + this.addedWaypoints + this.addedWaypointPlaceIds
        }
    }
});

// origin=Paris,France&destination=Cherbourg,France&travelmode=driving
// &waypoints=Versailles,France%7CChartres,France%7CLe+Mans,France%7CCaen,France
// &waypoint_place_ids=ChIJdUyx15R95kcRj85ZX8H8OAU%7CChIJKzGHdEgM5EcR_OBTT3nQoEA%7CChIJG2LvQNCI4kcRKXNoAsPi1Mc%7CChIJ06tnGbxCCkgRsfNjEQMwUsc

// let googleMapsLink = "https://www.google.com/maps/dir/?api=1&origin=" + startingPoint