// global variables
let apiKey = "1b90528c11f2244a5b4f60002e540947";
let searchInput = document.querySelector("#search-input");
let submitBtn = document.querySelector("#search-button");
let url = "http://api.openweathermap.org";
let currentWeatherBox = document.querySelector("#today-weather");
let containerFiveDay = document.querySelector("#container-day");
let cityArray = [];

// function display search history
function renderSearchHistory() {
    localStorage.setItem("search")
}

// function update hisoty in local storage and update displayed history
function appendToHistory() {

}

// function gte histroy fro local storage
function initSearchHistory() {

}

// function display current weather from api
function renderCurrentWeather(city, weather, timezone) {
    let date = moment("YYYY-MM-DD");
    let icon = weather.weather[0].icon;
    let image = "http://openweathermap.org/img/w/" + icon + ".png";
    let temp = weather.temp;
    let wind = weather.wind_speed;
    let humidity = weather.humidity;
    let uvi = weather.uvi;

    let card = document.createElement("div");
    let cardCity = document.createElement("h3");
    let cardDate = document.createElement("h5");
    let cardImg = document.createElement("img");
    let cardTemp = document.createElement("p");
    let cardWind = document.createElement("p");
    let cardHumidity = document.createElement("p");
    let cardUvi = document.createElement("p");

    cardDate.textContent = date;
    cardCity.textContent = city;
    cardTemp.textContent = "Temp: " + temp + "\xB0F";
    cardWind.textContent = "Wind: " + wind + " MPH";
    cardHumidity.textContent = "Humidity: " + humidity + " %";
    cardUvi.textContent = "UV: " + uvi;

    cardImg.setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png")

    card.append(cardCity, cardImg, cardTemp, cardWind, cardHumidity, cardUvi);
    currentWeatherBox.append(card);


}
// function display forecast given an object from weather api
// daily forecast
function renderForecast(daily, timezone) {
    for (let i = 1; i < 6; i++) {
        const singleDay = daily[i];
        let date = singleDay.dt;
        let icon = singleDay.weather[0].icon;
        let image = "http://openweathermap.org/img/w/" + icon + ".png";
        let temp = singleDay.temp.day;
        let wind = singleDay.wind_speed;
        let humidity = singleDay.humidity;

        let card = document.createElement("div");
        let cardDate = document.createElement("h5");
        let cardImg = document.createElement("img");
        let cardTemp = document.createElement("p");
        let cardWind = document.createElement("p");
        let cardHumidity = document.createElement("p");


        cardDate.textContent = moment.unix(date).format("MM/DD/YYYY");
        cardTemp.textContent = "Temp: " + temp + " \xB0F";
        cardWind.textContent = "Wind: " + wind + " MPH";
        cardHumidity.textContent = "Humidity: " + humidity + "%";


        cardImg.setAttribute("src", image);

        card.append(cardDate, cardImg, cardTemp, cardWind, cardHumidity);
        containerFiveDay.append(card);


    }
}



// calls functions to display current weather data
function renderItems(city, data) {
    renderCurrentWeather(city, data.current, data.timezone);
    renderForecast(data.daily, data.timezone);

}

// fetches weather data from local from given from weather geo location 
// then calls functions to display current weather data
function fetchWeather(location) {
    let { lat, lon } = location;
    let city = location.name;
    let apiURL = `${url}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;
    fetch(apiURL)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data)
            renderItems(city, data);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function fetchCoords(search) {
    let apiURL = `${url}/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;
    fetch(apiURL)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (!data[0]) {
                alert("City not found!");
            } else {
                appendToHistory(search);
                fetchWeather(data[0]);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

// event listener functions
function handleSearchFormInit(event) {
    event.preventDefault();
    if (!searchInput.value) {
        return;
    }
    let search = searchInput.value.trim();
    fetchCoords(search);
    searchInput.value = "";
}
function handleSearchHistoryClick() {

}
// create two submit buttons
submitBtn.addEventListener("click", handleSearchFormInit)
// search button and history button




// style boxes
// convert date time to date in js
// for current weather show date/dt
// condtional logic for uvi for current weather
// save recent searches to local storage, when clicked get weather again