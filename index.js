const express = require('express');
const fetch = require('node-fetch');
const app = express();

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc3MjIwNzU1NywianRpIjoiYjU0MzIzM2MtNmZiMC00NDkwLTliNDEtZWI2ZjQxODI5ZDliIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImI5Mzc3Njc1LTM1NGYtNGY1Ny1iYjY0LWVmZDljYTVjYjkyZiIsIm5iZiI6MTc3MjIwNzU1NywiY3NyZiI6ImZkODU5OTc4LTIyOGQtNDQwNC1hNTRhLThmNjEzOWMxNzEyNSIsInRva2VuX3R5cGUiOiJhcGkifQ.3puThf156ODJFimEljLFY74NQqpx1DgN9jVyQHn7xbM";

app.use((req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  fetch('https://www.pokedata.io/v0' + req.url, {
    headers: { Authorization: 'Bearer ' + TOKEN }
  })
  .then(r => r.json())
  .then(data => res.json(data))
  .catch(e => res.status(500).json({ error: e.message }));
});

app.listen(process.env.PORT || 3000);
