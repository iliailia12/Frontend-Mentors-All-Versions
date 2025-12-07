// Main Weather App
const WeatherApp = {
    
    // App initialization
    async init() {
        try {
            console.log('Weather App initializing...');
            
            // Wait for DOM to be ready
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
    
    // Start the application
    async start() {
        try {
            // Initialize UI components
            UI.init();
            
            // Check API health (optional)
            const apiHealthy = await this.checkAPIHealth();
            if (!apiHealthy) {
                console.warn('API health check failed, but continuing...');
            }
            
            // Load default weather data
            await UI.loadDefaultWeather();
            
            console.log('Weather App initialized successfully');
        } catch (error) {
            console.error('Failed to start Weather App:', error);
            UI.showError('Failed to load weather data. Please refresh the page and try again.');
        }
    },
    
    // Check API health with timeout
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
    
    // Handle initialization errors
    handleInitError(error) {
        const errorContainer = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorContainer && errorText) {
            errorText.textContent = 'Failed to initialize the weather app. Please refresh the page.';
            errorContainer.style.display = 'flex';
        } else {
            // Fallback if error elements don't exist
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

// Service Worker registration (if available)
const ServiceWorkerManager = {
    async register() {
        if ('serviceWorker' in navigator) {
            try {
                // We're not implementing a service worker in this basic version
                // but this is where it would be registered for offline functionality
                console.log('Service Worker support detected (not implemented in this version)');
            } catch (error) {
                console.warn('Service Worker registration failed:', error);
            }
        }
    }
};

// Performance monitoring
const PerformanceMonitor = {
    startTime: performance.now(),
    
    // Mark app as ready
    markReady() {
        const loadTime = performance.now() - this.startTime;
        console.log(`Weather App loaded in ${loadTime.toFixed(2)}ms`);
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                name: 'load',
                value: Math.round(loadTime)
            });
        }
    },
    
    // Log performance metrics
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

// Error handling and logging
const ErrorHandler = {
    // Global error handler
    init() {
        // Handle uncaught errors
        window.addEventListener('error', this.handleError.bind(this));
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    },
    
    // Handle JavaScript errors
    handleError(event) {
        console.error('Uncaught error:', event.error);
        
        // Don't show error UI for every small error
        if (this.isCriticalError(event.error)) {
            UI.showError('An unexpected error occurred. Please refresh the page.');
        }
        
        // Log to external service if available
        this.logError({
            type: 'javascript_error',
            message: event.error?.message || 'Unknown error',
            stack: event.error?.stack,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    },
    
    // Handle promise rejections
    handlePromiseRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        
        // Prevent the default browser console error
        event.preventDefault();
        
        // Log the error
        this.logError({
            type: 'promise_rejection',
            message: event.reason?.message || event.reason || 'Unknown promise rejection',
            stack: event.reason?.stack
        });
    },
    
    // Determine if error is critical enough to show to user
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
    
    // Log error to external service
    logError(errorData) {
        // In production, you would send this to your error tracking service
        // For now, we'll just log to console
        console.log('Error logged:', errorData);
        
        // Example of sending to external service:
        /*
        if (typeof fetch !== 'undefined' && window.location.hostname !== 'localhost') {
            fetch('/api/errors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(errorData)
            }).catch(err => console.warn('Failed to log error:', err));
        }
        */
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

// App lifecycle management
const AppLifecycle = {
    // Handle page visibility changes
    init() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));
    },
    
    // Handle when page becomes visible/hidden
    handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            // Page became visible - refresh data if it's been a while
            const lastUpdate = Utils.storage.get('last_weather_update');
            const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
            
            if (!lastUpdate || lastUpdate < fiveMinutesAgo) {
                console.log('Page visible after extended time, refreshing weather data');
                if (UI.currentWeatherData) {
                    // Refresh current location weather
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
    
    // Handle before page unload
    handleBeforeUnload() {
        // Save timestamp of last activity
        Utils.storage.set('last_weather_update', Date.now());
    },
    
    // Handle when browser comes online
    handleOnline() {
        console.log('Browser is online');
        // Could retry failed requests or refresh data
    },
    
    // Handle when browser goes offline
    handleOffline() {
        console.log('Browser is offline');
        // Could show offline message or cache status
    }
};

// Initialize everything when the script loads
(async function() {
    try {
        // Initialize error handling first
        ErrorHandler.init();
        
        // Initialize app lifecycle handlers
        AppLifecycle.init();
        
        // Add development tools if in dev mode
        DevHelpers.addDevTools();
        
        // Register service worker (if implemented)
        await ServiceWorkerManager.register();
        
        // Start the main app
        await WeatherApp.init();
        
        // Mark app as ready and log performance
        PerformanceMonitor.markReady();
        PerformanceMonitor.logMetrics();
        
    } catch (error) {
        console.error('Failed to initialize Weather App:', error);
        ErrorHandler.handleError({ error });
    }
})();

// Export for module use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherApp;
}

// Make available globally
window.WeatherApp = WeatherApp;