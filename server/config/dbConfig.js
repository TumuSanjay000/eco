const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)
const connection = mongoose.connection;
connection.on('connected', () => {
    console.log('MongoDB Connected');
});
connection.on('error', (err) => {
    console.log('MongoDB not Connected', err);
});
module.exports = connection;