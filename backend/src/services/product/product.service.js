const Order = require('../../models/order.model');

/**
 * Maps categories to beautiful Unsplash images.
 */
const getCategoryImage = (category, subcategory, name = '') => {
    const cleanCategory = (category || '').trim().toLowerCase();
    const cleanSub = (subcategory || '').trim().toLowerCase();
    const cleanName = name.trim().toLowerCase();

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
 * Enriches a raw database grouped product with ratings, images, and discounts.
 */
const enrichProduct = (p) => {
    const charSum = p.ProductID.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const rating = Number((4.1 + (charSum % 8) / 10).toFixed(1)); // rating between 4.1 and 4.8
    const discountVal = (charSum % 4) * 5 + 10; // 10%, 15%, 20%, 25%
    const originalPrice = Math.round(p.UnitPrice * (1 + discountVal / 100));

    // Normalize category for frontend consistency
    let category = p.Category;
    if (category === 'Clothing') category = 'Fashion';
    else if (category === 'Home & Kitchen') category = 'Home & Living';

    const subcategory = getSubcategory(category, p.ProductName);
    const image = getCategoryImage(category, subcategory, p.ProductName);

    return {
        id: p.ProductID,
        name: p.ProductName,
        brand: p.Brand,
        category,
        subcategory,
        price: p.UnitPrice,
        originalPrice,
        discount: `-${discountVal}%`,
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

    if (category) {
        let categoriesToMatch = [category];
        if (category === 'Fashion') categoriesToMatch.push('Clothing');
        if (category === 'Home & Living') categoriesToMatch.push('Home & Kitchen');
        matchStage.Category = { $in: categoriesToMatch };
    }

    if (brand) {
        matchStage.Brand = { $regex: brand, $options: 'i' };
    }

    if (search) {
        const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        matchStage.$or = [
            { ProductName: { $regex: escapedSearch, $options: 'i' } },
            { ProductID: { $regex: escapedSearch, $options: 'i' } },
            { Brand: { $regex: escapedSearch, $options: 'i' } }
        ];
    }

    if (minPrice || maxPrice) {
        matchStage.UnitPrice = {};
        if (minPrice) matchStage.UnitPrice.$gte = Number(minPrice);
        if (maxPrice) matchStage.UnitPrice.$lte = Number(maxPrice);
    }

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

    return products.map(enrichProduct);
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
