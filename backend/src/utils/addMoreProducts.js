require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../models/order.model');

// Connect to Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 4000
        });
        console.log('MongoDB Connected for Seeding More Products...');
    } catch (err) {
        console.warn(`Could not connect to primary MONGODB_URI: ${err.message}`);
        console.log('Attempting connection to local MongoDB fallback...');
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/amazon_orders', {
                serverSelectionTimeoutMS: 4000
            });
            console.log('MongoDB Connected to Local Fallback...');
        } catch (localError) {
            console.error('Database connection error: Both primary and local MongoDB failed:', localError);
            process.exit(1);
        }
    }
};

const newProductsList = [
    { ProductID: 'P_MACBOOK_M3', ProductName: 'MacBook Pro M3', Category: 'Electronics', Brand: 'Apple', UnitPrice: 169900 },
    { ProductID: 'P_PS5_CONSOLE', ProductName: 'PlayStation 5 Console', Category: 'Electronics', Brand: 'Sony', UnitPrice: 54990 },
    { ProductID: 'P_JORDAN_1', ProductName: 'Air Jordan 1 Retro', Category: 'Clothing', Brand: 'Nike', UnitPrice: 12999 },
    { ProductID: 'P_ALGORITHMS_BOOK', ProductName: 'Introduction to Algorithms', Category: 'Books', Brand: 'MIT Press', UnitPrice: 1999 },
    { ProductID: 'P_YOGA_BLOCK', ProductName: 'Premium Cork Yoga Block', Category: 'Sports & Outdoors', Brand: 'Lululemon', UnitPrice: 2499 },
    { ProductID: 'P_NERF_BLASTER', ProductName: 'DualShot Water Blaster', Category: 'Toys & Games', Brand: 'Nerf', UnitPrice: 1499 },
    { ProductID: 'P_DESK_ORG', ProductName: 'Aesthetic Desk Organizer', Category: 'Home & Kitchen', Brand: 'CozyHome', UnitPrice: 999 },
    { ProductID: 'P_RAZER_CHAIR', ProductName: 'Gamer Ergonomic Chair', Category: 'Home & Kitchen', Brand: 'Razer', UnitPrice: 24999 }
];

const mockCustomers = [
    { id: 'CUST001504', name: 'Vihaan Sharma' },
    { id: 'CUST002345', name: 'Aarav Patel' },
    { id: 'CUST003891', name: 'Ananya Iyer' },
    { id: 'CUST004120', name: 'Dhruva Tajapara' }
];

const paymentMethods = ['Credit Card', 'Debit Card', 'UPI', 'Amazon Pay', 'Net Banking'];
const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const IndianCities = [
    { city: 'Mumbai', state: 'MH' },
    { city: 'Delhi', state: 'DL' },
    { city: 'Bangalore', state: 'KA' },
    { city: 'Ahmedabad', state: 'GJ' },
    { city: 'Chennai', state: 'TN' }
];

const addMoreProducts = async () => {
    try {
        await connectDB();

        console.log('Generating premium orders/products...');
        const orders = [];

        // Generate 15 orders for each new product to populate them well in the database
        for (const prod of newProductsList) {
            for (let i = 0; i < 12; i++) {
                const customer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
                const cityObj = IndianCities[Math.floor(Math.random() * IndianCities.length)];
                const qty = Math.floor(Math.random() * 2) + 1; // 1 or 2
                const total = qty * prod.UnitPrice;
                const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
                const payment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

                // Date in the last 30 days
                const date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 30));

                const order = {
                    OrderID: 'ORD_SEEDED_' + Math.floor(1000000 + Math.random() * 9000000),
                    CustomerID: customer.id,
                    CustomerName: customer.name,
                    ProductID: prod.ProductID,
                    ProductName: prod.ProductName,
                    Category: prod.Category,
                    Brand: prod.Brand,
                    Quantity: qty,
                    UnitPrice: prod.UnitPrice,
                    Discount: 0,
                    Tax: 0,
                    ShippingCost: total > 500 ? 0 : 49,
                    TotalAmount: total,
                    PaymentMethod: payment,
                    OrderDate: date,
                    OrderStatus: status,
                    City: cityObj.city,
                    State: cityObj.state,
                    Country: 'India',
                    SellerID: 'SELL_SEEDED_' + Math.floor(10000 + Math.random() * 90000),
                    isArchived: false
                };

                orders.push(order);
            }
        }

        console.log(`Inserting ${orders.length} new orders into the database...`);
        const result = await Order.insertMany(orders);
        console.log(`🎉 Successfully inserted ${result.length} premium orders with new products!`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding premium products:', error);
        process.exit(1);
    }
};

addMoreProducts();
