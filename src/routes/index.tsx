/**
 * Home Page - Main weather display with SSR
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

// Models
import type { ThemeName } from '../models/theme.model'
import type { Country, Location } from '../models/location.model'
import type { WeatherDisplay } from '../models/weather.model'

// Controllers
import { fetchWeather, processWeatherData } from '../controllers/weather.controller'
import { getCountries, getCurrentLocation, DEFAULT_LOCATION, getClosestCountry } from '../controllers/location.controller'
import { applyTheme, getSavedTheme } from '../controllers/theme.controller'
import { THEMES } from '../models/theme.model'

// Views
import { Header } from '../views/Header'
import { WeatherCard } from '../views/WeatherCard'
import { CountryDropdown } from '../views/CountryDropdown'
import { LoadingSpinner } from '../views/LoadingSpinner'
import { ErrorDisplay } from '../views/ErrorDisplay'

// SSR Loader - fetches initial weather data on server
export const Route = createFileRoute('/')({
  loader: async () => {
    // Default to London for SSR (no geolocation on server)
    const weather = await fetchWeather(DEFAULT_LOCATION)
    const processed = processWeatherData(weather, DEFAULT_LOCATION.name)
    return {
      initialWeather: processed,
      countries: getCountries(),
    }
  },
  component: HomePage,
})

function HomePage() {
  const { initialWeather, countries } = Route.useLoaderData()

  // State
  const [weather, setWeather] = useState<WeatherDisplay>(initialWeather)
  const [loading, setLoading] = useState(true) // Start with loading = true for auto-location
  const [error, setError] = useState<string | null>(null)
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('white')
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [usingGeolocation, setUsingGeolocation] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Initialize theme on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = getSavedTheme()
      setCurrentTheme(saved)
      applyTheme(saved)
    }
  }, [])

  // Auto-detect location on startup (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined' || initialized) return;

    const autoDetectLocation = async () => {
      try {
        const location = await getCurrentLocation()
        // Find the closest country and select it
        const closestCountry = getClosestCountry(location)
        if (closestCountry) {
          setSelectedCountry(closestCountry)
        }
        setUsingGeolocation(true)

        // Fetch weather for user's exact location
        const data = await fetchWeather(location)
        const processed = processWeatherData(data, location.name)
        setWeather(processed)
        setError(null)
      } catch {
        // If geolocation fails, fall back to SSR data and keep loading = false
        console.log('Geolocation unavailable, using default location')
        setLoading(false)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    autoDetectLocation()
  }, [initialized])

  // Handle theme change
  const handleThemeChange = (theme: ThemeName) => {
    setCurrentTheme(theme)
    applyTheme(theme)
  }

  // Fetch weather for coordinates
  const fetchWeatherForLocation = async (location: Location) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchWeather(location)
      const processed = processWeatherData(data, location.name)
      setWeather(processed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather')
    } finally {
      setLoading(false)
    }
  }

  // Handle country selection
  const handleCountrySelect = async (country: Country) => {
    setSelectedCountry(country)
    setUsingGeolocation(false)
    await fetchWeatherForLocation({
      ...country.coordinates,
      name: `${country.capital}, ${country.name}`,
    })
  }

  // Handle geolocation request
  const handleGetLocation = async () => {
    setGettingLocation(true)
    try {
      const location = await getCurrentLocation()
      setSelectedCountry(null)
      setUsingGeolocation(true)
      await fetchWeatherForLocation(location)
    } catch (err) {
      setError('Could not get your location. Please allow location access or select a country.')
    } finally {
      setGettingLocation(false)
    }
  }

  // Retry on error
  const handleRetry = () => {
    if (selectedCountry) {
      handleCountrySelect(selectedCountry)
    } else if (usingGeolocation) {
      handleGetLocation()
    } else {
      fetchWeatherForLocation(DEFAULT_LOCATION)
    }
  }

  return (
    <>
      <Header
        themes={THEMES}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />

      <main className="main">
        <div className="container">
          {/* Location Controls */}
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <CountryDropdown
              countries={countries}
              selectedCountry={selectedCountry}
              onCountrySelect={handleCountrySelect}
            />

            <button
              className={`location-btn ${gettingLocation ? 'location-btn--loading' : ''}`}
              onClick={handleGetLocation}
              disabled={gettingLocation}
            >
              <span>📍</span>
              {gettingLocation ? 'Getting location...' : 'Use my location'}
            </button>
          </div>

          {/* Weather Display */}
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorDisplay message={error} onRetry={handleRetry} />
          ) : (
            <WeatherCard weather={weather} />
          )}
        </div>
      </main>
    </>
  )
}
