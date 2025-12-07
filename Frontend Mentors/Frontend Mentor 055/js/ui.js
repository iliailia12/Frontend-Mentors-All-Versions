// UI module for handling DOM updates and user interface
const UI = {
    
    // Current unit preference
    currentUnit: 'celsius',
    
    // Current weather data
    currentWeatherData: null,
    
    // Initialize UI
    init() {
        this.loadPreferences();
        this.bindEvents();
    },
    
    // Load user preferences from localStorage
    loadPreferences() {
        const savedUnit = Utils.storage.get(CONFIG.STORAGE_KEYS.PREFERRED_UNIT, 'celsius');
        this.setUnit(savedUnit);
    },
    
    // Bind event listeners
    bindEvents() {
        // Unit toggle buttons
        const unitButtons = document.querySelectorAll('.unit-btn');
        unitButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const unit = e.target.dataset.unit;
                this.setUnit(unit);
                if (this.currentWeatherData) {
                    this.updateWeatherDisplay(this.currentWeatherData);
                }
            });
        });
        
        // Search functionality
        const searchInput = document.getElementById(CONFIG.ELEMENTS.CITY_SEARCH);
        const searchBtn = document.getElementById(CONFIG.ELEMENTS.SEARCH_BTN);
        const locationBtn = document.getElementById(CONFIG.ELEMENTS.LOCATION_BTN);
        
        if (searchInput) {
            // Debounced search suggestions
            const debouncedSearch = Utils.general.debounce(
                this.handleSearchInput.bind(this), 
                CONFIG.SETTINGS.SEARCH_DELAY
            );
            
            searchInput.addEventListener('input', debouncedSearch);
            searchInput.addEventListener('keydown', this.handleSearchKeydown.bind(this));
            searchInput.addEventListener('blur', () => {
                // Hide suggestions after a delay to allow for clicks
                setTimeout(() => this.hideSuggestions(), 150);
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', this.handleSearchClick.bind(this));
        }
        
        if (locationBtn) {
            locationBtn.addEventListener('click', this.handleLocationClick.bind(this));
        }
        
        // Retry button
        const retryBtn = document.getElementById(CONFIG.ELEMENTS.RETRY_BTN);
        if (retryBtn) {
            retryBtn.addEventListener('click', this.handleRetry.bind(this));
        }
        
        // Click outside to hide suggestions
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-input-wrapper') && 
                !e.target.closest('.search-suggestions')) {
                this.hideSuggestions();
            }
        });
    },
    
    // Set temperature unit
    setUnit(unit) {
        this.currentUnit = unit;
        
        // Update UI buttons
        const unitButtons = document.querySelectorAll('.unit-btn');
        unitButtons.forEach(btn => {
            if (btn.dataset.unit === unit) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Save preference
        Utils.storage.set(CONFIG.STORAGE_KEYS.PREFERRED_UNIT, unit);
    },
    
    // Show loading state
    showLoading() {
        Utils.dom.hide(CONFIG.ELEMENTS.ERROR_MESSAGE);
        Utils.dom.hide(CONFIG.ELEMENTS.WEATHER_CONTENT);
        Utils.dom.show(CONFIG.ELEMENTS.LOADING_STATE);
    },
    
    // Show error message
    showError(message) {
        Utils.dom.hide(CONFIG.ELEMENTS.LOADING_STATE);
        Utils.dom.hide(CONFIG.ELEMENTS.WEATHER_CONTENT);
        Utils.dom.setText(CONFIG.ELEMENTS.ERROR_TEXT, message);
        Utils.dom.show(CONFIG.ELEMENTS.ERROR_MESSAGE);
    },
    
    // Show weather content
    showWeatherContent() {
        Utils.dom.hide(CONFIG.ELEMENTS.LOADING_STATE);
        Utils.dom.hide(CONFIG.ELEMENTS.ERROR_MESSAGE);
        Utils.dom.show(CONFIG.ELEMENTS.WEATHER_CONTENT);
    },
    
    // Update weather display
    updateWeatherDisplay(data) {
        this.currentWeatherData = data;
        this.showWeatherContent();
        
        try {
            this.updateCurrentWeather(data.location, data.weather.current);
            this.updateHourlyForecast(data.weather.hourly);
            this.updateDailyForecast(data.weather.daily);
            
            // Add fade-in animation
            const weatherContent = document.getElementById(CONFIG.ELEMENTS.WEATHER_CONTENT);
            if (weatherContent) {
                weatherContent.classList.add('fade-in');
                setTimeout(() => weatherContent.classList.remove('fade-in'), 500);
            }
        } catch (error) {
            console.error('Error updating weather display:', error);
            this.showError('Error displaying weather data');
        }
    },
    
    // Update current weather section
    updateCurrentWeather(location, current) {
        // Location and date
        const locationName = location.admin1 ? 
            `${location.name}, ${location.admin1}` : 
            `${location.name}, ${location.country}`;
        Utils.dom.setText(CONFIG.ELEMENTS.CURRENT_LOCATION, locationName);
        Utils.dom.setText(CONFIG.ELEMENTS.CURRENT_DATE, Utils.format.date(current.time));
        
        // Temperature
        const temp = Utils.format.temperature(current.temperature, this.currentUnit);
        Utils.dom.setText(CONFIG.ELEMENTS.CURRENT_TEMP, temp);
        
        // Weather icon and description
        const weatherIcon = Utils.weather.getIcon(current.weather_code, current.is_day);
        const description = Utils.weather.getDescription(current.weather_code);
        Utils.dom.setText(CONFIG.ELEMENTS.CURRENT_WEATHER_ICON, weatherIcon);
        Utils.dom.setText(CONFIG.ELEMENTS.WEATHER_DESCRIPTION, description);
        
        // Feels like temperature
        const feelsLike = Utils.format.temperature(current.apparent_temperature, this.currentUnit);
        Utils.dom.setText(CONFIG.ELEMENTS.FEELS_LIKE, feelsLike);
        
        // Weather stats
        Utils.dom.setText(CONFIG.ELEMENTS.HUMIDITY, Utils.format.humidity(current.humidity));
        Utils.dom.setText(CONFIG.ELEMENTS.WIND_SPEED, Utils.format.windSpeed(current.wind_speed, this.currentUnit));
        Utils.dom.setText(CONFIG.ELEMENTS.VISIBILITY, Utils.format.visibility(10000, this.currentUnit)); // Default visibility
        Utils.dom.setText(CONFIG.ELEMENTS.PRESSURE, Utils.format.pressure(current.pressure, this.currentUnit));
    },
    
    // Update hourly forecast
    updateHourlyForecast(hourlyData) {
        const container = document.getElementById(CONFIG.ELEMENTS.HOURLY_FORECAST);
        if (!container || !hourlyData) return;
        
        container.innerHTML = '';
        
        hourlyData.forEach(hour => {
            const hourElement = this.createHourlyItem(hour);
            container.appendChild(hourElement);
        });
    },
    
    // Create hourly forecast item
    createHourlyItem(hourData) {
        const div = document.createElement('div');
        div.className = 'hourly-item';
        
        const time = Utils.format.time(hourData.time);
        const temp = Utils.format.temperature(hourData.temperature, this.currentUnit);
        const icon = Utils.weather.getIcon(hourData.weather_code, true); // Assume day for hourly
        const precipitation = hourData.precipitation_probability || 0;
        
        div.innerHTML = `
            <div class="hourly-time">${time}</div>
            <div class="hourly-icon">${icon}</div>
            <div class="hourly-temp">${temp}°</div>
            <div class="hourly-desc">${precipitation}%</div>
        `;
        
        return div;
    },
    
    // Update daily forecast
    updateDailyForecast(dailyData) {
        const container = document.getElementById(CONFIG.ELEMENTS.DAILY_FORECAST);
        if (!container || !dailyData) return;
        
        container.innerHTML = '';
        
        dailyData.forEach(day => {
            const dayElement = this.createDailyItem(day);
            container.appendChild(dayElement);
        });
    },
    
    // Create daily forecast item
    createDailyItem(dayData) {
        const div = document.createElement('div');
        div.className = 'daily-item';
        
        const date = Utils.format.dayOfWeek(dayData.date);
        const icon = Utils.weather.getIcon(dayData.weather_code, true);
        const description = Utils.weather.getDescription(dayData.weather_code);
        const high = Utils.format.temperature(dayData.temperature_max, this.currentUnit);
        const low = Utils.format.temperature(dayData.temperature_min, this.currentUnit);
        
        div.innerHTML = `
            <div class="daily-date">${date}</div>
            <div class="daily-weather">
                <div class="daily-icon">${icon}</div>
                <div class="daily-desc">${description}</div>
            </div>
            <div class="daily-temps">
                <span class="daily-high">${high}°</span>
                <span class="daily-low">${low}°</span>
            </div>
        `;
        
        return div;
    },
    
    // Handle search input
    async handleSearchInput(event) {
        const query = event.target.value.trim();
        
        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }
        
        try {
            const cities = await WeatherAPI.searchCities(query);
            this.showSuggestions(cities);
        } catch (error) {
            console.error('Search error:', error);
            this.hideSuggestions();
        }
    },
    
    // Handle search keydown events
    handleSearchKeydown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.handleSearchClick();
        } else if (event.key === 'Escape') {
            this.hideSuggestions();
            event.target.blur();
        }
    },
    
    // Handle search button click
    async handleSearchClick() {
        const searchInput = document.getElementById(CONFIG.ELEMENTS.CITY_SEARCH);
        const query = searchInput.value.trim();
        
        if (!query) return;
        
        this.hideSuggestions();
        await this.loadWeatherForCity(query);
    },
    
    // Handle location button click
    async handleLocationClick() {
        await this.loadWeatherForCurrentLocation();
    },
    
    // Handle retry button click
    handleRetry() {
        const lastLocation = Utils.storage.get(CONFIG.STORAGE_KEYS.LAST_LOCATION);
        if (lastLocation && lastLocation.type === 'city') {
            this.loadWeatherForCity(lastLocation.name);
        } else if (lastLocation && lastLocation.type === 'coordinates') {
            this.loadWeatherForCurrentLocation();
        } else {
            this.loadWeatherForCity(CONFIG.SETTINGS.DEFAULT_CITY);
        }
    },
    
    // Show search suggestions
    showSuggestions(cities) {
        const container = document.getElementById(CONFIG.ELEMENTS.SEARCH_SUGGESTIONS);
        if (!container) return;
        
        if (!cities || cities.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        container.innerHTML = '';
        
        cities.forEach(city => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = `${city.name}, ${city.country}${city.admin1 ? ` (${city.admin1})` : ''}`;
            
            div.addEventListener('click', () => {
                this.selectCity(city);
            });
            
            container.appendChild(div);
        });
        
        container.style.display = 'block';
    },
    
    // Hide search suggestions
    hideSuggestions() {
        const container = document.getElementById(CONFIG.ELEMENTS.SEARCH_SUGGESTIONS);
        if (container) {
            container.style.display = 'none';
        }
    },
    
    // Select a city from suggestions
    async selectCity(city) {
        const searchInput = document.getElementById(CONFIG.ELEMENTS.CITY_SEARCH);
        if (searchInput) {
            searchInput.value = city.name;
        }
        
        this.hideSuggestions();
        await this.loadWeatherForCity(city.name);
    },
    
    // Load weather for a city
    async loadWeatherForCity(cityName) {
        this.showLoading();
        
        try {
            const data = await WeatherAPI.getWeatherForCity(cityName);
            this.updateWeatherDisplay(data);
            
            // Save last location
            Utils.storage.set(CONFIG.STORAGE_KEYS.LAST_LOCATION, {
                type: 'city',
                name: cityName
            });
        } catch (error) {
            console.error('Error loading weather for city:', error);
            this.showError(error.message);
        }
    },
    
    // Load weather for current location
    async loadWeatherForCurrentLocation() {
        this.showLoading();
        
        try {
            const data = await WeatherAPI.getWeatherForCurrentLocation();
            this.updateWeatherDisplay(data);
            
            // Save last location
            Utils.storage.set(CONFIG.STORAGE_KEYS.LAST_LOCATION, {
                type: 'coordinates',
                latitude: data.location.latitude,
                longitude: data.location.longitude
            });
        } catch (error) {
            console.error('Error loading weather for current location:', error);
            this.showError(error.message);
        }
    },
    
    // Load default weather on app start
    async loadDefaultWeather() {
        // Check if there's a saved location
        const lastLocation = Utils.storage.get(CONFIG.STORAGE_KEYS.LAST_LOCATION);
        
        if (lastLocation && lastLocation.type === 'city') {
            await this.loadWeatherForCity(lastLocation.name);
        } else if (lastLocation && lastLocation.type === 'coordinates') {
            try {
                await this.loadWeatherForCurrentLocation();
            } catch (error) {
                // Fallback to default city if geolocation fails
                await this.loadWeatherForCity(CONFIG.SETTINGS.DEFAULT_CITY);
            }
        } else {
            // Load default city
            await this.loadWeatherForCity(CONFIG.SETTINGS.DEFAULT_CITY);
        }
    }
};

// Make UI available globally
window.UI = UI;
