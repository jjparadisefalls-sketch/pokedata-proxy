const express = require('express');
const fetch = require('node-fetch');
const app = express();
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc3MjIwNzU1NywianRpIjoiYjU0MzIzM2MtNmZiMC00NDkwLTliNDEtZWI2ZjQxODI5ZDliIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImI5Mzc3Njc1LTM1NGYtNGY1Ny1iYjY0LWVmZDljYTVjYjkyZiIsIm5iZiI6MTc3MjIwNzU1NywiY3NyZiI6ImZkODU5OTc4LTIyOGQtNDQwNC1hNTRhLThmNjEzOWMxNzEyNSIsInRva2VuX3R5cGUiOiJhcGkifQ.3puThf156ODJFimEljLFY74NQqpx1DgN9jVyQHn7xbM";

const SOURCE_MAP = {
    0: 'Pokedata Raw', 11: 'TCGPlayer', 11.1: 'CardMkt', 12: 'eBay Raw',
    9: 'PSA 9.0', 10: 'PSA 10.0', 6: 'PSA 8.0', 7: 'PSA 7.0', 8: 'PSA 8.5',
    20: 'CGC 8.0', 21: 'CGC 9.0', 21.5: 'CGC 9.5', 22: 'CGC 10.0',
    29: 'BGS 9.0', 31: 'BGS 9.5',
};

app.use('*', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    const path = req.originalUrl;
    console.log('Request:', path);
    try {
          if (path.startsWith('/pricing')) {
                  const id = new URLSearchParams(path.split('?')[1] || '').get('id');
                  const url = 'https://www.pokedata.io/api/cards/stats?id=' + id;
                  console.log('Pricing via new endpoint:', url);
                  const r = await fetch(url, { headers: { Authorization: 'Bearer ' + TOKEN } });
                  const stats = await r.json();
                  const pricing = {};
                  if (Array.isArray(stats)) {
                            stats.forEach(entry => {
                                        const key = SOURCE_MAP[entry.source];
                                        if (key && entry.avg != null) {
                                                      pricing[key] = { currency: key === 'CardMkt' ? 'eur' : 'usd', value: entry.avg };
                                        }
                            });
                  }
                  return res.json({ id: Number(id), pricing });
          }
          const url = 'https://www.pokedata.io/v0' + path;
          console.log('Proxying:', url);
          const r = await fetch(url, { headers: { Authorization: 'Bearer ' + TOKEN } });
          const data = await r.json();
          res.json(data);
    } catch(e) {
          res.status(500).json({ error: e.message });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy running'));
