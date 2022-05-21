const currency = require('currency.js');

const float2 = (value) => currency(value, {
  symbol: '', separator: '.', decimal: ',', precision: '2',
});

module.exports = { float2 };
