require('dotenv').config();

const config = {
  userRoles: process.env.USER_GROUP,
  secret: { session: process.env.SESSION_KEY },
  pssUrl: process.env.PSS_URI,
  pssAuth: process.env.PSS_AUTH,
};

module.exports = config;
