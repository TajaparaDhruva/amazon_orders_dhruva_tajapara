require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/product.model');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Product Seeding...');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

const importProducts = async () => {
    try {
        await connectDB();

        const dataPath = path.join(__dirname, '../../dataset/Amazon_Orders.json');
        
        console.log('Reading JSON file to extract unique products...');
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const orders = JSON.parse(fileContent);

        // Use a Map to keep track of unique products based on ProductID
        const productMap = new Map();

        orders.forEach(order => {
            if (!productMap.has(order.ProductID)) {
                productMap.set(order.ProductID, {
                    name: order.ProductName,
                    description: `This is a high-quality ${order.ProductName} from ${order.Brand}.`,
                    price: parseFloat(order.UnitPrice) || 0,
                    category: order.Category,
                    brand: order.Brand,
                    stock: 500, // Default stock since it's not in the order
                    sellerId: order.SellerID,
                    images: [
                        {
                            public_id: `img_${order.ProductID}`,
                            url: `https://via.placeholder.com/500?text=${encodeURIComponent(order.ProductName)}`
                        }
                    ],
                    isActive: true
                });
            }
        });

        const uniqueProducts = Array.from(productMap.values());
        console.log(`Found ${uniqueProducts.length} unique products. Proceeding to insert...`);
        
        // Clear existing products
        await Product.deleteMany();
        console.log('Cleared existing Product collection.');

        // Insert products
        await Product.insertMany(uniqueProducts);

        console.log('🎉 Unique Products Imported successfully!');
        process.exit();
    } catch (error) {
        console.error('Error importing products:', error);
        process.exit(1);
    }
};

importProducts();
