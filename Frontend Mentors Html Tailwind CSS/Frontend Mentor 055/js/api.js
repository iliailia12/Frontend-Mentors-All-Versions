// API module for weather data and geocoding
const WeatherAPI = {
    
    // Cache for storing recent API responses
    cache: new Map(),
    
    // Geocoding: Search for cities
    async searchCities(query) {
        try {
            if (!query || query.trim().length < 2) {
                return [];
            }
            
            const params = {
                name: query.trim(),
                count: CONFIG.SETTINGS.MAX_SEARCH_RESULTS,
                language: 'en',
                format: 'json'
            };
            
            const url = Utils.api.buildURL(CONFIG.API.GEOCODING, params);
            const data = await Utils.api.fetchWithTimeout(url);
            
            return data.results || [];
        } catch (error) {
            console.error('Error searching cities:', error);
            throw new Error('Failed to search cities. Please check your internet connection.');
        }
    },
    
    // Get current position using geolocation API
    async getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
                return;
            }
            
            const options = {
                enableHighAccuracy: true,
                timeout: CONFIG.SETTINGS.GEOLOCATION_TIMEOUT,
                maximumAge: 5 * 60 * 1000 // 5 minutes
            };
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    let message = 'Unable to retrieve your location.';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = 'Location access denied. Please enable location services.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = 'Location information is unavailable.';
                            break;
                        case error.TIMEOUT:
                            message = 'Location request timed out. Please try again.';
                            break;
                    }
                    reject(new Error(message));
                },
                options
            );
        });
    },
    
    // Reverse geocoding: Get city name from coordinates
    async getCityFromCoordinates(latitude, longitude) {
        try {
            const params = {
                latitude: latitude,
                longitude: longitude,
                count: 1,
                language: 'en',
                format: 'json'
            };
            
            // Use a reverse geocoding service (we'll search for the nearest city)
            const url = Utils.api.buildURL(CONFIG.API.GEOCODING, params);
            const data = await Utils.api.fetchWithTimeout(url);
            
            if (data.results && data.results.length > 0) {
                return data.results[0];
            } else {
                // Fallback: return coordinates as location name
                return {
                    name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
                    latitude: latitude,
                    longitude: longitude,
                    country: 'Unknown',
                    admin1: ''
                };
            }
        } catch (error) {
            console.error('Error getting city from coordinates:', error);
            // Return coordinates as fallback
            return {
                name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
                latitude: latitude,
                longitude: longitude,
                country: 'Unknown',
                admin1: ''
            };
        }
    },
    
    // Get weather data for a location
    async getWeatherData(latitude, longitude) {
        try {
            // Check cache first
            const cacheKey = `weather_${latitude}_${longitude}`;
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                console.log('Using cached weather data');
                return cached;
            }
            
            const params = {
                latitude: latitude,
                longitude: longitude,
                current: CONFIG.WEATHER_PARAMS.current,
                hourly: CONFIG.WEATHER_PARAMS.hourly,
                daily: CONFIG.WEATHER_PARAMS.daily,
                timezone: CONFIG.API.TIMEZONE,
                forecast_days: CONFIG.SETTINGS.FORECAST_DAYS
            };
            
            const url = Utils.api.buildURL(CONFIG.API.WEATHER, params);
            const data = await Utils.api.fetchWithTimeout(url);
            
            // Process and validate the data
            const processedData = this.processWeatherData(data);
            
            // Cache the result
            this.setCachedData(cacheKey, processedData);
            
            return processedData;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw new Error('Failed to fetch weather data. Please check your internet connection and try again.');
        }
    },
    
    // Process raw weather data from API
    processWeatherData(rawData) {
        try {
            const current = rawData.current || {};
            const hourly = rawData.hourly || {};
            const daily = rawData.daily || {};
            
            return {
                current: {
                    time: current.time || new Date().toISOString(),
                    temperature: current.temperature_2m,
                    apparent_temperature: current.apparent_temperature,
                    humidity: current.relative_humidity_2m,
                    precipitation: current.precipitation,
                    weather_code: current.weather_code,
                    cloud_cover: current.cloud_cover,
                    pressure: current.surface_pressure,
                    wind_speed: current.wind_speed_10m,
                    wind_direction: current.wind_direction_10m,
                    is_day: current.is_day
                },
                hourly: this.processHourlyData(hourly),
                daily: this.processDailyData(daily),
                timezone: rawData.timezone || 'UTC',
                elevation: rawData.elevation || 0
            };
        } catch (error) {
            console.error('Error processing weather data:', error);
            throw new Error('Invalid weather data received from server.');
        }
    },
    
    // Process hourly forecast data
    processHourlyData(hourlyData) {
        if (!hourlyData.time || !Array.isArray(hourlyData.time)) {
            return [];
        }
        
        const hourlyForecast = [];
        const maxHours = Math.min(
            CONFIG.SETTINGS.HOURLY_FORECAST_HOURS,
            hourlyData.time.length
        );
        
        for (let i = 0; i < maxHours; i++) {
            hourlyForecast.push({
                time: hourlyData.time[i],
                temperature: hourlyData.temperature_2m?.[i],
                humidity: hourlyData.relative_humidity_2m?.[i],
                precipitation_probability: hourlyData.precipitation_probability?.[i],
                precipitation: hourlyData.precipitation?.[i],
                weather_code: hourlyData.weather_code?.[i],
                cloud_cover: hourlyData.cloud_cover?.[i],
                visibility: hourlyData.visibility?.[i],
                wind_speed: hourlyData.wind_speed_10m?.[i],
                wind_direction: hourlyData.wind_direction_10m?.[i]
            });
        }
        
        return hourlyForecast;
    },
    
    // Process daily forecast data
    processDailyData(dailyData) {
        if (!dailyData.time || !Array.isArray(dailyData.time)) {
            return [];
        }
        
        const dailyForecast = [];
        const maxDays = Math.min(
            CONFIG.SETTINGS.FORECAST_DAYS,
            dailyData.time.length
        );
        
        for (let i = 0; i < maxDays; i++) {
            dailyForecast.push({
                date: dailyData.time[i],
                weather_code: dailyData.weather_code?.[i],
                temperature_max: dailyData.temperature_2m_max?.[i],
                temperature_min: dailyData.temperature_2m_min?.[i],
                apparent_temperature_max: dailyData.apparent_temperature_max?.[i],
                apparent_temperature_min: dailyData.apparent_temperature_min?.[i],
                precipitation_sum: dailyData.precipitation_sum?.[i],
                precipitation_probability: dailyData.precipitation_probability_max?.[i],
                wind_speed_max: dailyData.wind_speed_10m_max?.[i],
                wind_gusts_max: dailyData.wind_gusts_10m_max?.[i],
                wind_direction: dailyData.wind_direction_10m_dominant?.[i]
            });
        }
        
        return dailyForecast;
    },
    
    // Cache management
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < CONFIG.SETTINGS.CACHE_DURATION) {
            return cached.data;
        }
        // Remove expired cache entry
        if (cached) {
            this.cache.delete(key);
        }
        return null;
    },
    
    setCachedData(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
        
        // Cleanup old cache entries (keep only last 10)
        if (this.cache.size > 10) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
    },
    
    // Clear all cached data
    clearCache() {
        this.cache.clear();
    },
    
    // Get complete weather information for a city
    async getWeatherForCity(cityName) {
        try {
            // First, search for the city to get coordinates
            const cities = await this.searchCities(cityName);
            if (!cities || cities.length === 0) {
                throw new Error(`City "${cityName}" not found. Please check the spelling and try again.`);
            }
            
            const city = cities[0]; // Use the first result
            
            // Get weather data for the city
            const weatherData = await this.getWeatherData(city.latitude, city.longitude);
            
            return {
                location: {
                    name: city.name,
                    country: city.country,
                    admin1: city.admin1,
                    latitude: city.latitude,
                    longitude: city.longitude
                },
                weather: weatherData
            };
        } catch (error) {
            console.error('Error getting weather for city:', error);
            throw error;
        }
    },
    
    // Get weather for current location
    async getWeatherForCurrentLocation() {
        try {
            // Get current position
            const position = await this.getCurrentPosition();
            
            // Get city information from coordinates
            const location = await this.getCityFromCoordinates(
                position.latitude, 
                position.longitude
            );
            
            // Get weather data
            const weatherData = await this.getWeatherData(
                position.latitude, 
                position.longitude
            );
            
            return {
                location: {
                    name: location.name,
                    country: location.country || 'Unknown',
                    admin1: location.admin1 || '',
                    latitude: position.latitude,
                    longitude: position.longitude
                },
                weather: weatherData
            };
        } catch (error) {
            console.error('Error getting weather for current location:', error);
            throw error;
        }
    },
    
    // Health check for API availability
    async checkAPIHealth() {
        try {
            // Try a simple geocoding request
            const testUrl = Utils.api.buildURL(CONFIG.API.GEOCODING, {
                name: 'London',
                count: 1,
                format: 'json'
            });
            
            await Utils.api.fetchWithTimeout(testUrl, {}, 5000);
            return true;
        } catch (error) {
            console.error('API health check failed:', error);
            return false;
        }
    }
};

// Make WeatherAPI available globally
window.WeatherAPI = WeatherAPI;