// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB8nE-Ji4umWjKfNQYh9iOcrbWBeWw8cAE",
  authDomain: "weatherapp-39ae3.firebaseapp.com",
  projectId: "weatherapp-39ae3",
  storageBucket: "weatherapp-39ae3.appspot.com",
  messagingSenderId: "137175163567",
  appId: "1:137175163567:web:f6fb5cda28b4fee9e16a5a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Register function
function register() {
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("Registered successfully!");
    })
    .catch(error => {
      alert("Registration error: " + error.message);
    });
}

// Login function
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("Login successful!");
    })
    .catch(error => {
      alert("Login error: " + error.message);
    });
}

// Logout function
function logout() {
  auth.signOut().then(() => {
    alert("Logged out");
  });
}

// Handle auth state
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("logout-section").style.display = "block";
    document.getElementById("weather-section").style.display = "block";
    document.getElementById("welcome-text").innerText = `Welcome, ${user.email}`;
  } else {
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("logout-section").style.display = "none";
    document.getElementById("weather-section").style.display = "none";
  }
});

// Your OpenWeatherMap API Key
const apiKey = "bd24ef0ba299c7791ce6ea691a82c02d";

// Get current weather
function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherResultDiv = document.getElementById("weatherResult");
  const forecastResultDiv = document.getElementById("forecastResult");

  if (city === "") {
    weatherResultDiv.innerText = "Please enter a city name.";
    return;
  }

  // Clear previous results
  weatherResultDiv.innerHTML = "";
  forecastResultDiv.innerHTML = "";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(data => {
      const { name, weather, main } = data;
      weatherResultDiv.innerHTML = `
        <h3>${name}</h3>
        <p>${weather[0].main} - ${weather[0].description}</p>
        <p>Temperature: ${main.temp} °C</p>
        <p>Humidity: ${main.humidity}%</p>
      `;
    })
    .catch(error => {
      weatherResultDiv.innerText = "Error: " + error.message;
    });
}

// **UPDATED FORECAST FUNCTION**
function getForecast() {
  const city = document.getElementById("cityInput").value.trim();
  const forecastResultDiv = document.getElementById("forecastResult");
  const weatherResultDiv = document.getElementById("weatherResult");

  if (city === "") {
    forecastResultDiv.innerText = "Please enter a city name.";
    return;
  }
  
  // Clear previous results
  forecastResultDiv.innerHTML = "";
  weatherResultDiv.innerHTML = "";

  // This is the new URL for the free 5-day forecast
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  fetch(forecastUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Could not fetch forecast for this city");
      }
      return response.json();
    })
    .then(data => {
      forecastResultDiv.innerHTML = `<h3>5-Day Forecast for ${data.city.name}</h3>`;
      
      // The API returns data every 3 hours. We need to process it to show one forecast per day.
      const dailyForecasts = {};

      // Loop through all the 3-hour forecasts
      data.list.forEach(forecast => {
        // Get the date (e.g., "2024-10-26")
        const date = forecast.dt_txt.split(' ')[0];
        // If we haven't already stored a forecast for this date, save this one.
        // This effectively gives us the first forecast of each day.
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = forecast;
        }
      });

      // Now, create a card for each unique day we found
      for (const date in dailyForecasts) {
        const day = dailyForecasts[date];
        const displayDate = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

        forecastResultDiv.innerHTML += `
          <div class="forecast-card">
            <h4>${displayDate}</h4>
            <img src="${iconUrl}" alt="${day.weather[0].description}">
            <p>${day.weather[0].main}</p>
            <p>Temp: ${day.main.temp.toFixed(1)} °C</p>
            <p>Humidity: ${day.main.humidity}%</p>
          </div>
        `;
      }
    })
    .catch(error => {
      forecastResultDiv.innerText = "Error: " + error.message;
    });
}