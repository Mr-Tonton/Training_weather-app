import { ConverterUtils } from "./ConverterUtils.js";

export class WeatherApp {
    constructor() {

        this.retrieveElements();
        this.setup();
        this.getApiInfo(this.city, this.country, this.apiKey);
    }

    // Variables
    setup() {
        this.apiKey = "f129bc941cdc3428b150db302d547371";
        this.latitude;
        this.longitude;
        this.city = "Lille";
        this.country = "FR";
        this.NumberOfDailyForecast = 6;
    }

    // point elements
    retrieveElements() {
        this.elements = {
            displayCityName: document.getElementById("selected-city"),
            dailyDate: document.getElementById("daily-date"),
            dailyImg: document.getElementById("img-daily"),
            dailyTemp: document.getElementById("temp-value"),
            dailyWind: document.getElementById("wind-value"),
            forecastDate: document.getElementsByClassName("day-forecast"),
            forecastImg: document.getElementsByClassName("img-forecast"),
            forecastTemp: document.getElementsByClassName("temp-forecast"),
            forecastWind: document.getElementsByClassName("wind-forecast"),
            templateLi: document.getElementById("template-li"),
            templateContainer: document.getElementById("template-container"),
        }
    }


    getApiInfo(city, countryIso, key) {
        fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + countryIso + "&appid=" + key)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((locationValue) => {
                this.latitude = locationValue[0].lat;
                this.longitude = locationValue[0].lon;

                fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + this.latitude + "&lon=" + this.longitude + "&exclude=minutely,hourly,alerts&appid=" + key)
                    .then((res) => {
                        if (res.ok) {
                            return res.json();
                        }
                    })
                    .then((weatherValue) => {
                        this.displayDaily(weatherValue.current.dt, locationValue[0].name, weatherValue.current.weather[0].icon, weatherValue.current.weather[0].description, weatherValue.current.temp, weatherValue.current.wind_speed, weatherValue.current.wind_deg);
                        
                        for (let i = 1; i < this.NumberOfDailyForecast; i++) {
                            this.createForecast();
                            this.elements.forecastDate[i - 1].textContent =  new Date(weatherValue.daily[i].dt * 1000).toLocaleDateString();
                            this.elements.forecastImg[i - 1].setAttribute("src", "http://openweathermap.org/img/wn/" + weatherValue.daily[i].weather[0].icon + "@2x.png");
                            this.elements.forecastImg[i - 1].setAttribute("alt", weatherValue.daily[i].weather[0].description);
                            this.elements.forecastTemp[i - 1].textContent = ConverterUtils.kelvinToCelsius(weatherValue.daily[i].temp.day).toFixed(1) + " C°";
                            this.elements.forecastWind[i - 1].textContent = ConverterUtils.mSecondTokmHour(weatherValue.daily[i].wind_speed).toFixed(1) + " km/h | " + ConverterUtils.degreeToDirection(weatherValue.daily[i].wind_deg);
                }


                    })
                    .catch(err => console.log(err.message))

            })
            .catch(err => console.log(err.message))
    }

    // Functions

    displayDaily(date, cityName, imgCode, altText, kelvinTemp, windSpeed, windDegree) {
        this.elements.dailyDate.textContent =  new Date(date * 1000).toLocaleDateString();
        this.elements.displayCityName.textContent = cityName;
        this.elements.dailyImg.setAttribute("src", "http://openweathermap.org/img/wn/" + imgCode + "@2x.png");
        this.elements.dailyImg.setAttribute("alt", altText);
        this.elements.dailyTemp.textContent = ConverterUtils.kelvinToCelsius(kelvinTemp).toFixed(1) + " C°";
        this.elements.dailyWind.textContent = ConverterUtils.mSecondTokmHour(windSpeed).toFixed(1) + " km/h | " + ConverterUtils.degreeToDirection(windDegree);
    }

    createForecast() {
        if ("content" in document.createElement("template")) {
            this.clone = document.importNode(this.elements.templateLi.content, true);
            this.elements.templateContainer.appendChild(this.clone);
        }
    }

    init() {
        this.initControls();
    }

    initControls() {
    }
}