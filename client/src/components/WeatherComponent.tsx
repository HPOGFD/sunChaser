import React from 'react';
import { CurrentWeatherData, ForecastData } from '../api/API';
import '../../src/styles/WeatherComponent.css';

type WeatherComponentProps = {
  data: CurrentWeatherData | ForecastData;
  isCurrent?: boolean;
};

const WeatherComponent: React.FC<WeatherComponentProps> = ({ data }) => {
  const isCurrentWeather = 'feelsLike' in data; // Type guard to check if it's CurrentWeatherData

  const getIconUrl = (icon: string) => `http://openweathermap.org/img/wn/${icon}@2x.png`;
  
  // Convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius: number): number => {
    return Math.round((celsius * 9/5) + 32);
  };

  return (
    <div className="weather-container">
      <h3>{isCurrentWeather ? data.location : (data as ForecastData).date}</h3>
      <img src={getIconUrl(data.icon)} alt={data.condition} />
      <p className="temperature">
        {isCurrentWeather
          ? `${celsiusToFahrenheit(data.temperature)}°F`
          : `${celsiusToFahrenheit((data as ForecastData).temperature.min)}°F / ${celsiusToFahrenheit((data as ForecastData).temperature.max)}°F`}
      </p>
      <p className="condition">{data.condition}</p>
      {isCurrentWeather && (
        <div className="additional-info">
          <p>Feels Like: {celsiusToFahrenheit(data.feelsLike)}°F</p>
          <p>Humidity: {data.humidity}%</p>
          <p>Wind: {data.windSpeed} km/h</p>
          {data.precipitation && <p>Precipitation: {data.precipitation} mm</p>}
        </div>
      )}
      {!isCurrentWeather && (data as ForecastData).precipitation && (
        <p className="precipitation">Precipitation: {(data as ForecastData).precipitation} mm</p>
      )}
    </div>
  );
};

export default WeatherComponent;