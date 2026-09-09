# 🌤️ Weather App

A cross-platform weather application built with **React Native, Expo, and TypeScript**. Search for a city to view its current temperature and country, with the ability to switch between Celsius and Fahrenheit.

> 🚧 **Project Status:** In Development

## 📸 Screenshots



### Mobile

<p align="center">
  <img src="/Users/businessacc/Desktop/Screenshot 2026-09-07 at 1.20.30 AM.png" width="700" />
  <img src="/Users/businessacc/Desktop/Screenshot 2026-09-07 at 1.19.58 AM.png" width="700" />
<img src="/Users/businessacc/Desktop/Screenshot 2026-09-07 at 1.20.15 AM.png" width="700" />
</p>

### Web

<p align="center">
  <img src="/Users/businessacc/Desktop/Screenshot 2026-09-07 at 1.00.08 AM.png" width="700" />
<img src="/Users/businessacc/Desktop/Screenshot 2026-09-07 at 1.00.26 AM.png" width="700" />
<img src="/Users/businessacc/Desktop/Screenshot 2026-09-07 at 1.00.40 AM.png" width="700" />
</p>

--- 

## ✨ Features

* 🌍 Search for a city
* 📍 Display the city's country
* 🌡️ View the current temperature
* 🔄 Switch between Celsius and Fahrenheit
* ☀️ Dynamic weather icons
* 📱 Mobile support
* 💻 Web support
* ⚡ Real-time weather data
* 🔌 Separated API and application logic
* 🧩 Modular and maintainable project structure

---
 
## 🛠️ Tech Stack

| Technology                    | Purpose                                |
| ----------------------------- | -------------------------------------- |
| **React Native**              | Cross-platform application development |
| **Expo**                      | Development and application tooling    |
| **TypeScript**                | Type-safe development                  |
| **Expo Router**               | File-based navigation                  |
| **Open-Meteo API**            | City geocoding and weather data        |
| **React Native Vector Icons** | Application icons                      |
| **Git & GitHub**              | Version control                        |

---

## 📁 Project Structure

The project follows a modular structure that separates the application's UI, logic, and API communication.

```text
src/
├── app/
│   ├── index.tsx
│   ├── _layout.tsx
│   └── explore.tsx
│
├── components/
│   ├── temperature-result.tsx
│   └── ...
│
├── constants/
│   └── theme.ts
│
├── hooks/
│   └── useWeather.ts
│
├── services/
│   └── weather-api.ts
│
└── global.css
```

### Why this structure?

The application separates responsibilities into different parts of the project.

* **App** — Application screens and routing
* **Components** — Reusable UI components
* **Hooks** — Application and state logic
* **Services** — API and external data communication
* **Constants** — Shared configuration and theme values

This makes the code easier to maintain, reuse, and expand.

---

## 🌐 API

The application uses the **Open-Meteo API** to retrieve weather information.

The API functionality is contained in:

```text
src/services/weather-api.ts
```

The service handles:

1. Finding the requested city through geocoding
2. Retrieving the city's coordinates
3. Requesting the current weather data
4. Returning the required information to the application

Keeping the API logic separate from the UI makes the application easier to maintain and allows the service to be reused by other parts of the application.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* **Node.js**
* **npm**
* **Expo**
* **Git**

### 1. Clone the repository

```bash
git clone https://github.com/MoArabiat/Weather-App.git
```

Navigate into the project:

```bash
cd Weather-App
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the application

```bash
npx expo start
```

Expo will provide options to run the application on:

* 📱 Expo Go
* 🤖 Android Emulator
* 🍎 iOS Simulator
* 🌐 Web Browser

### Run on Web

To launch the application directly in a web browser:

```bash
npx expo start --web
```

---

## 🧠 What I Learned

This project has helped me develop practical experience with:

* React Native development
* Expo
* TypeScript
* React state management
* Custom hooks
* REST API integration
* Asynchronous programming
* Error handling
* Conditional rendering
* Responsive UI development
* Cross-platform development
* Git and GitHub
* Project structure and code organization

---

## 🔮 Future Improvements

Planned improvements include:

* 📍 Weather based on the user's current location
* 📅 Multi-day weather forecasts
* 💨 Wind speed and direction
* 💧 Humidity information
* 🌧️ Precipitation information
* ⭐ Favorite cities
* 🌙 Dark mode
* ✨ Improved animations
* 🎨 Further UI and UX improvements

---

## 📚 Resources

The project was built using the following technologies and documentation:

* [Expo Documentation](https://docs.expo.dev/)
* [React Native Documentation](https://reactnative.dev/)
* [TypeScript Documentation](https://www.typescriptlang.org/docs/)
* [Open-Meteo](https://open-meteo.com/)
* [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)

---

## 📄 License

This project is available under the **MIT License**.

---

## 👨‍💻 Author

**Mohammad Arabiat**

GitHub:
https://github.com/MoArabiat

---

⭐ If you find this project useful or interesting, feel free to star the repository.

**Repository:**
https://github.com/MoArabiat/Weather-App

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
