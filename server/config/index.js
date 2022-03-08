require('dotenv').config();

const config = {
  userRoles: ['', '15', '14', '13', '12', '11'],
  secret: { session: process.env.SESSION_KEY },
  pssUrl: process.env.PSS_URI,
  pssAuth: process.env.PSS_AUTH,
};

module.exports = config;
