"use strict";// Select HTML elements
const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const weatherCondition = document.getElementById("weatherCondition");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");

// Add your NEW OpenWeatherMap API key here
const API_KEY = "e8a53243f86e1568f033bce0ef978960";

weatherForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        showMessage("Please enter a city name.", true);
        return;
    }

    if (API_KEY === "YOUR_NEW_API_KEY") {
        showMessage("Please add your API key in script.js.", true);
        return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";
    showMessage("Fetching weather information...", false);
    weatherCard.hidden = true;

    try {
        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please check the spelling.");
            }

            if (response.status === 401) {
                throw new Error("API key is invalid or not active yet.");
            }

            if (response.status === 429) {
                throw new Error("API request limit reached. Please try later.");
            }

            throw new Error(data.message || "Unable to fetch weather.");
        }

        // Display the weather data
        cityName.textContent = `${data.name}, ${data.sys.country}`;
        weatherCondition.textContent = data.weather[0].description;

        temperature.textContent = Math.round(data.main.temp);
        humidity.textContent = `${data.main.humidity}%`;
        feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        weatherIcon.alt = data.weather[0].description;

        weatherCard.hidden = false;
        showMessage("Weather updated successfully!", false);

    } catch (error) {
        showMessage(error.message || "Something went wrong.", true);
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
});

// Display status and error messages
function showMessage(text, isError) {
    message.textContent = text;
    message.classList.toggle("error", isError);
}
