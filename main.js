const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const locationElement = document.querySelector(".location p");

const weather = {};

weather.temperature = {
  unit: "celsius"
}

const KELVIN = 273;

// API KEY
const key = "82005d27a116c2880c8f0fcb866998a0";

const API_URL = "http://api.openweathermap.org/data/2.5/weather";

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(setPosition, () => {
    if (localStorage.getItem("tempUnit") !== null) {
      const unit = localStorage.getItem("tempUnit");
      if (unit === "C") {
        setCelsiusValue("")
      } else {
        setFahrenheitValue("");
      }
    } else {
      setLocalStorageValue("C")
      setCelsiusValue("");
    }
  });
} else {
  console.log("Geolocation is not supported by this browser.");
}

function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude);
}

function getWeather(latitude, longitude) {
  let api = API_URL + `?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then(result => result.json())
    .then(setWeatherData)
    .then(displayWeather);
}

function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  if (localStorage.getItem("tempUnit") !== null) {
    const tempUnit = localStorage.getItem("tempUnit");
    if (tempUnit === "C") {
      setCelsiusValue(weather.temperature.value);
    } else {
      let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
      fahrenheit = Math.floor(fahrenheit);
      setFahrenheitValue(fahrenheit);
    }
} else {
  setLocalStorageValue("C");
  setCelsiusValue(weather.temperature.value);
}

locationElement.innerHTML = `${weather.city}, ${weather.country}`;

}

function searchtWeatherByCity(city) {
  fetch(API_URL + `?q=${city}&APPID=${key}&units}`)
    .then(result => result.json())
    .then(setWeatherData)
    .then(displayWeather);
};

function setWeatherData(data) {
  weather.temperature.value = Math.floor(data.main.temp - KELVIN);
  weather.iconId = data.weather[0].icon;
  weather.city = data.name;
  weather.country = data.sys.country;
}

function setLocalStorageValue(value) {
  localStorage.setItem("tempUnit", value);
}

document.getElementById("searchBtn").addEventListener("click", () => {
  let city = document.getElementById("searchInput").value;
  if (city)
    searchtWeatherByCity(city);
})

function celsiusToFahrenheit(temperature) {
  return (temperature * 9 / 5) + 32;
}

tempElement.addEventListener("click", () => {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit == "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);

    setFahrenheitValue(fahrenheit);
    setLocalStorageValue("F");
  } else {
    setCelsiusValue(weather.temperature.value);
    setLocalStorageValue("C");
  }
});

function setCelsiusValue(value) {
  tempElement.innerHTML = `${value}°<span>C</span>`;
  weather.temperature.unit = "celsius";
}

function setFahrenheitValue(value) {
  tempElement.innerHTML = `${value}°<span>F</span>`;
  weather.temperature.unit = "fahrenheit";
}
