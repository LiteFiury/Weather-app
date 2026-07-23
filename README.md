<div align="center">

# Weather App

> *A simple, authenticated weather lookup — current conditions and a 5-day forecast, gated behind a login.*

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Firebase Auth](https://img.shields.io/badge/Firebase_Auth-FFCA28?&logo=firebase&logoColor=black)](https://firebase.google.com/docs/auth)
[![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-EB6E4B?&logo=openweathermap&logoColor=white)](https://openweathermap.org/api)

</div>

---

## Overview

**Weather App** is a single-page, vanilla HTML/CSS/JS app that puts a login wall in front of a weather lookup tool. A visitor registers or signs in with Firebase Authentication (email/password); once authenticated, they can type in a city and pull either the current conditions or a 5-day forecast from the OpenWeatherMap API. No build step, no framework — three files, loaded directly in the browser.

---

## Features

- **Email/password auth** via Firebase — register, log in, log out, with the UI reactively swapping between the auth forms and the weather tool based on live auth state (`onAuthStateChanged`).
- **Current weather lookup** — city name in, temperature (°C), humidity, and a short condition description out.
- **5-day forecast** — OpenWeatherMap's free `/forecast` endpoint returns data in 3-hour steps; the app collapses that down to one card per calendar day (the first 3-hour slot seen for each date) and renders it with an icon, condition, temperature, and humidity.
- **Stateful UI** — three sections (`auth-section`, `logout-section`, `weather-section`) are shown/hidden based on whether a user is signed in, rather than being separate pages.

---

## How It Works

```
+------------------+        +---------------------+        +------------------------+
|   index.html     |------->|   Firebase Auth      |        |   OpenWeatherMap API   |
|   (forms + UI)    |        |   (email/password)   |        |   /weather . /forecast |
+--------+----------+        +----------+-----------+        +-----------+------------+
         |                              |                                |
         |        script.js coordinates auth state + fetch calls        |
         +------------------------------+--------------------------------+
                                         |
                              style.css handles layout/theming
```

1. `index.html` loads the Firebase compat SDKs, then `script.js`.
2. `script.js` initializes Firebase with an embedded project config and listens for auth state changes to toggle which section of the page is visible.
3. Once logged in, `getWeather()` and `getForecast()` call OpenWeatherMap directly from the browser using a hardcoded API key, and render the JSON response into the page.

---

## Project Structure

```
Weather-app-main/
├── index.html    # Markup: auth forms + weather UI, all three sections
├── style.css     # Layout, card styling, button/input styling
└── script.js     # Firebase init, auth functions, weather/forecast fetch + render logic
```

---

## Getting Started

This is a static site with no build tooling — the only setup is supplying your own credentials.

1. **Firebase project** — create a project at the [Firebase Console](https://console.firebase.google.com), enable **Email/Password** sign-in under Authentication, and copy your web app config into `firebaseConfig` in `script.js`.
2. **OpenWeatherMap key** — sign up at [OpenWeatherMap](https://openweathermap.org/api) and set the free-tier API key as the `apiKey` constant in `script.js`.
3. **Run it** — open `index.html` directly in a browser, or serve the folder with any static server (e.g. `npx serve .`).

---

## Known Limitations

**Security**
- Both the Firebase config and the OpenWeatherMap API key are hardcoded directly in `script.js`, which means they ship to every visitor's browser and are visible in page source. Firebase web config is meant to be public, but it should be paired with Firebase Security Rules to restrict what an authenticated (or anonymous) client can actually do — none are configured here. The OpenWeatherMap key has no such protection story on the frontend; a proxy/backend endpoint is the standard fix if this app becomes anything more than a demo.
- Auth state is checked client-side only. There's no backend to authorize the weather requests themselves — logging in gates the *UI*, not the API calls, which are unauthenticated OpenWeatherMap requests regardless of who's signed in.

**Functional**
- No loading indicators — a slow network leaves the result area blank until the fetch resolves or errors.
- No input validation beyond an empty-string check; a malformed or nonexistent city relies entirely on OpenWeatherMap's error response.
- The forecast dedup logic (`dailyForecasts[date]`) keeps the *first* 3-hour slot seen for each day, which may be a very early-morning reading rather than a representative daily one.
- Registration and login feedback is delivered via `alert()`, which blocks the page and is easy to miss or dismiss accidentally.
- No password reset / "forgot password" flow.

---

## Roadmap

- [ ] Move API keys server-side (or use a lightweight proxy) to stop shipping the OpenWeatherMap key to the client
- [ ] Add Firebase Security Rules appropriate to the auth model in use
- [ ] Replace `alert()`-based feedback with inline UI messages
- [ ] Add loading and empty/error states for both weather and forecast panels
- [ ] Let the forecast card selection average or midday-sample each day instead of taking the first available slot
- [ ] Responsive layout pass for small screens

---

## License

Not currently specified.

---

<div align="center">
<sub>A small app for checking the weather — after you prove you're allowed to.</sub>
</div>
