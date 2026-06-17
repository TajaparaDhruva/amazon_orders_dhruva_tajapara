const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 4000
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`Could not connect to primary MONGODB_URI: ${error.message}`);
        console.log('Attempting connection to local MongoDB fallback (mongodb://127.0.0.1:27017/amazon_orders)...');
        try {
            const conn = await mongoose.connect('mongodb://127.0.0.1:27017/amazon_orders', {
                serverSelectionTimeoutMS: 4000
            });
            console.log(`MongoDB Connected (Local Fallback): ${conn.connection.host}`);
        } catch (localError) {
            console.error(`Error: Both primary and local MongoDB connections failed: ${localError.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;

