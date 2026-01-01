import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { R as Route, g as getCurrentLocation, a as getClosestCountry, f as fetchWeather, p as processWeatherData, D as DEFAULT_LOCATION } from "./router-BfBLRb-f.mjs";
import "@tanstack/react-router";
const THEMES = [
  { name: "white", label: "Light", icon: "☀️", preview: "#ffffff" },
  { name: "dark", label: "Dark", icon: "🌙", preview: "#1a1a2e" },
  { name: "pink", label: "Pink", icon: "🌸", preview: "#ff6b9d" },
  { name: "contrasty", label: "High Contrast", icon: "◐", preview: "#000000" }
];
const DEFAULT_THEME = "white";
const STORAGE_KEY = "weather-app-theme";
function applyTheme(theme) {
  if (typeof document === "undefined") return;
  document.body.classList.remove("theme-white", "theme-dark", "theme-pink", "theme-contrasty");
  document.body.classList.add(`theme-${theme}`);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
  }
}
function getSavedTheme() {
  if (typeof localStorage === "undefined") return DEFAULT_THEME;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.some((t) => t.name === saved)) {
      return saved;
    }
  } catch {
  }
  return DEFAULT_THEME;
}
function ThemeSwitcher({ themes, currentTheme, onThemeChange }) {
  return /* @__PURE__ */ jsx("div", { className: "theme-switcher", role: "radiogroup", "aria-label": "Select theme", children: themes.map((theme) => /* @__PURE__ */ jsx(
    "button",
    {
      className: `theme-switcher__btn ${currentTheme === theme.name ? "theme-switcher__btn--active" : ""}`,
      onClick: () => onThemeChange(theme.name),
      "aria-label": theme.label,
      "aria-checked": currentTheme === theme.name,
      role: "radio",
      title: theme.label,
      children: theme.icon
    },
    theme.name
  )) });
}
function Header({ themes, currentTheme, onThemeChange }) {
  return /* @__PURE__ */ jsxs("header", { className: "header", children: [
    /* @__PURE__ */ jsxs("div", { className: "header__title", children: [
      /* @__PURE__ */ jsx("span", { children: "🌤️" }),
      /* @__PURE__ */ jsx("span", { children: "WeatherNow" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "header__controls", children: /* @__PURE__ */ jsx(
      ThemeSwitcher,
      {
        themes,
        currentTheme,
        onThemeChange
      }
    ) })
  ] });
}
function WeatherCard({ weather }) {
  return /* @__PURE__ */ jsxs("div", { className: "weather-card", children: [
    /* @__PURE__ */ jsxs("div", { className: "weather-card__header", children: [
      /* @__PURE__ */ jsx("div", { className: "weather-card__location", children: weather.location }),
      /* @__PURE__ */ jsxs("div", { className: "weather-card__main", children: [
        /* @__PURE__ */ jsx("span", { className: "weather-card__icon", children: weather.conditionIcon }),
        /* @__PURE__ */ jsxs("span", { className: "weather-card__temp", children: [
          weather.temperature,
          /* @__PURE__ */ jsx("sup", { children: "°C" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "weather-card__condition", children: weather.condition })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "weather-card__details", children: [
      /* @__PURE__ */ jsxs("div", { className: "weather-card__detail", children: [
        /* @__PURE__ */ jsx("div", { className: "weather-card__detail-label", children: "Feels Like" }),
        /* @__PURE__ */ jsxs("div", { className: "weather-card__detail-value", children: [
          weather.feelsLike,
          "°"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "weather-card__detail", children: [
        /* @__PURE__ */ jsx("div", { className: "weather-card__detail-label", children: "Humidity" }),
        /* @__PURE__ */ jsxs("div", { className: "weather-card__detail-value", children: [
          weather.humidity,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "weather-card__detail", children: [
        /* @__PURE__ */ jsx("div", { className: "weather-card__detail-label", children: "Wind" }),
        /* @__PURE__ */ jsxs("div", { className: "weather-card__detail-value", children: [
          weather.windSpeed,
          " km/h"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "forecast", children: [
      /* @__PURE__ */ jsx("h3", { className: "forecast__title", children: "7-Day Forecast" }),
      /* @__PURE__ */ jsx("div", { className: "forecast__grid", children: weather.forecast.map((day) => /* @__PURE__ */ jsxs("div", { className: "forecast__day", children: [
        /* @__PURE__ */ jsx("div", { className: "forecast__day-name", children: day.dayName }),
        /* @__PURE__ */ jsx("div", { className: "forecast__day-icon", children: day.conditionIcon }),
        /* @__PURE__ */ jsxs("div", { className: "forecast__day-temps", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            day.high,
            "°"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            day.low,
            "°"
          ] })
        ] }),
        day.precipChance > 0 && /* @__PURE__ */ jsxs("div", { className: "forecast__day-precip", children: [
          "💧 ",
          day.precipChance,
          "%"
        ] })
      ] }, day.date)) })
    ] })
  ] });
}
function CountryDropdown({ countries, selectedCountry, onCountrySelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const filteredCountries = countries.filter(
    (country) => country.name.toLowerCase().includes(searchTerm.toLowerCase()) || country.capital.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSelect = (country) => {
    onCountrySelect(country);
    setIsOpen(false);
    setSearchTerm("");
  };
  return /* @__PURE__ */ jsxs("div", { className: "country-dropdown", ref: dropdownRef, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        className: "country-dropdown__trigger",
        onClick: () => setIsOpen(!isOpen),
        "aria-haspopup": "listbox",
        "aria-expanded": isOpen,
        children: [
          /* @__PURE__ */ jsx("span", { children: selectedCountry ? `${selectedCountry.name}` : "Select a country" }),
          /* @__PURE__ */ jsx("span", { className: `country-dropdown__arrow ${isOpen ? "country-dropdown__arrow--open" : ""}`, children: "▼" })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "country-dropdown__menu", role: "listbox", children: [
      /* @__PURE__ */ jsx("div", { className: "country-dropdown__search", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Search countries...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          autoFocus: true
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "country-dropdown__list", children: filteredCountries.length === 0 ? /* @__PURE__ */ jsx("div", { className: "country-dropdown__option", children: "No countries found" }) : filteredCountries.map((country) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `country-dropdown__option ${selectedCountry?.code === country.code ? "country-dropdown__option--selected" : ""}`,
          onClick: () => handleSelect(country),
          role: "option",
          "aria-selected": selectedCountry?.code === country.code,
          children: [
            /* @__PURE__ */ jsx("span", { className: "country-dropdown__option-name", children: country.name }),
            /* @__PURE__ */ jsx("span", { className: "country-dropdown__option-capital", children: country.capital })
          ]
        },
        country.code
      )) })
    ] })
  ] });
}
function LoadingSpinner({ message = "Loading weather data..." }) {
  return /* @__PURE__ */ jsxs("div", { className: "loading", children: [
    /* @__PURE__ */ jsx("div", { className: "loading__spinner", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx("div", { className: "loading__text", children: message })
  ] });
}
function ErrorDisplay({
  title = "Something went wrong",
  message,
  onRetry
}) {
  return /* @__PURE__ */ jsxs("div", { className: "error", children: [
    /* @__PURE__ */ jsx("div", { className: "error__icon", children: "⚠️" }),
    /* @__PURE__ */ jsx("h2", { className: "error__title", children: title }),
    /* @__PURE__ */ jsx("p", { className: "error__message", children: message }),
    onRetry && /* @__PURE__ */ jsx("button", { className: "error__btn", onClick: onRetry, children: "Try Again" })
  ] });
}
function HomePage() {
  const {
    initialWeather,
    countries
  } = Route.useLoaderData();
  const [weather, setWeather] = useState(initialWeather);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState("white");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [usingGeolocation, setUsingGeolocation] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = getSavedTheme();
      setCurrentTheme(saved);
      applyTheme(saved);
    }
  }, []);
  useEffect(() => {
    if (typeof window === "undefined" || initialized) return;
    const autoDetectLocation = async () => {
      try {
        const location = await getCurrentLocation();
        const closestCountry = getClosestCountry(location);
        if (closestCountry) {
          setSelectedCountry(closestCountry);
        }
        setUsingGeolocation(true);
        const data = await fetchWeather(location);
        const processed = processWeatherData(data, location.name);
        setWeather(processed);
        setError(null);
      } catch {
        console.log("Geolocation unavailable, using default location");
        setLoading(false);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    autoDetectLocation();
  }, [initialized]);
  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };
  const fetchWeatherForLocation = async (location) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(location);
      const processed = processWeatherData(data, location.name);
      setWeather(processed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };
  const handleCountrySelect = async (country) => {
    setSelectedCountry(country);
    setUsingGeolocation(false);
    await fetchWeatherForLocation({
      ...country.coordinates,
      name: `${country.capital}, ${country.name}`
    });
  };
  const handleGetLocation = async () => {
    setGettingLocation(true);
    try {
      const location = await getCurrentLocation();
      setSelectedCountry(null);
      setUsingGeolocation(true);
      await fetchWeatherForLocation(location);
    } catch (err) {
      setError("Could not get your location. Please allow location access or select a country.");
    } finally {
      setGettingLocation(false);
    }
  };
  const handleRetry = () => {
    if (selectedCountry) {
      handleCountrySelect(selectedCountry);
    } else if (usingGeolocation) {
      handleGetLocation();
    } else {
      fetchWeatherForLocation(DEFAULT_LOCATION);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Header, { themes: THEMES, currentTheme, onThemeChange: handleThemeChange }),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 mb-8 flex-wrap", children: [
        /* @__PURE__ */ jsx(CountryDropdown, { countries, selectedCountry, onCountrySelect: handleCountrySelect }),
        /* @__PURE__ */ jsxs("button", { className: `location-btn ${gettingLocation ? "location-btn--loading" : ""}`, onClick: handleGetLocation, disabled: gettingLocation, children: [
          /* @__PURE__ */ jsx("span", { children: "📍" }),
          gettingLocation ? "Getting location..." : "Use my location"
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsx(LoadingSpinner, {}) : error ? /* @__PURE__ */ jsx(ErrorDisplay, { message: error, onRetry: handleRetry }) : /* @__PURE__ */ jsx(WeatherCard, { weather })
    ] }) })
  ] });
}
export {
  HomePage as component
};
