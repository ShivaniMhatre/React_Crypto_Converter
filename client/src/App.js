

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [cryptos, setCryptos] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [sourceCrypto, setSourceCrypto] = useState('');
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {

    axios.get('http://localhost:7000/cryptocurrencies')
      .then(response => setCryptos(response.data))
      .catch(error => console.error('Error fetching cryptocurrencies:', error));


    const countryCurrencies = [
      'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'AUD', 'CAD', 'SGD', 'NZD', 'CHF',
      'SEK', 'NOK', 'DKK', 'HKD', 'KRW', 'TRY', 'ZAR', 'BRL', 'RUB', 'MXN', 'IDR',

    ];

    setCurrencies(countryCurrencies);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();


    axios.get('http://localhost:7000/convert', {
      params: {
        sourceCrypto,
        amount,
        targetCurrency,
      },
    })
      .then(response => setConvertedAmount(response.data.convertedAmount))
      .catch(error => console.error('Error converting currency:', error));
  };

  return (
    <div className='body'>
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <h2>DIGITAL CURRENCY CONVERTOR</h2>
          <label>
            Cryptocurrency:
            <select value={sourceCrypto} onChange={(e) => setSourceCrypto(e.target.value)}>
              <option value="">Select</option>
              {cryptos.map(crypto => (
                <option key={crypto.id} value={crypto.id}>{crypto.name} ({crypto.symbol})</option>
              ))}
            </select>
          </label>
          {/* <br /> */}

          <label>
            Amount:
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          {/* <br /> */}

          <label>
            Target Currency:
            <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)}>
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </label>
          <br />

          <button type="submit">Convert</button>
        </form>

        {convertedAmount !== null && (
          <div className="converted-amount">
            <h2>Converted Amount:</h2>
            <p>{convertedAmount} {targetCurrency}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
