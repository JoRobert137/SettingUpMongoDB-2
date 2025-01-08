const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const user = require('./schema.js')

if (process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config({
    path: './.env',
  });
}

const app = express();
const port = process.env.PORT;

app.use(express.json());

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error('Error connecting to database:', err));

app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;

    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res
        .status(400)
        .json({ message: 'Validation error', details: error.message });
    } else {
      res.status(500).json({ message: 'Server error', details: error.message });
    }
  }
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
