const rateLimit = require('express-rate-limit');
const limitermiddleware = rateLimit({
    windowMs: 60 * 1000, // Time window in milliseconds (e.g., 1 minute)
    max: 3, // Maximum number of requests allowed within the time window
    message: {
      message: 'Too many requests ( more than 4 ), please try again in a few minutes.',
      status: 429,
      meaning: 'Too Many Requests',
    },
  });
  

module.exports = limitermiddleware;