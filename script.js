// global variables
let apiKey = "1b90528c11f2244a5b4f60002e540947";
let searchInput = document.querySelector("#search-input").value;
let submitBtn = document.querySelector("#search-button");
let url = "http://api.openweathermap.org";



// dom element references

// function display search history
function renderSearchHistory() {

}

// function update hisoty in local storage and update displayed history
function appendToHistory() {

}

// function gte histroy fro local storage
function initSearchHistory() {

}

// function display current weather from api
function renderCurrentWeather(city, weather, timezone) {
    let date = dayjs().tz(timezone).format("M/D/YYYY");
    let temp = weather.temp;
    let wind = weather.wind;
    let humidity = weather.humidity;
    let uvi = weather.uvi;


    // create card listing prpoerties above bootstrp
    let card = document.createElement("div");
    


}
//  function display forecast given an object from weather api
// daily forecast
function renderForecastCard() {

}

// display five day forecast
function renderForecast() {

}

// calls functions to display current weather data
function renderItems(city, data) {
    renderCurrentWeather(city, data.current, data.timezone);
    renderForecastCard(data.daily, data.timezone);

}

// fetches weather data from local from given from weather geo location 
// then calls functions to display current weather data
function fetchWeather(location) {
    let { lat, lon} = location;
    let city = location.name;
    let apiURL = `${url}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;
    fetch(apiURL)
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        renderItems(city, data);
    })
    .catch (function(err){
        console.log(err);
    });
}

function fetchCoords() {
    let apiURL = `${url}/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;
    fetch(apiURL)
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        if(!data [0]){
            alert("City not found!");
        } else{
            appendToHistory(search);
            fetchWeather(data[0]);
        }
    })
    .catch (function(err){
        console.log(err);
    });
}

// event listener functions
function handleSearchFormInit() {
    if(!searchInput.value){
        return;
    }
    let search = searchInput.value.trim();
    fetchCoords(search);
    searchInput.value = "";
}
function handleSearchHistoryClick() {

}

// create two submit buttons
submitBtn.addEventListener("submit", handleSearchFormInit)
// search button and history button