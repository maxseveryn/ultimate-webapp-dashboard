import { getLocation } from "./current-location.js";

const currentLocationBtn = document.querySelector(".current-location-btn");
const searchInput = document.getElementById("search-input");

const units = "metric";
const apiKey = API_CONFIG.OPENWEATHER_KEY;

const currentTemperature = document.querySelector(".current-temperature");
const currentFeels = document.querySelector(".current-feels");
const description = document.querySelector(".current-status");
const currentWeatherIcon = document.querySelector(".current-weather-icon");
const currentDate = document.querySelector(".current-date-value");
const currentLocation = document.querySelector(".current-location-value");

const forecastTemperature = document.querySelectorAll(".forecast-temperature");
const forecastWeatherIcon = document.querySelectorAll(".forecast-weather-icon");
const forecastDate = document.querySelectorAll(".forecast-date");
const forecastDay = document.querySelectorAll(".forecast-day");

const windSpeed = document.querySelector(".wind-speed");
const windDeg = document.querySelector(".wind-deg");
const windGust = document.querySelector(".wind-gust");

const sunset = document.querySelector(".sunset");
const sunrise = document.querySelector(".sunrise");

const humidity = document.querySelector(".humidity");
const pressure = document.querySelector(".pressure");
const visibility = document.querySelector(".visibility");

const container = document.querySelector(".today-at-scroll-container");

const searchBtn = document.querySelector(".search-btn");

const date = new Date();

const options = {
  weekday: "long",
  day: "numeric",
  month: "short",
};

const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

const hours = date.getHours().toString().padStart(2, "0");
const minutes = date.getMinutes().toString().padStart(2, "0");

const currentMoment = `${formattedDate}, ${hours}:${minutes}`;

currentLocationBtn.addEventListener("click", async () => {
  try {
    const result = await getLocation();
    searchInput.value = `${result.city}, ${result.country}`;
  } catch (err) {
    console.error("Error getting location:", err);
    searchInput.value = "Location error";
  }
});

searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    localStorage.setItem("lastCity", city);
    fetchWeather(city);
  } else {
    alert("Input correct city name!");
    return;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    fetchWeather(lastCity);
  }
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  searchBtn.click();
});

async function fetchWeather(city) {
  try {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;

    const currentWeatherResponse = await fetch(currentWeatherUrl);
    if (!currentWeatherResponse.ok)
      throw new Error("Current weather fetch failed");
    const forecastWeatherResponse = await fetch(forecastWeatherUrl);
    if (!forecastWeatherResponse.ok) throw new Error("Forecast fetch failed");

    const currentWeatherData = await currentWeatherResponse.json();
    const forecastWeatherData = await forecastWeatherResponse.json();

    if (currentWeatherData.cod == "400" || currentWeatherData.cod == "404") {
      alert("Not a valid city");
      return;
    }

    displayWeather(currentWeatherData);
    displayForecast(forecastWeatherData);
    displayHourly(forecastWeatherData);
  } catch (error) {
    console.error("Error getting data", error);
  }
}

function displayWeather(data) {
  const city = data.name;
  const country = data.sys.country;
  const temperatureReal = Math.round(data.main.temp);
  const temperatureFeelsLike = Math.round(data.main.feels_like);
  const descriptionStatus = data.weather[0].description;
  const icon = data.weather[0].icon;

  const windSpeedValue = data.wind.speed;
  const windDegValue = data.wind.deg;
  const windGustValue = data.wind.gust;

  const sunriseDate = new Date(data.sys.sunrise * 1000);
  const sunsetDate = new Date(data.sys.sunset * 1000);

  const sunriseTime = sunriseDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sunsetTime = sunsetDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const humidityValue = data.main.humidity;
  const pressureValue = data.main.pressure;
  const visibilityValue = data.visibility / 1000;

  currentLocation.textContent = city + ", " + country;
  description.textContent = descriptionStatus;
  currentTemperature.textContent = `${temperatureReal}°C`;
  currentFeels.textContent = `Feels like: ${temperatureFeelsLike}°C`;
  currentDate.textContent = currentMoment;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  currentWeatherIcon.src = iconUrl;

  windSpeed.textContent = `${windSpeedValue} m/s`;
  windDeg.textContent = `${windDegValue}°`;
  windGust.textContent = `${windGustValue} m/s`;

  sunrise.textContent = sunriseTime;
  sunset.textContent = sunsetTime;

  humidity.textContent = `${humidityValue}%`;
  pressure.textContent = `${pressureValue} hPa`;
  visibility.textContent = `${visibilityValue} km`;
}

function displayForecast(data) {
  let dayIndex = 0;

  if (!data.list || data.list.length === 0) {
    renderError("No forecast data available.");
    return;
  }

  for (let i = 7; i < data.list.length && dayIndex < 5; i += 8) {
    const item = data.list[i];
    const dateObj = new Date(item.dt_txt);

    const temperature = `${Math.round(item.main.temp)}°C`;
    const iconCode = item.weather[0].icon;
    const description = item.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
    const dateText = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (forecastTemperature[dayIndex])
      forecastTemperature[dayIndex].textContent = temperature;
    if (forecastWeatherIcon[dayIndex]) {
      forecastWeatherIcon[dayIndex].src = iconUrl;
      forecastWeatherIcon[dayIndex].alt = description;
    }
    if (forecastDate[dayIndex]) forecastDate[dayIndex].textContent = dateText;
    if (forecastDay[dayIndex])
      forecastDay[dayIndex].textContent = `${dayName}, `;

    dayIndex++;
  }
}

function displayHourly(data) {
  container.innerHTML = "";

  if (!data.list || data.list.length === 0) {
    renderError("No forecast data available.");
    return;
  }

  const hourlyList = data.list.slice(0, 8);

  hourlyList.forEach((item) => {
    const time = new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const icon = item.weather[0].icon;
    const temp = Math.round(item.main.temp);

    const block = document.createElement("div");
    block.classList.add("today-at-item", "info-block");

    block.innerHTML = `
      <p class="today-at-time">${time}</p>
      <img class="today-at-icon info-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon">
      <p class="today-at-temperature">${temp}°C</p>
    `;

    container.appendChild(block);
  });
}
