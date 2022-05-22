import { Utils } from "./ConverterUtils.js";

export class WeatherApp {
    constructor() {

        this.retrieveElements();
        this.setup();
    }

    // Variables
    setup() {
        this.apiKey = "f129bc941cdc3428b150db302d547371";
        this.latitude;
        this.longitude;
        this.city = "Lille";
        this.country = "FR";
    }

    // point elements
    retrieveElements() {
        this.elements = {
            displayCityName : document.getElementById("selected-city"),
            dailyImg : document.getElementById("img-daily"),
            dailyTemp : document.getElementById("temp-value"),
            dailyWind : document.getElementById("wind-value"),
            imgForecast : document.getElementsByClassName("img-forecast"),
            forecastTemp : document.getElementsByClassName("temp-forecast"),
            forecastWind : document.getElementsByClassName("wind-forecast"),
        }
    }
    

    getApiInfo(city, iso, key) {
        fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + iso + "&appid=" + key)
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((value) => {
            this.latitude = value[0].lat;
            this.longitude = value[0].lon;

            fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + this.latitude + "&lon=" + this.longitude + "&appid=" + key)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((value) => {
                console.log(value);
                this.displayDaily(value.name, value.weather[0].icon, value.weather[0].description, value.main.temp, value.wind.speed, value.wind.deg);
            })
            .catch(err => console.log(err.message))

            fetch("http://api.openweathermap.org/data/2.5/forecast?lat=" + this.latitude + "&lon=" + this.longitude + "&appid=" + key)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((value) => {
                console.log(value);
            })
            .catch(err => console.log(err.message))
        })
        .catch(err => console.log(err.message))
    }

    // Functions

    displayDaily(cityName, imgCode, altText, kelvinTemp, windSpeed, windDegree) {
        this.elements.displayCityName.textContent = cityName;
        this.elements.dailyImg.setAttribute("src", "http://openweathermap.org/img/wn/"+ imgCode + "@2x.png");
        this.elements.dailyImg.setAttribute("alt", altText);
        this.elements.dailyTemp.textContent = Utils.kelvinToCelsius(kelvinTemp).toFixed(1) + " C°";
        this.elements.dailyWind.textContent = Utils.secondToKilometer(windSpeed).toFixed(1) + " km/h | " + Utils.degreeToDirection(windDegree);
    }

    init() {
        this.initControls();
    }

    initControls() {
        this.getApiInfo(this.city, this.country, this.apiKey);
    }
}