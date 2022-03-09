// global variables
let apiKey = "1b90528c11f2244a5b4f60002e540947";
let searchInput = document.querySelector("#search-input");
let submitBtn = document.querySelector("#search-button");
let url = "https://api.openweathermap.org";
let currentWeatherBox = document.querySelector("#today-weather");
let containerFiveDay = document.querySelector("#container-day");
let recentSearches = [];
let searchHistory = document.querySelector("#search-history");

// function gets history from local storage
function initSearchHistory(search) {
    let getHistory = localStorage.getItem("recentSearches");
    if (getHistory) {
        recentSearches = JSON.parse(getHistory);
    }
    renderSearchHistory();
}

// created and appended a button for clickable use for recent searches
function renderSearchHistory() {
    searchHistory.innerHTML = '';
    for (let i = 0; i < recentSearches.length; i++) {
        let recentBtn = document.createElement("button");
        recentBtn.setAttribute("type", "button");
        recentBtn.classList.add("history-btn", "btn-history");
        recentBtn.setAttribute("data-search", recentSearches[i]);
        recentBtn.textContent = recentSearches[i];
        searchHistory.append(recentBtn);
    }
}

// function display current weather from api
function renderCurrentWeather(city, weather) {

    // clears the container for the most recent searches
    currentWeatherBox.innerHTML = ''

    // created variables for the data from weather api
    let date = moment.unix(weather.dt).format("MM/DD/YYYY");
    let icon = weather.weather[0].icon;
    let image = "http://openweathermap.org/img/w/" + icon + ".png";
    let temp = weather.temp;
    let wind = weather.wind_speed;
    let humidity = weather.humidity;
    let uvi = weather.uvi;

    // created element for weather from api
    let card = document.createElement("div");
    let cardCity = document.createElement("h3");
    let cardDate = document.createElement("h5");
    let cardImg = document.createElement("img");
    let cardTemp = document.createElement("p");
    let cardWind = document.createElement("p");
    let cardHumidity = document.createElement("p");
    let cardUvi = document.createElement("p");

    // changes the uvi background color depending on the uv index
    if (uvi < 1) {
        // green
        cardUvi.setAttribute("class", "green-uvi");
    } else if (uvi < 2) {
        // yellow
        cardUvi.setAttribute("class", "yellow-uvi");
    } else {
        // red
        cardUvi.setAttribute("class", "red-uvi");
    }

    // added data to the elements I created
    cardDate.textContent = date;
    cardCity.textContent = city;
    cardTemp.textContent = "Temp: " + temp + "\xB0F";
    cardWind.textContent = "Wind: " + wind + " MPH";
    cardHumidity.textContent = "Humidity: " + humidity + " %";
    cardUvi.textContent = "UV: " + uvi;
    cardImg.setAttribute("src", image);

    // appending the data to te actual page
    card.append(cardCity, cardDate, cardImg, cardTemp, cardWind, cardHumidity, cardUvi);
    currentWeatherBox.append(card);
}

// function display forecast given an object from weather api
function renderForecast(daily, timezone) {

    // clears the container for the most recent searches
    containerFiveDay.innerHTML = ''

    // for loop to grab 5 days of weather
    for (let i = 1; i < 6; i++) {
        const singleDay = daily[i];
        let date = singleDay.dt;
        let icon = singleDay.weather[0].icon;
        let image = "http://openweathermap.org/img/w/" + icon + ".png";
        let temp = singleDay.temp.day;
        let wind = singleDay.wind_speed;
        let humidity = singleDay.humidity;

        // created element for weather from api
        let card = document.createElement("div");
        let cardDate = document.createElement("h5");
        let cardImg = document.createElement("img");
        let cardTemp = document.createElement("p");
        let cardWind = document.createElement("p");
        let cardHumidity = document.createElement("p");

        // added data to the elements i created
        cardDate.textContent = moment.unix(date).format("MM/DD/YYYY");
        cardTemp.textContent = "Temp: " + temp + " \xB0F";
        cardWind.textContent = "Wind: " + wind + " MPH";
        cardHumidity.textContent = "Humidity: " + humidity + "%";
        cardImg.setAttribute("src", image);

        // appending the data to te actual page
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

    // sets variables to find the location of the searched city
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

// gets empty array to store the recent searches and pushes them as a string in the array
function appendHistory(search) {
    if (recentSearches.indexOf(search) !== -1) {
        return;
    }
    recentSearches.push(search);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    renderSearchHistory();
}

// fetches the coordinates fro the location searched and gathers weather
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
                appendHistory(search);
                fetchWeather(data[0]);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

// event listener functions
function searchFormInit(event) {
    event.preventDefault();
    if (!searchInput.value) {
        return;
    }
    let search = searchInput.value.trim();
    fetchCoords(search);
    searchInput.value = "";
}

// this makes the recent search histor buttons clickable
function clickHistory(event) {
    // event.preventDefault();
    if (!event.target.matches(".btn-history")) {
        return;
    }
    let btn = event.target;
    let search = btn.getAttribute("data-search");
    fetchCoords(search);
}
// create two submit buttons
submitBtn.addEventListener("click", searchFormInit);
searchHistory.addEventListener("click", clickHistory);

// save recent searches to local storage, when clicked get weather again
initSearchHistory();