const express = require('express');
const cors = require('cors');

const app = express();

const routes = require('./routes');

// CORS — allow Vite frontend on port 5173
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the routes
app.use('/api/v1', routes);

module.exports = app;
