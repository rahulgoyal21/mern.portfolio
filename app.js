const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world from server');
});

app.listen(3000, () => {
  console.log('server is running at port no 3000');
});
