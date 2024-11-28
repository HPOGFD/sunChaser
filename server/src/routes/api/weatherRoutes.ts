import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';

import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { cityName } = req.body;
   if (!cityName){
    res.status(400).json({message: 'City name is required'});
   }
   try {
    // Get weather data using WeatherService
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // Save city to search history using HistoryService
    const historyEntry = await HistoryService.addCityToHistory(cityName);

    res.status(200).json([weatherData, historyEntry]);
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    res.status(500).json({ message: 'Error retrieving weather data' });
  }
});


// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const history = await HistoryService.getSearchHistory();
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ message: 'Error fetching search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await HistoryService.deleteCityFromHistory(id);
    if (result) {
      res.status(200).json({ message: 'City removed from history' });
    } else {
      res.status(404).json({ message: 'City not found in history' });
    }
  } catch (error) {
    console.error('Error deleting city from history:', error);
    res.status(500).json({ message: 'Error deleting city from history' });
  }
});

export default router;
