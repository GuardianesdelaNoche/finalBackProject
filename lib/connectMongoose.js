'use strict';

const mongoose = require('mongoose');
const { URL_CONNECTION, NODE_ENV} = process.env;

const connectionString = NODE_ENV === 'test' ? "mongodb://localhost:27017/test_app" : URL_CONNECTION

mongoose.connection.on('error', err => {
    console.log('Error connection', err);
    process.exit(1);
});

mongoose.connection.once('open', () => {
    console.log('Connected MongoDB in', mongoose.connection.name);
});

mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

module.exports = mongoose.connection;