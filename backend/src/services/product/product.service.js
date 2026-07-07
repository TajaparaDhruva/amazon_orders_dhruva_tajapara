const Order = require('../../models/order.model');
const fs = require('fs');
const path = require('path');

/**
 * Maps categories to beautiful Unsplash images.
 */
const CUSTOM_PRODUCT_IMAGES = {
    'yoga mat': 'https://images.unsplash.com/photo-1718862403436-616232ec6005?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'premium cork yoga block': 'https://m.media-amazon.com/images/I/71mRxZogT5L._AC_UF894,1000_QL80_.jpg'
};

const getCategoryImage = (category, subcategory, name = '') => {
    const cleanCategory = (category || '').trim().toLowerCase();
    const cleanSub = (subcategory || '').trim().toLowerCase();
    const cleanName = name.trim().toLowerCase();

    // Dynamically check frontend JSON file overrides to support updates by name
    try {
        const filePath = path.join(__dirname, '../../../../frontend/src/data/extracted_products.json');
        if (fs.existsSync(filePath)) {
            const rawData = fs.readFileSync(filePath, 'utf8');
            const items = JSON.parse(rawData);
            if (Array.isArray(items)) {
                const found = items.find(item => item.name && item.name.trim().toLowerCase() === cleanName);
                if (found && found.image) {
                    return found.image;
                }
            }
        }
    } catch (err) {
        // Fallback silently
    }

    // Check custom overrides first
    if (CUSTOM_PRODUCT_IMAGES[cleanName]) {
        return CUSTOM_PRODUCT_IMAGES[cleanName];
    }
    if (cleanName.includes('yoga mat')) {
        return 'https://images.unsplash.com/photo-1718862403436-616232ec6005?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    }

    if (cleanCategory.includes('elect') || cleanCategory.includes('tech')) {
        if (cleanSub.includes('mobile') || cleanName.includes('phone') || cleanName.includes('iphone')) {
            return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80';
        }
        if (cleanSub.includes('laptop') || cleanName.includes('laptop') || cleanName.includes('macbook') || cleanName.includes('pavilion')) {
            return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80';
        }
        if (cleanSub.includes('watch') || cleanName.includes('watch') || cleanName.includes('wearable')) {
            return 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400&q=80';
        }
        if (cleanSub.includes('headphone') || cleanName.includes('headphone') || cleanName.includes('ear') || cleanName.includes('boat')) {
            return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80';
        }
        if (cleanSub.includes('camera') || cleanName.includes('camera') || cleanName.includes('eos')) {
            return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80';
        }
        if (cleanSub.includes('speaker') || cleanName.includes('speaker') || cleanName.includes('jbl')) {
            return 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80';
        }
        return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80';
    }

    if (cleanCategory.includes('cloth') || cleanCategory.includes('fash') || cleanCategory.includes('wear')) {
        if (cleanSub.includes('foot') || cleanName.includes('shoe') || cleanName.includes('sneaker') || cleanName.includes('puma') || cleanName.includes('nike')) {
            return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';
        }
        return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80';
    }

    if (cleanCategory.includes('home') || cleanCategory.includes('kitchen') || cleanCategory.includes('living')) {
        if (cleanSub.includes('furn') || cleanName.includes('chair') || cleanName.includes('sofa') || cleanName.includes('table')) {
            return 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80';
        }
        if (cleanSub.includes('light') || cleanName.includes('light') || cleanName.includes('bulb') || cleanName.includes('lamp')) {
            return 'https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=400&q=80';
        }
        return 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&q=80';
    }

    if (cleanCategory.includes('beauty') || cleanCategory.includes('personal') || cleanCategory.includes('care')) {
        return 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&q=80';
    }

    if (cleanCategory.includes('sport') || cleanCategory.includes('outdoor') || cleanCategory.includes('fit')) {
        return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80';
    }

    if (cleanCategory.includes('auto') || cleanCategory.includes('car')) {
        return 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&q=80';
    }

    if (cleanCategory.includes('book')) {
        return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80';
    }

    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80';
};

/**
 * Helper to derive subcategory dynamically based on name and category.
 */
const getSubcategory = (category, name) => {
    const cleanCategory = (category || '').toLowerCase();
    const cleanName = (name || '').toLowerCase();

    if (cleanCategory.includes('elect')) {
        if (cleanName.includes('phone') || cleanName.includes('iphone') || cleanName.includes('mobile')) return 'Mobiles';
        if (cleanName.includes('laptop') || cleanName.includes('notebook') || cleanName.includes('pavilion')) return 'Laptops';
        if (cleanName.includes('watch') || cleanName.includes('band')) return 'Smart Watches';
        if (cleanName.includes('headphone') || cleanName.includes('airdots') || cleanName.includes('speaker') || cleanName.includes('audio')) return 'Headphones';
        if (cleanName.includes('camera') || cleanName.includes('eos')) return 'Cameras';
        return 'Accessories';
    }
    if (cleanCategory.includes('fash') || cleanCategory.includes('cloth')) {
        if (cleanName.includes('shoe') || cleanName.includes('sneaker') || cleanName.includes('boot') || cleanName.includes('footwear')) return 'Footwear';
        if (cleanName.includes('t-shirt') || cleanName.includes('shirt') || cleanName.includes('hoodie') || cleanName.includes('jeans')) return "Men's Wear";
        return 'Accessories';
    }
    if (cleanCategory.includes('home') || cleanCategory.includes('kitchen') || cleanCategory.includes('living')) {
        if (cleanName.includes('chair') || cleanName.includes('sofa') || cleanName.includes('table') || cleanName.includes('furniture')) return 'Furniture';
        if (cleanName.includes('light') || cleanName.includes('bulb') || cleanName.includes('lamp') || cleanName.includes('led')) return 'Lighting';
        return 'Kitchen';
    }
    if (cleanCategory.includes('beauty')) {
        if (cleanName.includes('skin') || cleanName.includes('lotion')) return 'Skincare';
        if (cleanName.includes('hair') || cleanName.includes('shampoo')) return 'Haircare';
        return 'Makeup';
    }
    if (cleanCategory.includes('sport')) {
        if (cleanName.includes('shoe') || cleanName.includes('run')) return 'Footwear';
        if (cleanName.includes('fit') || cleanName.includes('gym')) return 'Fitness';
        return 'Gear';
    }
    if (cleanCategory.includes('auto')) {
        if (cleanName.includes('car') || cleanName.includes('clean') || cleanName.includes('wax')) return 'Car Care';
        return 'Car Accessories';
    }
    return 'Standard';
};

/**
 * Deterministically maps product names to correct categories and subcategories.
 */
const correctProductMapping = (productName) => {
    const name = (productName || '').trim().toLowerCase();

    // Electronics
    if (
        name.includes('4k monitor') ||
        name.includes('camera') ||
        name.includes('speaker') ||
        name.includes('hdd') ||
        name.includes('ssd') ||
        name.includes('mouse') ||
        name.includes('tablet') ||
        name.includes('cable') ||
        name.includes('keyboard') ||
        name.includes('memory') ||
        name.includes('microphone') ||
        name.includes('headphone') ||
        name.includes('earbud') ||
        name.includes('tripod') ||
        name.includes('power bank') ||
        name.includes('projector') ||
        name.includes('router') ||
        name.includes('galaxy s23') ||
        name.includes('phone') ||
        name.includes('charger') ||
        name.includes('webcam') ||
        name.includes('wireless') ||
        name.includes('iphone') ||
        name.includes('macbook') ||
        name.includes('watch') ||
        name.includes('band') ||
        name.includes('drone')
    ) {
        let sub = 'Accessories';
        if (name.includes('phone') || name.includes('iphone') || name.includes('galaxy') || name.includes('smartphone')) sub = 'Mobiles';
        else if (name.includes('laptop') || name.includes('macbook')) sub = 'Laptops';
        else if (name.includes('watch') || name.includes('band') || name.includes('smartwatch')) sub = 'Smart Watches';
        else if (name.includes('headphone') || name.includes('earbud') || name.includes('speaker')) sub = 'Audio';
        else if (name.includes('camera')) sub = 'Cameras';

        return { category: 'Electronics', subcategory: sub };
    }

    // Fashion / Clothing
    if (
        name.includes('backpack') ||
        name.includes('shirt') ||
        name.includes('jeans') ||
        name.includes('sunglasses') ||
        name.includes('t-shirt') ||
        name.includes('jacket') ||
        name.includes('shoes') ||
        name.includes('sneaker') ||
        name.includes('jordan')
    ) {
        let sub = 'Clothing';
        if (name.includes('shoes') || name.includes('sneaker') || name.includes('jordan')) sub = 'Footwear';
        else if (name.includes('backpack') || name.includes('sunglasses')) sub = 'Accessories';
        else sub = "Men's Wear";
        return { category: 'Fashion', subcategory: sub };
    }

    // Home & Living
    if (
        name.includes('air fryer') ||
        name.includes('cookware') ||
        name.includes('desk organizer') ||
        name.includes('plant') ||
        name.includes('kettle') ||
        name.includes('instant pot') ||
        name.includes('lamp') ||
        name.includes('bulb') ||
        name.includes('light') ||
        name.includes('chair') ||
        name.includes('cleaner') ||
        name.includes('vacuum')
    ) {
        let sub = 'Kitchen';
        if (name.includes('chair') || name.includes('furniture')) sub = 'Furniture';
        else if (name.includes('lamp') || name.includes('bulb') || name.includes('light')) sub = 'Lighting';
        return { category: 'Home & Living', subcategory: sub };
    }

    // Books
    if (
        name.includes('book') ||
        name.includes('novel') ||
        name.includes('algorithms')
    ) {
        return { category: 'Books', subcategory: 'Literature' };
    }

    // Sports & Outdoors
    if (
        name.includes('water bottle') ||
        name.includes('yoga')
    ) {
        let sub = 'Gear';
        if (name.includes('yoga')) sub = 'Fitness';
        return { category: 'Sports & Outdoors', subcategory: sub };
    }

    // Toys & Games
    if (
        name.includes('game') ||
        name.includes('toy') ||
        name.includes('puzzle') ||
        name.includes('blaster')
    ) {
        return { category: 'Toys & Games', subcategory: 'Games' };
    }

    // Default fallback
    return { category: 'Electronics', subcategory: 'Accessories' };
};

/**
 * Realistic Indian market price lookup by product name keywords.
 * Returns { price, originalPrice, discount } or null if not matched.
 */
const REALISTIC_PRICE_MAP = [
    // Electronics — large appliances / displays
    { keywords: ['4k monitor', 'monitor'],          price: 24999, orig: 32999, disc: '-24%' },
    { keywords: ['projector'],                       price: 7999,  orig: 10999, disc: '-27%' },
    { keywords: ['drone'],                           price: 9999,  orig: 13999, disc: '-29%' },
    { keywords: ['action camera'],                   price: 8999,  orig: 12499, disc: '-28%' },
    { keywords: ['camera'],                          price: 6999,  orig: 9999,  disc: '-30%' },
    // Electronics — computers & peripherals
    { keywords: ['laptop', 'macbook', 'pavilion'],  price: 54999, orig: 69999, disc: '-21%' },
    { keywords: ['graphic tablet'],                  price: 4999,  orig: 6499,  disc: '-23%' },
    { keywords: ['mechanical keyboard', 'keyboard'], price: 3499,  orig: 4999,  disc: '-30%' },
    { keywords: ['gaming mouse', 'mouse'],           price: 1299,  orig: 1799,  disc: '-28%' },
    { keywords: ['webcam'],                          price: 1999,  orig: 2799,  disc: '-29%' },
    { keywords: ['portable ssd', 'external hdd', 'hard disk', 'hdd', 'ssd'], price: 4999, orig: 6999, disc: '-29%' },
    { keywords: ['memory card'],                     price: 799,   orig: 999,   disc: '-20%' },
    // Electronics — audio
    { keywords: ['noise cancelling headphone', 'headphone', 'over-ear'], price: 5999, orig: 7999, disc: '-25%' },
    { keywords: ['wireless earbud', 'earbud', 'earphone', 'airpods'],    price: 1999, orig: 2999, disc: '-33%' },
    { keywords: ['bluetooth speaker', 'speaker'],                         price: 2499, orig: 3499, disc: '-29%' },
    { keywords: ['microphone'],                      price: 2299,  orig: 3299,  disc: '-30%' },
    // Electronics — wearables
    { keywords: ['smartwatch', 'smart watch'],       price: 3499,  orig: 4999,  disc: '-30%' },
    { keywords: ['fitness band', 'fitness tracker'], price: 1499,  orig: 1999,  disc: '-25%' },
    // Electronics — mobile & accessories
    { keywords: ['iphone 15', 'iphone'],             price: 64999, orig: 79999, disc: '-19%' },
    { keywords: ['galaxy s23', 'galaxy', 'smartphone', 'mobile phone'], price: 44999, orig: 54999, disc: '-18%' },
    { keywords: ['smartphone case', 'phone case'],   price: 299,   orig: 499,   disc: '-40%' },
    { keywords: ['power bank'],                      price: 1299,  orig: 1799,  disc: '-28%' },
    { keywords: ['wireless charger'],                price: 799,   orig: 1199,  disc: '-33%' },
    { keywords: ['usb-c charger', 'charger', 'car charger'], price: 499, orig: 799, disc: '-38%' },
    { keywords: ['phone tripod', 'tripod'],          price: 699,   orig: 999,   disc: '-30%' },
    { keywords: ['hdmi cable', 'cable'],             price: 299,   orig: 499,   disc: '-40%' },
    { keywords: ['router', 'wi-fi'],                 price: 1999,  orig: 2799,  disc: '-29%' },
    { keywords: ['smart light bulb', 'smart bulb'],  price: 499,   orig: 699,   disc: '-29%' },
    // Home & Living
    { keywords: ['gamer ergonomic chair', 'gaming chair', 'office chair', 'ergonomic chair', 'chair'], price: 7999,  orig: 11999, disc: '-33%' },
    { keywords: ['air fryer'],                       price: 3999,  orig: 5499,  disc: '-27%' },
    { keywords: ['instant pot', 'pressure cooker'], price: 5999,  orig: 7999,  disc: '-25%' },
    { keywords: ['cookware set', 'cookware'],        price: 2999,  orig: 4499,  disc: '-33%' },
    { keywords: ['vacuum cleaner', 'vacuum'],        price: 4999,  orig: 6999,  disc: '-29%' },
    { keywords: ['electric kettle', 'kettle'],       price: 799,   orig: 1199,  disc: '-33%' },
    { keywords: ['led desk lamp', 'desk lamp', 'lamp'], price: 699, orig: 999,  disc: '-30%' },
    { keywords: ['desk organizer', 'organizer'],     price: 599,   orig: 899,   disc: '-33%' },
    { keywords: ['desk plant', 'plant'],             price: 249,   orig: 349,   disc: '-29%' },
    { keywords: ['water bottle'],                    price: 299,   orig: 499,   disc: '-40%' },
    // Sports
    { keywords: ['yoga mat', 'yoga'],                price: 499,   orig: 799,   disc: '-38%' },
    { keywords: ['running shoes'],                   price: 2999,  orig: 4499,  disc: '-33%' },
    // Fashion
    { keywords: ['air jordan', 'jordan'],            price: 12999, orig: 14999, disc: '-13%' },
    { keywords: ['laptop sleeve'],                   price: 699,   orig: 999,   disc: '-30%' },
    { keywords: ['backpack'],                        price: 1299,  orig: 1999,  disc: '-35%' },
    { keywords: ['winter jacket', 'jacket'],         price: 2499,  orig: 3999,  disc: '-38%' },
    { keywords: ['sunglasses'],                      price: 799,   orig: 1199,  disc: '-33%' },
    { keywords: ['jeans'],                           price: 999,   orig: 1799,  disc: '-44%' },
    { keywords: ['dress shirt'],                     price: 799,   orig: 1199,  disc: '-33%' },
    { keywords: ['t-shirt', 'tshirt'],               price: 399,   orig: 599,   disc: '-33%' },
    // Toys & Games
    { keywords: ['water blaster', 'nerf', 'blaster'], price: 1499, orig: 1999,  disc: '-25%' },
    { keywords: ['kids toy car', 'toy car'],          price: 499,   orig: 699,   disc: '-29%' },
    { keywords: ['board game'],                       price: 699,   orig: 999,   disc: '-30%' },
    { keywords: ['puzzle'],                           price: 499,   orig: 799,   disc: '-38%' },
    // Books
    { keywords: ['introduction to algorithms', 'algorithms'], price: 1999, orig: 2499, disc: '-20%' },
    { keywords: ["children's book", 'children book'],         price: 199,  orig: 299,  disc: '-33%' },
    { keywords: ['novel bestseller', 'novel', 'book'],         price: 299,  orig: 499,  disc: '-40%' },
];

const getRealisticPrice = (productName) => {
    const nameLower = (productName || '').toLowerCase();
    for (const entry of REALISTIC_PRICE_MAP) {
        if (entry.keywords.some(kw => nameLower.includes(kw))) {
            return { price: entry.price, originalPrice: entry.orig, discount: entry.disc };
        }
    }
    return null;
};

/**
 * Enriches a raw database grouped product with ratings, images, and discounts.
 */
const enrichProduct = (p) => {
    const charSum = p.ProductID.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const rating = Number((4.1 + (charSum % 8) / 10).toFixed(1)); // rating between 4.1 and 4.8

    // Correct categories and subcategories deterministically based on name
    const corrected = correctProductMapping(p.ProductName);
    const category = corrected.category;
    const subcategory = corrected.subcategory;
    const image = getCategoryImage(category, subcategory, p.ProductName);

    // Use realistic market prices instead of raw order UnitPrice
    const realistic = getRealisticPrice(p.ProductName);
    const price = realistic ? realistic.price : Math.round(p.UnitPrice * 10) * 10; // fallback: round to nearest 10
    const originalPrice = realistic ? realistic.originalPrice : Math.round(price * 1.2);
    const discount = realistic ? realistic.discount : '-17%';

    return {
        id: p.ProductID,
        name: p.ProductName,
        brand: p.Brand,
        category,
        subcategory,
        price,
        originalPrice,
        discount,
        rating,
        reviews: p.OrderCount * 7 + (charSum % 13),
        image
    };
};

/**
 * Fetches unique products from MongoDB.
 */
const getUniqueProductsService = async (queryParams = {}) => {
    const { category, search, brand, minPrice, maxPrice } = queryParams;

    const matchStage = { isArchived: { $ne: true } };

    const products = await Order.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$ProductID',
                ProductID: { $first: '$ProductID' },
                ProductName: { $first: '$ProductName' },
                Category: { $first: '$Category' },
                Brand: { $first: '$Brand' },
                UnitPrice: { $first: '$UnitPrice' },
                OrderCount: { $sum: 1 }
            }
        },
        { $sort: { OrderCount: -1 } } // Sort by popularity by default
    ]);

    let enriched = products.map(enrichProduct);

    // Apply filtering in JavaScript to ensure exact match with corrected category/prices
    if (category) {
        enriched = enriched.filter(p => p.category === category);
    }
    if (brand) {
        const cleanBrand = brand.toLowerCase();
        enriched = enriched.filter(p => p.brand.toLowerCase().includes(cleanBrand));
    }
    if (search) {
        const cleanSearch = search.toLowerCase();
        enriched = enriched.filter(p =>
            p.name.toLowerCase().includes(cleanSearch) ||
            p.id.toLowerCase().includes(cleanSearch) ||
            p.brand.toLowerCase().includes(cleanSearch)
        );
    }
    if (minPrice) {
        enriched = enriched.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
        enriched = enriched.filter(p => p.price <= Number(maxPrice));
    }

    return enriched;
};

/**
 * Fetches details for a single product by ProductID.
 */
const getProductByIdService = async (productId) => {
    // Find the first order containing this ProductID to get its static details
    const orderItem = await Order.findOne({ ProductID: productId, isArchived: { $ne: true } }).lean();
    if (!orderItem) return null;

    // Get order count for popularity metric
    const orderCount = await Order.countDocuments({ ProductID: productId, isArchived: { $ne: true } });

    return enrichProduct({
        ProductID: orderItem.ProductID,
        ProductName: orderItem.ProductName,
        Category: orderItem.Category,
        Brand: orderItem.Brand,
        UnitPrice: orderItem.UnitPrice,
        OrderCount: orderCount
    });
};

module.exports = {
    getUniqueProductsService,
    getProductByIdService,
    enrichProduct
};
