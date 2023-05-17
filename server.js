const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const basicAuth = require('express-basic-auth');
const fs = require('fs');

const apiKey = '00eacdab103f4acf85fbf8065c5d444a';
const cache = new NodeCache({ stdTTL: 300 }); // cache for 5 minutes
const app = express();

// for basic authentication
app.use(
  basicAuth({
    authorizer: (username, password) => {
      const users = JSON.parse(fs.readFileSync('users.json'));
      return users[username] === password;
    },
    unauthorizedResponse: { error: 'Unauthorized' }
  })
);

// get current weather

app.get('/weather/current', async (req, res) => {
  const { location } = req.query;
  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }

  const cacheKey = `current:${location}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json({ ...cachedData, cached: true });
  }

  try {
    const response = await axios.get(`https://api.weatherbit.io/v2.0/current?&key=${apiKey}&city=${location}`);
    const weatherData = response.data;
    cache.set(cacheKey, weatherData);
    return res.json({ ...weatherData, cached: false, lastRefreshed: new Date(), provider: 'Weatherbit.io' });
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return res.status(500).json({ error: 'Failed to fetch current weather' });
  }
});

// get weather forecast

app.get('/weather/forecast', async (req, res) => {
  const { location } = req.query;
  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }

  try {
    const response = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?&key=${apiKey}&city=${location}`);
    const forecastData = response.data;
    return res.json(forecastData);
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return res.status(500).json({ error: 'Failed to fetch weather forecast' });
  }
});

//get weather history 

app.get('/weather/history', async (req, res) => {
  const { location, start_date, end_date } = req.query;
  if (!location || !start_date || !end_date) {
    return res.status(400).json({ error: 'Location, start_date, and end_date are required' });
  }

  try {
    const response = await axios.get(`https://api.weatherbit.io/v2.0/history/daily?&key=${apiKey}&city=${location}&start_date=${start_date}&end_date=${end_date}`);
    const historyData = response.data;
    return res.json(historyData);
  } catch (error) {
    console.error('Error fetching historical weather data:', error);
    return res.status(500).json({ error: 'Failed to fetch historical weather data' });
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
