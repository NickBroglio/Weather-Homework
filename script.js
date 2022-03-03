function weatherFetch(){
    fetch("api.openweathermap.org/data/2.5/forecast?q=Trenton&appid=1b90528c11f2244a5b4f60002e540947")
    .then((response) => response.json())
    .then((data) => console.log(data));
}