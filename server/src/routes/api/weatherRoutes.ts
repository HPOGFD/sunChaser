import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';

import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { city } = req.body;
   if (!city){
    res.status(400).json({message: 'City name is required'});
   }
   try {
    // Get weather data using WeatherService
    const weatherData = await WeatherService.getWeatherForCity(city);

    // Save city to search history using HistoryService
    await HistoryService.addCity(city);

    res.status(200).json({ weather: weatherData, message: 'City saved to history' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve weather data', error: error.message });
  }
});


// TODO: GET search history
router.get('/history', async (req, res) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {});

export default router;
