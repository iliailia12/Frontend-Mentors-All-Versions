const WeatherApp = {
    
    async init() {
        try {
            console.log('Weather App initializing...');
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        } catch (error) {
            console.error('Failed to initialize Weather App:', error);
            this.handleInitError(error);
        }
    },
    
    async start() {
        try {
            UI.init();
            
            const apiHealthy = await this.checkAPIHealth();
            if (!apiHealthy) {
                console.warn('API health check failed, but continuing...');
            }
            
            await UI.loadDefaultWeather();
            
            console.log('Weather App initialized successfully');
        } catch (error) {
            console.error('Failed to start Weather App:', error);
            UI.showError('Failed to load weather data. Please refresh the page and try again.');
        }
    },
    
    async checkAPIHealth() {
        try {
            return await Promise.race([
                WeatherAPI.checkAPIHealth(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Health check timeout')), 5000)
                )
            ]);
        } catch (error) {
            console.warn('API health check failed:', error.message);
            return false;
        }
    },
    
    handleInitError(error) {
        const errorContainer = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorContainer && errorText) {
            errorText.textContent = 'Failed to initialize the weather app. Please refresh the page.';
            errorContainer.style.display = 'flex';
        } else {
            document.body.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 20px;
                    text-align: center;
                    font-family: system-ui, sans-serif;
                ">
                    <h1 style="color: #e53e3e; margin-bottom: 16px;">❌ App Error</h1>
                    <p style="color: #4a5568; margin-bottom: 24px;">
                        Failed to initialize the weather app. Please refresh the page and try again.
                    </p>
                    <button onclick="location.reload()" style="
                        background: #3182ce;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                    ">
                        Refresh Page
                    </button>
                    <p style="color: #718096; font-size: 14px; margin-top: 16px;">
                        Error: ${error.message}
                    </p>
                </div>
            `;
        }
    }
};

const ServiceWorkerManager = {
    async register() {
        if ('serviceWorker' in navigator) {
            try {
                console.log('Service Worker support detected (not implemented in this version)');
            } catch (error) {
                console.warn('Service Worker registration failed:', error);
            }
        }
    }
};

const PerformanceMonitor = {
    startTime: performance.now(),
    
    markReady() {
        const loadTime = performance.now() - this.startTime;
        console.log(`Weather App loaded in ${loadTime.toFixed(2)}ms`);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                name: 'load',
                value: Math.round(loadTime)
            });
        }
    },
    
    logMetrics() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                console.log('Performance Metrics:', {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    totalLoad: navigation.loadEventEnd - navigation.navigationStart
                });
            }
        }
    }
};

const ErrorHandler = {
    init() {
        window.addEventListener('error', this.handleError.bind(this));
        
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    },
    
    handleError(event) {
        console.error('Uncaught error:', event.error);
        
        if (this.isCriticalError(event.error)) {
            UI.showError('An unexpected error occurred. Please refresh the page.');
        }
        
        this.logError({
            type: 'javascript_error',
            message: event.error?.message || 'Unknown error',
            stack: event.error?.stack,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    },
    
    handlePromiseRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        

        event.preventDefault();
        

        this.logError({
            type: 'promise_rejection',
            message: event.reason?.message || event.reason || 'Unknown promise rejection',
            stack: event.reason?.stack
        });
    },

    isCriticalError(error) {
        if (!error) return false;
        
        const criticalPatterns = [
            /network/i,
            /fetch/i,
            /api/i,
            /initialization/i,
            /cannot read property/i
        ];
        
        return criticalPatterns.some(pattern => 
            pattern.test(error.message || error.toString())
        );
    },
    
    logError(errorData) {
        console.log('Error logged:', errorData);
    }
};

// Development helpers
const DevHelpers = {
    // Check if in development mode
    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.protocol === 'file:';
    },
    
    // Add development tools to window
    addDevTools() {
        if (this.isDevelopment()) {
            window.WeatherAppDev = {
                config: CONFIG,
                utils: Utils,
                api: WeatherAPI,
                ui: UI,
                app: WeatherApp,
                clearCache: () => WeatherAPI.clearCache(),
                clearStorage: () => {
                    Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
                        localStorage.removeItem(key);
                    });
                    console.log('Local storage cleared');
                },
                testError: () => {
                    throw new Error('Test error for development');
                }
            };
            
            console.log('Development tools available at window.WeatherAppDev');
        }
    }
};

const AppLifecycle = {
    init() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));
    },
    
    handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            const lastUpdate = Utils.storage.get('last_weather_update');
            const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
            
            if (!lastUpdate || lastUpdate < fiveMinutesAgo) {
                console.log('Page visible after extended time, refreshing weather data');
                if (UI.currentWeatherData) {
                    const lastLocation = Utils.storage.get(CONFIG.STORAGE_KEYS.LAST_LOCATION);
                    if (lastLocation && lastLocation.type === 'city') {
                        UI.loadWeatherForCity(lastLocation.name);
                    } else if (lastLocation && lastLocation.type === 'coordinates') {
                        UI.loadWeatherForCurrentLocation();
                    }
                }
            }
        }
    },
    
    handleBeforeUnload() {
        Utils.storage.set('last_weather_update', Date.now());
    },
    
    handleOnline() {
        console.log('Browser is online');
    },
    
    handleOffline() {
        console.log('Browser is offline');
    }
};

(async function() {
    try {
        ErrorHandler.init();
        AppLifecycle.init();
        DevHelpers.addDevTools();
        await ServiceWorkerManager.register();
        await WeatherApp.init();
        PerformanceMonitor.markReady();
        PerformanceMonitor.logMetrics();
        
    } catch (error) {
        console.error('Failed to initialize Weather App:', error);
        ErrorHandler.handleError({ error });
    }
})();


if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherApp;
}

window.WeatherApp = WeatherApp;