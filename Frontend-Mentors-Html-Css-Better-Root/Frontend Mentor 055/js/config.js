// Configuration constants for the Weather App
const CONFIG = {
    // Open-Meteo API endpoints
    API: {
        GEOCODING: 'https://geocoding-api.open-meteo.com/v1/search',
        WEATHER: 'https://api.open-meteo.com/v1/forecast',
        TIMEZONE: 'auto'
    },
    
    // Weather data parameters
    WEATHER_PARAMS: {
        current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'is_day',
            'precipitation',
            'weather_code',
            'cloud_cover',
            'surface_pressure',
            'wind_speed_10m',
            'wind_direction_10m'
        ],
        hourly: [
            'temperature_2m',
            'relative_humidity_2m',
            'precipitation_probability',
            'precipitation',
            'weather_code',
            'cloud_cover',
            'visibility',
            'wind_speed_10m',
            'wind_direction_10m'
        ],
        daily: [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'apparent_temperature_max',
            'apparent_temperature_min',
            'precipitation_sum',
            'precipitation_probability_max',
            'wind_speed_10m_max',
            'wind_gusts_10m_max',
            'wind_direction_10m_dominant'
        ]
    },
    
    // App settings
    SETTINGS: {
        DEFAULT_CITY: 'London',
        SEARCH_DELAY: 500, // ms delay for search suggestions
        FORECAST_DAYS: 7,
        HOURLY_FORECAST_HOURS: 24,
        CACHE_DURATION: 10 * 60 * 1000, // 10 minutes in milliseconds
        GEOLOCATION_TIMEOUT: 10000, // 10 seconds
        MAX_SEARCH_RESULTS: 5
    },
    
    // Units configuration
    UNITS: {
        CELSIUS: {
            temperature: '°C',
            wind_speed: 'km/h',
            precipitation: 'mm',
            pressure: 'hPa',
            visibility: 'km'
        },
        FAHRENHEIT: {
            temperature: '°F',
            wind_speed: 'mph',
            precipitation: 'in',
            pressure: 'inHg',
            visibility: 'mi'
        }
    },
    
    // Weather code mappings to icons and descriptions
    WEATHER_CODES: {
        0: { description: 'Clear sky', icon: '☀️', night_icon: '🌙' },
        1: { description: 'Mainly clear', icon: '🌤️', night_icon: '🌙' },
        2: { description: 'Partly cloudy', icon: '⛅', night_icon: '☁️' },
        3: { description: 'Overcast', icon: '☁️', night_icon: '☁️' },
        45: { description: 'Fog', icon: '🌫️', night_icon: '🌫️' },
        48: { description: 'Depositing rime fog', icon: '🌫️', night_icon: '🌫️' },
        51: { description: 'Light drizzle', icon: '🌦️', night_icon: '🌦️' },
        53: { description: 'Moderate drizzle', icon: '🌦️', night_icon: '🌦️' },
        55: { description: 'Dense drizzle', icon: '🌧️', night_icon: '🌧️' },
        56: { description: 'Light freezing drizzle', icon: '🌨️', night_icon: '🌨️' },
        57: { description: 'Dense freezing drizzle', icon: '🌨️', night_icon: '🌨️' },
        61: { description: 'Slight rain', icon: '🌧️', night_icon: '🌧️' },
        63: { description: 'Moderate rain', icon: '🌧️', night_icon: '🌧️' },
        65: { description: 'Heavy rain', icon: '⛈️', night_icon: '⛈️' },
        66: { description: 'Light freezing rain', icon: '🌨️', night_icon: '🌨️' },
        67: { description: 'Heavy freezing rain', icon: '🌨️', night_icon: '🌨️' },
        71: { description: 'Slight snow fall', icon: '🌨️', night_icon: '🌨️' },
        73: { description: 'Moderate snow fall', icon: '❄️', night_icon: '❄️' },
        75: { description: 'Heavy snow fall', icon: '❄️', night_icon: '❄️' },
        77: { description: 'Snow grains', icon: '❄️', night_icon: '❄️' },
        80: { description: 'Slight rain showers', icon: '🌦️', night_icon: '🌦️' },
        81: { description: 'Moderate rain showers', icon: '🌧️', night_icon: '🌧️' },
        82: { description: 'Violent rain showers', icon: '⛈️', night_icon: '⛈️' },
        85: { description: 'Slight snow showers', icon: '🌨️', night_icon: '🌨️' },
        86: { description: 'Heavy snow showers', icon: '❄️', night_icon: '❄️' },
        95: { description: 'Thunderstorm', icon: '⛈️', night_icon: '⛈️' },
        96: { description: 'Thunderstorm with slight hail', icon: '⛈️', night_icon: '⛈️' },
        99: { description: 'Thunderstorm with heavy hail', icon: '⛈️', night_icon: '⛈️' }
    },
    
    // DOM element IDs
    ELEMENTS: {
        // Search elements
        CITY_SEARCH: 'citySearch',
        SEARCH_BTN: 'searchBtn',
        LOCATION_BTN: 'locationBtn',
        SEARCH_SUGGESTIONS: 'searchSuggestions',
        
        // Unit toggle
        UNIT_BTNS: 'unit-btn',
        
        // State elements
        LOADING_STATE: 'loadingState',
        ERROR_MESSAGE: 'errorMessage',
        ERROR_TEXT: 'errorText',
        RETRY_BTN: 'retryBtn',
        WEATHER_CONTENT: 'weatherContent',
        
        // Current weather elements
        CURRENT_LOCATION: 'currentLocation',
        CURRENT_DATE: 'currentDate',
        CURRENT_TEMP: 'currentTemp',
        CURRENT_WEATHER_ICON: 'currentWeatherIcon',
        WEATHER_DESCRIPTION: 'weatherDescription',
        FEELS_LIKE: 'feelsLike',
        HUMIDITY: 'humidity',
        WIND_SPEED: 'windSpeed',
        VISIBILITY: 'visibility',
        PRESSURE: 'pressure',
        
        // Forecast elements
        HOURLY_FORECAST: 'hourlyForecast',
        DAILY_FORECAST: 'dailyForecast'
    },
    
    // Local storage keys
    STORAGE_KEYS: {
        LAST_LOCATION: 'weather_app_last_location',
        PREFERRED_UNIT: 'weather_app_preferred_unit',
        WEATHER_CACHE: 'weather_app_cache'
    }
};

// Make config available globally
window.CONFIG = CONFIG;