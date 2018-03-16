let app = new Vue({
    el: '#gmaps-app',
    data: {
        map: "",
        infoWindow: "",
    },
    methods: {
        initMap() {
            this.map = new google.maps.Map(document.getElementById('gmaps-app'), {
                center: {
                    lat: -34.397,
                    lng: 150.644
                },
                zoom: 6
            });
            this.infoWindow = new google.maps.InfoWindow;

            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    let pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    app._data.infoWindow.setPosition(pos);
                    app._data.infoWindow.setContent('Location found.');
                    app._data.infoWindow.open(app._data.map);
                    app._data.map.setCenter(pos);
                }, function () {
                    handleLocationError(true, this.infoWindow, this.map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, this.infoWindow, this.map.getCenter());
            }
        },
        handleLocationError(browserHasGeolocation, infoWindow, pos) {
            this.infoWindow.setPosition(pos);
            this.infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            this.infoWindow.open(this.map);
        }
    }
})

function gmapsCallback(){
    app.initMap()
}
console.log(app)