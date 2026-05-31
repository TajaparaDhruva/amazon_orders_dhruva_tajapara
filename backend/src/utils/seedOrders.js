require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Order = require('../models/order.model');

// Connect to Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding...');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        const dataPath = path.join(__dirname, '../../dataset/Amazon_Orders.json');
        
        console.log('Reading JSON file (this might take a moment)...');
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const orders = JSON.parse(fileContent);

        console.log(`Successfully parsed ${orders.length} orders. Proceeding to insert...`);
        
        // Clear existing orders just in case we are running this multiple times
        await Order.deleteMany();
        console.log('Cleared existing Order collection.');

        // Insert in batches of 10,000 to avoid memory/timeout issues
        const batchSize = 10000;
        for (let i = 0; i < orders.length; i += batchSize) {
            const batch = orders.slice(i, i + batchSize);
            await Order.insertMany(batch);
            console.log(`Inserted batch ${i / batchSize + 1} (${Math.min(i + batchSize, orders.length)} / ${orders.length} orders)`);
        }

        console.log('🎉 Data Imported successfully!');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

importData();
