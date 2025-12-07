const UI = {
    currentUnit: 'celsius',
    currentWeatherData: null,
    
    init() {
        this.loadPreferences();
        this.bindEvents();
    },
    
    loadPreferences() {
        const savedUnit = Utils.storage.get(CONFIG.STORAGE_KEYS.PREFERRED_UNIT, 'celsius');
        this.setUnit(savedUnit);
    },
    
    bindEvents() {
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
        
        const searchInput = document.getElementById(CONFIG.ELEMENTS.CITY_SEARCH);
        const searchBtn = document.getElementById(CONFIG.ELEMENTS.SEARCH_BTN);
        const locationBtn = document.getElementById(CONFIG.ELEMENTS.LOCATION_BTN);
        
        if (searchInput) {
            const debouncedSearch = Utils.general.debounce(
                this.handleSearchInput.bind(this), 
                CONFIG.SETTINGS.SEARCH_DELAY
            );
            
            searchInput.addEventListener('input', debouncedSearch);
            searchInput.addEventListener('keydown', this.handleSearchKeydown.bind(this));
            searchInput.addEventListener('blur', () => {
                setTimeout(() => this.hideSuggestions(), 150);
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', this.handleSearchClick.bind(this));
        }
        
        if (locationBtn) {
            locationBtn.addEventListener('click', this.handleLocationClick.bind(this));
        }
        
        const retryBtn = document.getElementById(CONFIG.ELEMENTS.RETRY_BTN);
        if (retryBtn) {
            retryBtn.addEventListener('click', this.handleRetry.bind(this));
        }
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-input-wrapper') && 
                !e.target.closest('.search-suggestions')) {
                this.hideSuggestions();
            }
        });
    },
    
    setUnit(unit) {
        this.currentUnit = unit;

        const unitButtons = document.querySelectorAll('.unit-btn');
        unitButtons.forEach(btn => {
            if (btn.dataset.unit === unit) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        Utils.storage.set(CONFIG.STORAGE_KEYS.PREFERRED_UNIT, unit);
    },
    
    showLoading() {
        Utils.dom.hide(CONFIG.ELEMENTS.ERROR_MESSAGE);
        Utils.dom.hide(CONFIG.ELEMENTS.WEATHER_CONTENT);
        Utils.dom.show(CONFIG.ELEMENTS.LOADING_STATE);
    },

    showError(message) {
        Utils.dom.hide(CONFIG.ELEMENTS.LOADING_STATE);
        Utils.dom.hide(CONFIG.ELEMENTS.WEATHER_CONTENT);
        Utils.dom.setText(CONFIG.ELEMENTS.ERROR_TEXT, message);
        Utils.dom.show(CONFIG.ELEMENTS.ERROR_MESSAGE);
    },
    
    showWeatherContent() {
        Utils.dom.hide(CONFIG.ELEMENTS.LOADING_STATE);
        Utils.dom.hide(CONFIG.ELEMENTS.ERROR_MESSAGE);
        Utils.dom.show(CONFIG.ELEMENTS.WEATHER_CONTENT);
    },

    updateWeatherDisplay(data) {
        this.currentWeatherData = data;
        this.showWeatherContent();
        
        try {
            this.updateCurrentWeather(data.location, data.weather.current);
            this.updateHourlyForecast(data.weather.hourly);
            this.updateDailyForecast(data.weather.daily);
            
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
    
    updateCurrentWeather(location, current) {
        const locationName = location.admin1 ? 
            `${location.name}, ${location.admin1}` : 
            `${location.name}, ${location.country}`;
        Utils.dom.setText(CONFIG.ELEMENTS.CURRENT_LOCATION, locationName);
        Utils.dom.setText(CONFIG.ELEMENTS.CURRENT_DATE, Utils.format.date(current.time));
        
        const temp = Utils.format.temperature(current.temperature, this.currentUnit);
        Utils.dom.setText(CONFIG.ELEMENTS.CURRENT_TEMP, temp);
        
        const weatherIcon = Utils.weather.getIcon(current.weather_code, current.is_day);
        const description = Utils.weather.getDescription(current.weather_code);
        Utils.dom.setText(CONFIG.ELEMENTS.CURRENT_WEATHER_ICON, weatherIcon);
        Utils.dom.setText(CONFIG.ELEMENTS.WEATHER_DESCRIPTION, description);
        
        const feelsLike = Utils.format.temperature(current.apparent_temperature, this.currentUnit);
        Utils.dom.setText(CONFIG.ELEMENTS.FEELS_LIKE, feelsLike);
        
        Utils.dom.setText(CONFIG.ELEMENTS.HUMIDITY, Utils.format.humidity(current.humidity));
        Utils.dom.setText(CONFIG.ELEMENTS.WIND_SPEED, Utils.format.windSpeed(current.wind_speed, this.currentUnit));
        Utils.dom.setText(CONFIG.ELEMENTS.VISIBILITY, Utils.format.visibility(10000, this.currentUnit)); // Default visibility
        Utils.dom.setText(CONFIG.ELEMENTS.PRESSURE, Utils.format.pressure(current.pressure, this.currentUnit));
    },
    
    updateHourlyForecast(hourlyData) {
        const container = document.getElementById(CONFIG.ELEMENTS.HOURLY_FORECAST);
        if (!container || !hourlyData) return;
        
        container.innerHTML = '';
        
        hourlyData.forEach(hour => {
            const hourElement = this.createHourlyItem(hour);
            container.appendChild(hourElement);
        });
    },
    
    createHourlyItem(hourData) {
        const div = document.createElement('div');
        div.className = 'hourly-item';
        
        const time = Utils.format.time(hourData.time);
        const temp = Utils.format.temperature(hourData.temperature, this.currentUnit);
        const icon = Utils.weather.getIcon(hourData.weather_code, true); 
        const precipitation = hourData.precipitation_probability || 0;
        
        div.innerHTML = `
            <div class="hourly-time">${time}</div>
            <div class="hourly-icon">${icon}</div>
            <div class="hourly-temp">${temp}°</div>
            <div class="hourly-desc">${precipitation}%</div>
        `;
        
        return div;
    },
    
    updateDailyForecast(dailyData) {
        const container = document.getElementById(CONFIG.ELEMENTS.DAILY_FORECAST);
        if (!container || !dailyData) return;
        
        container.innerHTML = '';
        
        dailyData.forEach(day => {
            const dayElement = this.createDailyItem(day);
            container.appendChild(dayElement);
        });
    },
    
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
    
    handleSearchKeydown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.handleSearchClick();
        } else if (event.key === 'Escape') {
            this.hideSuggestions();
            event.target.blur();
        }
    },
    

    async handleSearchClick() {
        const searchInput = document.getElementById(CONFIG.ELEMENTS.CITY_SEARCH);
        const query = searchInput.value.trim();
        
        if (!query) return;
        
        this.hideSuggestions();
        await this.loadWeatherForCity(query);
    },

    async handleLocationClick() {
        await this.loadWeatherForCurrentLocation();
    },

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
    

    hideSuggestions() {
        const container = document.getElementById(CONFIG.ELEMENTS.SEARCH_SUGGESTIONS);
        if (container) {
            container.style.display = 'none';
        }
    },
    
    async selectCity(city) {
        const searchInput = document.getElementById(CONFIG.ELEMENTS.CITY_SEARCH);
        if (searchInput) {
            searchInput.value = city.name;
        }
        
        this.hideSuggestions();
        await this.loadWeatherForCity(city.name);
    },

    async loadWeatherForCity(cityName) {
        this.showLoading();
        
        try {
            const data = await WeatherAPI.getWeatherForCity(cityName);
            this.updateWeatherDisplay(data);

            Utils.storage.set(CONFIG.STORAGE_KEYS.LAST_LOCATION, {
                type: 'city',
                name: cityName
            });
        } catch (error) {
            console.error('Error loading weather for city:', error);
            this.showError(error.message);
        }
    },
    
    async loadWeatherForCurrentLocation() {
        this.showLoading();
        
        try {
            const data = await WeatherAPI.getWeatherForCurrentLocation();
            this.updateWeatherDisplay(data);
            
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
    
    async loadDefaultWeather() {
        const lastLocation = Utils.storage.get(CONFIG.STORAGE_KEYS.LAST_LOCATION);
        
        if (lastLocation && lastLocation.type === 'city') {
            await this.loadWeatherForCity(lastLocation.name);
        } else if (lastLocation && lastLocation.type === 'coordinates') {
            try {
                await this.loadWeatherForCurrentLocation();
            } catch (error) {
                await this.loadWeatherForCity(CONFIG.SETTINGS.DEFAULT_CITY);
            }
        } else {
            await this.loadWeatherForCity(CONFIG.SETTINGS.DEFAULT_CITY);
        }
    }
};

window.UI = UI;
