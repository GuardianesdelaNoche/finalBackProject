'use strict'

const mongoose = require('mongoose');

mongoose.connection.on('error', err => {
    console.log('Error connection', err);
    process.exit(1);
});

mongoose.connection.once('open', () => {
    console.log('Connected MongoDB in', mongoose.connection.name);
})

mongoose.connect(process.env.URL_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

module.exports = mongoose.connection;