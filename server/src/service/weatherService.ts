import fs from 'node:fs/promises';
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  temperature: number;
  windSpeed: number;
  humidity: number;

}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  private cityName?: string;

  constructor() {
    this.baseURL = process.env.WEATHER_API_BASE_URL || '';
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.cityName = process.env.CITY_NAME || '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(city: string) {
    try {
      const response = await fetch(
        `${this.baseURL}forecast?q=${city}&appid=${this.apiKey}&units=metric&lang=en`);
      const locationData = await response.json();
      return locationData;
    } catch (error) {
      console.error(`Error fetching location data: ${error}`);
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData.city.coord;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
