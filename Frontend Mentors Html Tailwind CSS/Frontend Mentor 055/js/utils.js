// Utility functions for the Weather App
const Utils = {
    
    // Unit conversion functions
    units: {
        // Temperature conversions
        celsiusToFahrenheit: (celsius) => {
            return (celsius * 9/5) + 32;
        },
        
        fahrenheitToCelsius: (fahrenheit) => {
            return (fahrenheit - 32) * 5/9;
        },
        
        // Wind speed conversions
        kmhToMph: (kmh) => {
            return kmh * 0.621371;
        },
        
        mphToKmh: (mph) => {
            return mph * 1.60934;
        },
        
        // Pressure conversions
        hpaToInhg: (hpa) => {
            return hpa * 0.02953;
        },
        
        inhgToHpa: (inhg) => {
            return inhg * 33.8639;
        },
        
        // Distance conversions
        kmToMiles: (km) => {
            return km * 0.621371;
        },
        
        milesToKm: (miles) => {
            return miles * 1.60934;
        },
        
        // Precipitation conversions
        mmToInches: (mm) => {
            return mm * 0.0393701;
        },
        
        inchesToMm: (inches) => {
            return inches * 25.4;
        }
    },
    
    // Formatting functions
    format: {
        // Format temperature based on current unit
        temperature: (temp, unit = 'celsius') => {
            if (temp === null || temp === undefined) return '--';
            
            const value = unit === 'fahrenheit' 
                ? Utils.units.celsiusToFahrenheit(temp)
                : temp;
            
            return Math.round(value);
        },
        
        // Format wind speed based on current unit
        windSpeed: (speed, unit = 'celsius') => {
            if (speed === null || speed === undefined) return '--';
            
            const value = unit === 'fahrenheit' 
                ? Utils.units.kmhToMph(speed)
                : speed;
            
            const unitLabel = unit === 'fahrenheit' ? 'mph' : 'km/h';
            return `${Math.round(value)} ${unitLabel}`;
        },
        
        // Format pressure based on current unit
        pressure: (pressure, unit = 'celsius') => {
            if (pressure === null || pressure === undefined) return '--';
            
            const value = unit === 'fahrenheit' 
                ? Utils.units.hpaToInhg(pressure)
                : pressure;
            
            const unitLabel = unit === 'fahrenheit' ? 'inHg' : 'hPa';
            const decimals = unit === 'fahrenheit' ? 2 : 0;
            return `${value.toFixed(decimals)} ${unitLabel}`;
        },
        
        // Format visibility based on current unit
        visibility: (visibility, unit = 'celsius') => {
            if (visibility === null || visibility === undefined) return '--';
            
            const value = unit === 'fahrenheit' 
                ? Utils.units.kmToMiles(visibility / 1000) // API returns in meters
                : (visibility / 1000);
            
            const unitLabel = unit === 'fahrenheit' ? 'mi' : 'km';
            return `${value.toFixed(1)} ${unitLabel}`;
        },
        
        // Format precipitation
        precipitation: (precip, unit = 'celsius') => {
            if (precip === null || precip === undefined) return '0';
            
            const value = unit === 'fahrenheit' 
                ? Utils.units.mmToInches(precip)
                : precip;
            
            const unitLabel = unit === 'fahrenheit' ? 'in' : 'mm';
            const decimals = unit === 'fahrenheit' ? 2 : 1;
            return `${value.toFixed(decimals)} ${unitLabel}`;
        },
        
        // Format humidity as percentage
        humidity: (humidity) => {
            if (humidity === null || humidity === undefined) return '--%';
            return `${Math.round(humidity)}%`;
        },
        
        // Format date
        date: (dateString) => {
            const date = new Date(dateString);
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return date.toLocaleDateString('en-US', options);
        },
        
        // Format time
        time: (dateString, format = '12h') => {
            const date = new Date(dateString);
            if (format === '24h') {
                return date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                });
            }
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric',
                hour12: true 
            });
        },
        
        // Format day of week
        dayOfWeek: (dateString, format = 'long') => {
            const date = new Date(dateString);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            
            // Check if it's today or tomorrow
            if (date.toDateString() === today.toDateString()) {
                return 'Today';
            } else if (date.toDateString() === tomorrow.toDateString()) {
                return 'Tomorrow';
            }
            
            return date.toLocaleDateString('en-US', { weekday: format });
        }
    },
    
    // Weather utilities
    weather: {
        // Get weather icon based on code and time of day
        getIcon: (weatherCode, isDay = true) => {
            const weatherInfo = CONFIG.WEATHER_CODES[weatherCode];
            if (!weatherInfo) return '❓';
            
            return isDay ? weatherInfo.icon : weatherInfo.night_icon;
        },
        
        // Get weather description
        getDescription: (weatherCode) => {
            const weatherInfo = CONFIG.WEATHER_CODES[weatherCode];
            return weatherInfo ? weatherInfo.description : 'Unknown';
        },
        
        // Get wind direction from degrees
        getWindDirection: (degrees) => {
            if (degrees === null || degrees === undefined) return 'N';
            
            const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                              'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
            const index = Math.round(degrees / 22.5) % 16;
            return directions[index];
        }
    },
    
    // DOM utilities
    dom: {
        // Show element
        show: (element) => {
            if (typeof element === 'string') {
                element = document.getElementById(element);
            }
            if (element) {
                element.classList.add('show');
                element.classList.remove('hide');
            }
        },
        
        // Hide element
        hide: (element) => {
            if (typeof element === 'string') {
                element = document.getElementById(element);
            }
            if (element) {
                element.classList.remove('show');
                element.classList.add('hide');
            }
        },
        
        // Toggle element visibility
        toggle: (element) => {
            if (typeof element === 'string') {
                element = document.getElementById(element);
            }
            if (element) {
                element.classList.toggle('show');
            }
        },
        
        // Set element text content safely
        setText: (elementId, text) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = text;
            }
        },
        
        // Set element HTML content safely
        setHTML: (elementId, html) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
            }
        },
        
        // Add CSS class
        addClass: (element, className) => {
            if (typeof element === 'string') {
                element = document.getElementById(element);
            }
            if (element) {
                element.classList.add(className);
            }
        },
        
        // Remove CSS class
        removeClass: (element, className) => {
            if (typeof element === 'string') {
                element = document.getElementById(element);
            }
            if (element) {
                element.classList.remove(className);
            }
        }
    },
    
    // Storage utilities
    storage: {
        // Set item in localStorage with error handling
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                return false;
            }
        },
        
        // Get item from localStorage with error handling
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                return defaultValue;
            }
        },
        
        // Remove item from localStorage
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing from localStorage:', error);
                return false;
            }
        }
    },
    
    // API utilities
    api: {
        // Build URL with query parameters
        buildURL: (baseURL, params) => {
            const url = new URL(baseURL);
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    if (Array.isArray(params[key])) {
                        url.searchParams.set(key, params[key].join(','));
                    } else {
                        url.searchParams.set(key, params[key]);
                    }
                }
            });
            return url.toString();
        },
        
        // Fetch with timeout and error handling
        fetchWithTimeout: async (url, options = {}, timeout = 10000) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            try {
                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
                }
                
                return await response.json();
            } catch (error) {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout');
                }
                throw error;
            }
        }
    },
    
    // General utilities
    general: {
        // Debounce function
        debounce: (func, delay) => {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(null, args), delay);
            };
        },
        
        // Throttle function
        throttle: (func, limit) => {
            let inThrottle;
            return (...args) => {
                if (!inThrottle) {
                    func.apply(null, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // Check if value is valid number
        isValidNumber: (value) => {
            return value !== null && value !== undefined && !isNaN(value) && isFinite(value);
        },
        
        // Capitalize first letter of each word
        capitalizeWords: (str) => {
            return str.replace(/\b\w/g, l => l.toUpperCase());
        },
        
        // Generate random ID
        generateId: () => {
            return Math.random().toString(36).substr(2, 9);
        }
    }
};

// Make Utils available globally
window.Utils = Utils;