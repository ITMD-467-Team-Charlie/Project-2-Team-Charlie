const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  endpoint: process.env.END_POINT_URL,
  key: process.env.END_POINT_KEY,
  id: process.env.END_POINT_ID,
};
