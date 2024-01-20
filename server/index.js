
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 7000;

const apiKey = '262714a6-f0dc-4592-94d9-01ce5b8e6d11'; 


app.use(cors());


app.get('/cryptocurrencies', async (req, res) => {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      params: {
        start: 1,
        limit: 100,
        convert: 'USD',
      },
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    });

    const topCryptos = response.data.data.map(crypto => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
    }));

    res.json(topCryptos);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/convert', async (req, res) => {
  const { sourceCrypto, amount, targetCurrency } = req.query;

  if (!sourceCrypto || !amount || !targetCurrency) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const conversionRateResponse = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
      params: {
        id: sourceCrypto,
        convert: targetCurrency,
      },
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    });

    const conversionRate = conversionRateResponse.data.data[sourceCrypto].quote[targetCurrency].price;
    const convertedAmount = amount * conversionRate;

    res.json({ convertedAmount });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

console.log("connected");
