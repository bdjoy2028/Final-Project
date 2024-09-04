const mongoose = require('mongoose');

// Above, we import mongoose to form our connection 

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tech-friends_db');

// Above, is our connection to mongoose

module.exports = mongoose.connection;

// Above, we export our mongoose connection.