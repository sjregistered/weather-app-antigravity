import { createRouter, createRootRoute, createFileRoute, lazyRouteComponent, Outlet, HeadContent, Scripts } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
const Route$1 = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "WeatherNow - Live Weather Monitoring"
      },
      {
        name: "description",
        content: "Get real-time weather updates based on your location or any country. Beautiful multi-theme UI."
      },
      {
        tag: "link",
        attrs: {
          rel: "icon",
          href: "/favicon.png",
          type: "image/png"
        }
      }
    ]
  }),
  shellComponent: RootDocument,
  component: RootComponent
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { className: "theme-white", children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const API_BASE = "https://api.open-meteo.com/v1/forecast";
const WEATHER_CODES = {
  0: { description: "Clear sky", icon: "☀️", nightIcon: "🌙" },
  1: { description: "Mainly clear", icon: "🌤️", nightIcon: "🌙" },
  2: { description: "Partly cloudy", icon: "⛅", nightIcon: "☁️" },
  3: { description: "Overcast", icon: "☁️", nightIcon: "☁️" },
  45: { description: "Foggy", icon: "🌫️", nightIcon: "🌫️" },
  48: { description: "Depositing rime fog", icon: "🌫️", nightIcon: "🌫️" },
  51: { description: "Light drizzle", icon: "🌧️", nightIcon: "🌧️" },
  53: { description: "Moderate drizzle", icon: "🌧️", nightIcon: "🌧️" },
  55: { description: "Dense drizzle", icon: "🌧️", nightIcon: "🌧️" },
  61: { description: "Slight rain", icon: "🌧️", nightIcon: "🌧️" },
  63: { description: "Moderate rain", icon: "🌧️", nightIcon: "🌧️" },
  65: { description: "Heavy rain", icon: "🌧️", nightIcon: "🌧️" },
  66: { description: "Light freezing rain", icon: "🌨️", nightIcon: "🌨️" },
  67: { description: "Heavy freezing rain", icon: "🌨️", nightIcon: "🌨️" },
  71: { description: "Slight snow", icon: "🌨️", nightIcon: "🌨️" },
  73: { description: "Moderate snow", icon: "❄️", nightIcon: "❄️" },
  75: { description: "Heavy snow", icon: "❄️", nightIcon: "❄️" },
  77: { description: "Snow grains", icon: "❄️", nightIcon: "❄️" },
  80: { description: "Slight rain showers", icon: "🌦️", nightIcon: "🌧️" },
  81: { description: "Moderate rain showers", icon: "🌦️", nightIcon: "🌧️" },
  82: { description: "Violent rain showers", icon: "⛈️", nightIcon: "⛈️" },
  85: { description: "Slight snow showers", icon: "🌨️", nightIcon: "🌨️" },
  86: { description: "Heavy snow showers", icon: "🌨️", nightIcon: "🌨️" },
  95: { description: "Thunderstorm", icon: "⛈️", nightIcon: "⛈️" },
  96: { description: "Thunderstorm with hail", icon: "⛈️", nightIcon: "⛈️" },
  99: { description: "Thunderstorm with heavy hail", icon: "⛈️", nightIcon: "⛈️" }
};
function getWeatherInfo(code, isDay) {
  const info = WEATHER_CODES[code] || { description: "Unknown", icon: "❓", nightIcon: "❓" };
  return {
    description: info.description,
    icon: isDay ? info.icon : info.nightIcon
  };
}
function getDayName(dateStr) {
  const date = new Date(dateStr);
  const today = /* @__PURE__ */ new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "short" });
}
async function fetchWeather(coords) {
  const params = new URLSearchParams({
    latitude: coords.latitude.toString(),
    longitude: coords.longitude.toString(),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day",
    daily: "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "7"
  });
  const response = await fetch(`${API_BASE}?${params}`);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`);
  }
  return response.json();
}
function processWeatherData(data, locationName) {
  const { current, daily } = data;
  const isDay = current.is_day === 1;
  const weatherInfo = getWeatherInfo(current.weather_code, isDay);
  const forecast = daily.time.slice(0, 7).map((date, i) => {
    const info = getWeatherInfo(daily.weather_code[i], true);
    return {
      date,
      dayName: getDayName(date),
      high: Math.round(daily.temperature_2m_max[i]),
      low: Math.round(daily.temperature_2m_min[i]),
      condition: info.description,
      conditionIcon: info.icon,
      precipChance: daily.precipitation_probability_max[i]
    };
  });
  return {
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    windDirection: current.wind_direction_10m,
    condition: weatherInfo.description,
    conditionIcon: weatherInfo.icon,
    isDay,
    forecast,
    location: locationName
  };
}
const COUNTRIES = [
  { code: "US", name: "United States", capital: "Washington D.C.", coordinates: { latitude: 38.9072, longitude: -77.0369 } },
  { code: "GB", name: "United Kingdom", capital: "London", coordinates: { latitude: 51.5074, longitude: -0.1278 } },
  { code: "FR", name: "France", capital: "Paris", coordinates: { latitude: 48.8566, longitude: 2.3522 } },
  { code: "DE", name: "Germany", capital: "Berlin", coordinates: { latitude: 52.52, longitude: 13.405 } },
  { code: "JP", name: "Japan", capital: "Tokyo", coordinates: { latitude: 35.6762, longitude: 139.6503 } },
  { code: "AU", name: "Australia", capital: "Canberra", coordinates: { latitude: -35.2809, longitude: 149.13 } },
  { code: "IN", name: "India", capital: "New Delhi", coordinates: { latitude: 28.6139, longitude: 77.209 } },
  { code: "BR", name: "Brazil", capital: "Brasília", coordinates: { latitude: -15.7975, longitude: -47.8919 } },
  { code: "CA", name: "Canada", capital: "Ottawa", coordinates: { latitude: 45.4215, longitude: -75.6972 } },
  { code: "CN", name: "China", capital: "Beijing", coordinates: { latitude: 39.9042, longitude: 116.4074 } },
  { code: "RU", name: "Russia", capital: "Moscow", coordinates: { latitude: 55.7558, longitude: 37.6173 } },
  { code: "ZA", name: "South Africa", capital: "Pretoria", coordinates: { latitude: -25.7479, longitude: 28.2293 } },
  { code: "MX", name: "Mexico", capital: "Mexico City", coordinates: { latitude: 19.4326, longitude: -99.1332 } },
  { code: "IT", name: "Italy", capital: "Rome", coordinates: { latitude: 41.9028, longitude: 12.4964 } },
  { code: "ES", name: "Spain", capital: "Madrid", coordinates: { latitude: 40.4168, longitude: -3.7038 } },
  { code: "KR", name: "South Korea", capital: "Seoul", coordinates: { latitude: 37.5665, longitude: 126.978 } },
  { code: "NL", name: "Netherlands", capital: "Amsterdam", coordinates: { latitude: 52.3676, longitude: 4.9041 } },
  { code: "SE", name: "Sweden", capital: "Stockholm", coordinates: { latitude: 59.3293, longitude: 18.0686 } },
  { code: "CH", name: "Switzerland", capital: "Bern", coordinates: { latitude: 46.948, longitude: 7.4474 } },
  { code: "SG", name: "Singapore", capital: "Singapore", coordinates: { latitude: 1.3521, longitude: 103.8198 } },
  { code: "AE", name: "UAE", capital: "Abu Dhabi", coordinates: { latitude: 24.4539, longitude: 54.3773 } },
  { code: "EG", name: "Egypt", capital: "Cairo", coordinates: { latitude: 30.0444, longitude: 31.2357 } },
  { code: "TH", name: "Thailand", capital: "Bangkok", coordinates: { latitude: 13.7563, longitude: 100.5018 } },
  { code: "NZ", name: "New Zealand", capital: "Wellington", coordinates: { latitude: -41.2865, longitude: 174.7762 } },
  { code: "AR", name: "Argentina", capital: "Buenos Aires", coordinates: { latitude: -34.6037, longitude: -58.3816 } }
];
function getCountries() {
  return [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
}
function getLocationName(coords) {
  const closest = getClosestCountry(coords);
  return closest ? `${closest.capital}, ${closest.name}` : "Unknown Location";
}
function getClosestCountry(coords) {
  let closest = null;
  let minDistance = Infinity;
  for (const country of COUNTRIES) {
    const distance = Math.sqrt(
      Math.pow(coords.latitude - country.coordinates.latitude, 2) + Math.pow(coords.longitude - country.coordinates.longitude, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closest = country;
    }
  }
  return closest;
}
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        resolve({
          ...coords,
          name: getLocationName(coords)
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      { timeout: 1e4, maximumAge: 3e5 }
    );
  });
}
const DEFAULT_LOCATION = {
  latitude: 51.5074,
  longitude: -0.1278,
  name: "London, United Kingdom"
};
const $$splitComponentImporter = () => import("./index-CpiB1WW9.mjs");
const Route = createFileRoute("/")({
  loader: async () => {
    const weather = await fetchWeather(DEFAULT_LOCATION);
    const processed = processWeatherData(weather, DEFAULT_LOCATION.name);
    return {
      initialWeather: processed,
      countries: getCountries()
    };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$1
});
const rootRouteChildren = {
  IndexRoute
};
const routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  DEFAULT_LOCATION as D,
  Route as R,
  getClosestCountry as a,
  fetchWeather as f,
  getCurrentLocation as g,
  processWeatherData as p,
  router as r
};
