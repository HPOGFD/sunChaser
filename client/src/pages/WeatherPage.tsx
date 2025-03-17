import React, { useState, useEffect } from 'react';
import { CurrentWeatherData, fetchWeather, ForecastData, WeatherResponseData } from '../api/API';
import WeatherComponent from '../../src/components/WeatherComponent';
import '../styles/search.css';

const WeatherPage: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
    } catch (err) {
      setError('Could not fetch weather data. Please check the city name and try again.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const defaultCity = 'London';
    fetchWeather(defaultCity)
      .then(setWeatherData)
      .catch(() => setError('Failed to load default weather data.'));
  }, []);

  return (
    <div className="weather-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="search-input"
        />
        <button type="submit" disabled={loading} className="search-button">
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {weatherData && weatherData.length > 0 && (
        <div className="weather-info">
          <div>
            <h2 className="section-title">Current Weather</h2>
            <WeatherComponent data={weatherData[0] as CurrentWeatherData} isCurrent />
          </div>
          <div>
            <h2 className="section-title">5-Day Forecast</h2>
            <div className="forecast-container">
              {weatherData.slice(1).filter((data): data is ForecastData => 'temperature' in data && typeof data.temperature !== 'number').map((forecast: ForecastData, index: number) => (
                <WeatherComponent key={index} data={forecast} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;