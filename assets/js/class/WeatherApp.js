import { ConverterUtils } from "./ConverterUtils.js";

export class WeatherApp {
    constructor() {

        this.retrieveElements();
        this.setup();
        this.getLocationInfo(this.city, this.country, this.apiKey);

    }

    // Variables
    setup() {
        this.apiKey = "8234551b3fa468e57440f9d04d857191";
        this.latitude;
        this.longitude;
        this.city = "Lille";
        this.country = "FR";
        this.NumberOfDailyForecast = 6;
        this.displayAlertTime = 3000;
        this.delayForGeoRequest = 300;
    }

    // point elements
    retrieveElements() {
        this.elements = {
            searchContainer: document.getElementById("search-container"),
            errorMsg: document.getElementById("error-msg"),
            researchInput: document.getElementById("research-input"),
            researchBtn: document.getElementById("research-btn"),
            geolocBtn: document.getElementById("geoloc-btn"),
            displayCityName: document.getElementById("selected-city"),
            displayCountryName: document.getElementById("selected-country"),
            dailyDate: document.getElementById("daily-date"),
            dailyImg: document.getElementById("img-daily"),
            dailyTemp: document.getElementById("temp-value"),
            dailyWind: document.getElementById("wind-value"),
            templateLi: document.getElementById("template-li"),
            templateContainer: document.getElementById("template-container"),
            forecastDate: document.getElementsByClassName("day-forecast"),
            forecastImg: document.getElementsByClassName("img-forecast"),
            forecastTemp: document.getElementsByClassName("temp-forecast"),
            forecastWind: document.getElementsByClassName("wind-forecast"),
        }
    }

    getLocationInfo(city, countryIso, apiKey) {
        fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + countryIso + "&appid=" + apiKey)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((locationValue) => {
                this.city = locationValue[0].name;
                this.country = locationValue[0].country;
                this.latitude = locationValue[0].lat;
                this.longitude = locationValue[0].lon;
                this.elements.errorMsg.classList.remove("active");

                this.getWeatherInfo(this.latitude, this.longitude, this.apiKey);
            })
            .catch((err) => {
                this.displayAlertMsg();
                console.log(err);
            })
    }


    getWeatherInfo(latitude, longitude, apiKey) {
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&appid=" + apiKey)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((weatherValue) => {
                this.displayDaily(weatherValue.current.dt, this.city , this.country, weatherValue.current.weather[0].icon, weatherValue.current.weather[0].description, weatherValue.current.temp, weatherValue.current.wind_speed, weatherValue.current.wind_deg);

                for (let i = 1; i < this.NumberOfDailyForecast; i++) {
                    this.createForecast();
                    this.elements.forecastDate[i - 1].textContent = new Date(weatherValue.daily[i].dt * 1000).toLocaleDateString();
                    this.elements.forecastImg[i - 1].setAttribute("src", "http://openweathermap.org/img/wn/" + weatherValue.daily[i].weather[0].icon + "@2x.png");
                    this.elements.forecastImg[i - 1].setAttribute("alt", weatherValue.daily[i].weather[0].description);
                    this.elements.forecastTemp[i - 1].textContent = ConverterUtils.kelvinToCelsius(weatherValue.daily[i].temp.day).toFixed(1) + " C°";
                    this.elements.forecastWind[i - 1].textContent = ConverterUtils.mSecondTokmHour(weatherValue.daily[i].wind_speed).toFixed(1) + " km/h | " + ConverterUtils.degreeToDirection(weatherValue.daily[i].wind_deg);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    getCityWithGeoLoc(latitude, longitude, apiKey) {
        fetch("http://api.openweathermap.org/geo/1.0/reverse?lat=" + latitude + "&lon=" + longitude + "&limit=" + 1 + "&appid=" + apiKey)
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((data) => {
            this.city = data[0].name;
            this.country = data[0].country;
            this.elements.errorMsg.classList.remove("active");
        })
        .catch((err) => {
            console.log(err);
        })
    }



    // Functions

    displayDaily(date, cityName, countryName, imgCode, altText, kelvinTemp, windSpeed, windDegree) {
        this.elements.dailyDate.textContent = new Date(date * 1000).toLocaleDateString();
        this.elements.displayCityName.textContent = cityName;
        this.elements.displayCountryName.textContent = " ( " + countryName + " )";
        this.elements.dailyImg.setAttribute("src", "http://openweathermap.org/img/wn/" + imgCode + "@2x.png");
        this.elements.dailyImg.setAttribute("alt", altText);
        this.elements.dailyTemp.textContent = ConverterUtils.kelvinToCelsius(kelvinTemp).toFixed(1) + " C°";
        this.elements.dailyWind.textContent = ConverterUtils.mSecondTokmHour(windSpeed).toFixed(1) + " km/h | " + ConverterUtils.degreeToDirection(windDegree);
        this.elements.researchInput.value = "";
    }

    createForecast() {
        if ("content" in document.createElement("template")
            && document.querySelectorAll("ul#template-container li").length < this.NumberOfDailyForecast - 1) {
            this.clone = document.importNode(this.elements.templateLi.content, true);
            this.elements.templateContainer.appendChild(this.clone);
        }
    }

    displayAlertMsg() {
        this.elements.searchContainer.classList.add("wrong-input");
        this.elements.errorMsg.classList.add("active");
        setTimeout(() => {
            this.elements.searchContainer.classList.remove("wrong-input");
        }, this.displayAlertTime);
    }

    init() {
        this.initControls();
    }

    initControls() {

        this.elements.researchInput.addEventListener("change", (e) => {
            let entrieToArray = (e.target.value).split(",");
            let formatEntrie = entrieToArray.map((entrie) => entrie.trim());
            this.city = formatEntrie[0];
            this.country = formatEntrie[1];
        })

        this.elements.researchBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.getLocationInfo(this.city, this.country, this.apiKey);
        })

        this.elements.geolocBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.getCityWithGeoLoc(this.latitude, this.longitude, this.apiKey);
                    setTimeout(() => {
                        this.getWeatherInfo(this.latitude, this.longitude, this.apiKey);
                    }, this.delayForGeoRequest) 
                });
            }
        })
    }
}
