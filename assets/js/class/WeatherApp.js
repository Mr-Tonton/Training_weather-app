class WeatherApp {
    constructor() {
        this.selectedCity = document.getElementById("selected-city");

        this.apiKey = "f129bc941cdc3428b150db302d547371";
        this.city = "Lille";
        this.country = "FR";
        this.latitude;
        this.longitude;
    }

    // ----- Functions -----

    kelvinToCelsius = (kelvin) => {
        return kelvin - 273.15;
    }

    getPositionCity(city, iso, key) {
        return fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + iso + "&appid=" + key)
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((value) => {
            console.log(value);
            this.latitude = value[0].lat;
            this.longitude = value[0].lon;

            this.getWeatherInfo(this.latitude, this.longitude, this.apiKey);
        })
        .catch(err => console.log(err.message))
    }

    getWeatherInfo(lat, lon, key) {
        return fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + key)
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((value) => {
            console.log(value);
        })
        .catch(err => console.log(err.message))
    }

    init() {
        this.initControls();
    }

    initControls() {
        this.getPositionCity(this.city, this.country, this.apiKey);
        this.selectedCity.textContent = this.city + ", " + this.country;
    }
}




export default WeatherApp;