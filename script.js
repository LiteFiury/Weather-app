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

// Get weather
function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");

  if (city === "") {
    resultDiv.innerText = "Please enter a city name.";
    return;
  }

  const apiKey = "bd24ef0ba299c7791ce6ea691a82c02d";
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
      resultDiv.innerHTML = `
        <h3>${name}</h3>
        <p>${weather[0].main} - ${weather[0].description}</p>
        <p>Temperature: ${main.temp} °C</p>
        <p>Humidity: ${main.humidity}%</p>
      `;
    })
    .catch(error => {
      resultDiv.innerText = "Error: " + error.message;
    });
}