const express = require('express');
const axios = require('axios');
const basicAuth = require('express-basic-auth');
const fs = require('fs');

const apiKey = 'API_KEY';
const app = express();

app.use(
    basicAuth({
      authorizer: (username, password) => {
        const users = JSON.parse(fs.readFileSync('users.json'));
        return users[username] === password;
      },
      unauthorizedResponse: { error: 'Unauthorized' }
    })
  );
  
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

// Endpoint for get current weather conditions
app.get('/weather/current', async (req, res) => {
    try {
      const { lokacija } = req.query;
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${lokacija}&appid=${apiKey}`);
      const currWeather = response.data;
      res.json(currWeather);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed' });
    }
  });

  // Endpoint fr get weather forecast
app.get('/weather/forecast', async (req, res) => {
    try {
      const { lokacija } = req.query;
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${lokacija}&appid=${apiKey}`);
      const weatherForecast = response.data;
      res.json(weatherForecast);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed' });
    }
  });

// Endpoint to get historical weather data
app.get('/weather/history', async (req, res) => {
    try {
      const { location, date } = req.query;
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${location.lat}&lon=${location.lon}&dt=${date}&appid=${API_KEY}`);
      const historicalWeather = response.data;
      res.json(historicalWeather);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch' });
    }
  });
  