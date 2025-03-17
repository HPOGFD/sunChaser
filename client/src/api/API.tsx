// API.tsx - Weather Service using OpenWeatherMap API

// Define types for weather data
export type CurrentWeatherData = {
    location: string;
    date: string;
    temperature: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    uvIndex?: number;
    precipitation?: number;
    icon: string;
  };
  
  export type ForecastData = {
    date: string;
    temperature: {
      min: number;
      max: number;
    };
    condition: string;
    precipitation?: number;
    icon: string;
  };
  
  export type WeatherResponseData = [CurrentWeatherData, ...ForecastData[]];
  
  // Read API configuration from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.openweathermap.org';
  const API_KEY = import.meta.env.VITE_API_KEY || '05d4ea066979df94f0e1d8bed2ff9f57';
  
  /**
   * Converts temperature from Kelvin to Celsius
   */
  const kelvinToCelsius = (kelvin: number): number => {
    return Math.round((kelvin - 273.15) * 10) / 10;
  };
  
  /**
   * Formats date from timestamp
   */
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  /**
   * Fetches current weather data for a specified city using OpenWeatherMap API
   */
  export const fetchCurrentWeather = async (cityName: string): Promise<CurrentWeatherData> => {
    const url = `${API_BASE_URL}/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      location: data.name,
      date: formatDate(data.dt),
      temperature: kelvinToCelsius(data.main.temp),
      feelsLike: kelvinToCelsius(data.main.feels_like),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      precipitation: data.rain ? data.rain['1h'] : 0,
      icon: data.weather[0].icon,
    };
  };
  
  /**
   * Fetches 5-day forecast data for a specified city using OpenWeatherMap API
   */
  export const fetchForecast = async (cityName: string): Promise<ForecastData[]> => {
    const url = `${API_BASE_URL}/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Group forecast data by day
    const dailyData: { [key: string]: any } = {};
    
    data.list.forEach((item: any) => {
      const date = formatDate(item.dt);
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          icons: [],
          conditions: [],
          precipitation: 0
        };
      }
      
      dailyData[date].temps.push(kelvinToCelsius(item.main.temp));
      dailyData[date].icons.push(item.weather[0].icon);
      dailyData[date].conditions.push(item.weather[0].main);
      
      // Add precipitation if available
      if (item.rain && item.rain['3h']) {
        dailyData[date].precipitation += item.rain['3h'];
      }
    });
    
    // Process daily data into forecast format
    return Object.keys(dailyData).map(date => {
      const dayData = dailyData[date];
      
      // Find most frequent condition
      const conditionCount: { [key: string]: number } = {};
      dayData.conditions.forEach((condition: string) => {
        conditionCount[condition] = (conditionCount[condition] || 0) + 1;
      });
      
      const mostFrequentCondition = Object.keys(conditionCount).reduce((a, b) => 
        conditionCount[a] > conditionCount[b] ? a : b
      );
      
      // Find most frequent icon (for day time)
      const dayIcons = dayData.icons.filter((icon: string) => icon.includes('d'));
      const mostFrequentIcon = dayIcons.length > 0 ? dayIcons[0] : dayData.icons[0];
      
      return {
        date,
        temperature: {
          min: Math.min(...dayData.temps),
          max: Math.max(...dayData.temps)
        },
        condition: mostFrequentCondition,
        precipitation: dayData.precipitation,
        icon: mostFrequentIcon
      };
    }).slice(0, 5); // Limit to 5 days
  };
  
  /**
   * Fetches both current weather and forecast
   */
  export const fetchWeather = async (cityName: string): Promise<WeatherResponseData> => {
    const currentWeather = await fetchCurrentWeather(cityName);
    const forecast = await fetchForecast(cityName);
    
    return [currentWeather, ...forecast];
  };
  
  /**
   * Loads search history from local storage
   */
  export const fetchSearchHistory = async (): Promise<string[]> => {
    const history = localStorage.getItem('weatherSearchHistory');
    return history ? JSON.parse(history) : [];
  };
  
  /**
   * Saves a city to search history in local storage
   */
  export const saveToSearchHistory = async (cityName: string): Promise<void> => {
    const history = await fetchSearchHistory();
    
    // Add city to history if not already present
    if (!history.includes(cityName)) {
      const updatedHistory = [cityName, ...history].slice(0, 10); // Keep last 10 searches
      localStorage.setItem('weatherSearchHistory', JSON.stringify(updatedHistory));
    }
  };
  
  /**
   * Clears search history from local storage
   */
  export const clearSearchHistory = async (): Promise<void> => {
    localStorage.removeItem('weatherSearchHistory');
  };
  
  /**
   * Loads favorite locations from local storage
   */
  export const fetchFavorites = async (): Promise<string[]> => {
    const favorites = localStorage.getItem('weatherFavorites');
    return favorites ? JSON.parse(favorites) : [];
  };
  
  /**
   * Adds a location to favorites in local storage
   */
  export const addToFavorites = async (location: string): Promise<void> => {
    const favorites = await fetchFavorites();
    
    if (!favorites.includes(location)) {
      const updatedFavorites = [...favorites, location];
      localStorage.setItem('weatherFavorites', JSON.stringify(updatedFavorites));
    }
  };
  
  /**
   * Removes a location from favorites in local storage
   */
  export const removeFromFavorites = async (location: string): Promise<void> => {
    const favorites = await fetchFavorites();
    const updatedFavorites = favorites.filter(fav => fav !== location);
    localStorage.setItem('weatherFavorites', JSON.stringify(updatedFavorites));
  };
  
  /**
   * Legacy functions for compatibility
   */
  export const renderCurrentWeather = (currentWeather: CurrentWeatherData): void => {
    console.log('Rendering current weather for:', currentWeather.location);
  };
  
  export const renderForecast = (forecast: ForecastData[]): void => {
    console.log('Rendering forecast for next', forecast.length, 'days');
  };
  
  export default {
    fetchWeather,
    fetchCurrentWeather,
    fetchForecast,
    fetchSearchHistory,
    saveToSearchHistory,
    clearSearchHistory,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
  };