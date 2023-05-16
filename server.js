const express = require('express');
const axios = require('axios');
const basicAuth = require('express-basic-auth');
const fs = require('fs');

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
  