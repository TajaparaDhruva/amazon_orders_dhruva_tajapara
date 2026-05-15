const express = require('express');

const app = express();

const routes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the routes
app.use('/api/v1', routes);

module.exports = app;
