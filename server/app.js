const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
dotenv.config({ path: './config.env' });
require('./db/conn');
const PORT = process.env.PORT;

app.use(express.json());

//we link the router file to make our route easy
app.use(require('./router/auth'));

//Middleware
const middleware = (req, res, next) => {
  console.log('Hello my middleware');
  next();
};
// middleware();
app.get('/', (req, res) => {
  res.send('Hello world from server');
});

app.get('/about', middleware, (req, res) => {
  res.send('Hello about world from server');
});

app.listen(PORT, () => {
  console.log(`server is running at port no ${PORT}`);
});
