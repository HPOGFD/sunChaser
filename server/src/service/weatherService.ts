import dotenv from 'dotenv';

dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state: string;
}

// Define a class for the Weather object
class Weather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  city: string;
  date: string;


  constructor(temperature: number, description: string, humidity: number, windSpeed: number, icon: string, city: string, date: string) {
    this.temperature = temperature;
    this.description = description;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.icon = icon;
    this.city = city;
    this.date = date;
  }
}

// Define the WeatherService class
class WeatherService {
  private baseURL = process.env.API_BASE_URL || ''; // Base URL for the OpenWeather API
  private apiKey = process.env.API_KEY || ''; // API key from .env file

  
  // Fetch location data (latitude and longitude) for a given city name
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const geocodeURL = this.buildGeocodeQuery(query);
    const response = await fetch(geocodeURL);
    const data = await response.json();
    return this.destructureLocationData(data);
  }

  // Destructure the location data (city coordinates)
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0]; // Assuming the response contains an array with city coordinates
    const { name, country, state } = locationData[0];
    return { lat, lon, name, country, state };
  }
// Build the geocode query string to get the city's coordinates
private buildGeocodeQuery(query: string): string {
  return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
}

// Build the weather query string to get the 5-day forecast for the given coordinates
private buildWeatherQuery(coordinates: Coordinates): string {
  const { lat, lon } = coordinates;
  return `${this.baseURL}forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
}


  // Fetch and destructure location data
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return locationData;
  }

  // Fetch weather data for the given coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    const data = await response.json();
    return data;
  }

  // Parse the current weather data into a Weather object
  private parseCurrentWeather(response: any): Weather {
    console.log(response);  
    const { main, weather, wind } = response.list[0];
    const temperature = main.temp;
    const description = weather[0].description;
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    const icon = weather[0].icon;
    const city = response.city.name;
    const date = response.list[0].dt_txt;
    return new Weather(temperature, description, humidity, windSpeed, icon, city, date);
  }

  

  // Get weather for a city by name
  async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return currentWeather;
  }
}

export default new WeatherService();
