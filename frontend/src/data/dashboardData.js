// --- static datasets for customer portal ---

export const CATEGORIES = [
    { name: 'Electronics', count: 256, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80' },
    { name: 'Fashion', count: 192, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80' },
    { name: 'Home & Living', count: 128, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&q=80' },
    { name: 'Beauty', count: 96, image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300&q=80' },
    { name: 'Sports', count: 76, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&q=80' },
    { name: 'Automotive', count: 54, image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=300&q=80' }
];

export const SUBCATEGORIES = {
    'Electronics': [
        { name: 'Mobiles', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80' },
        { name: 'Laptops', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&q=80' },
        { name: 'TV & Audio', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&q=80' },
        { name: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
        { name: 'Smart Watches', image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=300&q=80' },
        { name: 'Cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80' },
        { name: 'Speakers', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80' },
        { name: 'Accessories', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&q=80' }
    ],
    'Fashion': [
        { name: 'Men\'s Wear', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80' },
        { name: 'Women\'s Wear', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80' },
        { name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80' },
        { name: 'Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80' },
        { name: 'Accessories', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&q=80' }
    ],
    'Home & Living': [
        { name: 'Furniture', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&q=80' },
        { name: 'Decor', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80' },
        { name: 'Kitchen', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&q=80' },
        { name: 'Bedding', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&q=80' },
        { name: 'Lighting', image: 'https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=300&q=80' }
    ],
    'Beauty': [
        { name: 'Skincare', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300&q=80' },
        { name: 'Haircare', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80' },
        { name: 'Makeup', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&q=80' }
    ],
    'Sports': [
        { name: 'Fitness', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&q=80' },
        { name: 'Footwear', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&q=80' },
        { name: 'Gear', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&q=80' }
    ],
    'Automotive': [
        { name: 'Car Accessories', image: 'https://images.unsplash.com/photo-1584438784894-089d6a128f3e?w=300&q=80' },
        { name: 'Car Care', image: 'https://images.unsplash.com/photo-1617886903355-9354bf587370?w=300&q=80' }
    ]
};

export const ALL_PRODUCTS = [
    {
        id: 'p-1',
        name: 'Apple iPhone 14 (128GB) - Midnight',
        brand: 'Apple',
        category: 'Electronics',
        subcategory: 'Mobiles',
        price: 64999,
        originalPrice: 79900,
        discount: '-20%',
        rating: 4.6,
        reviews: 1289,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80'
    },
    {
        id: 'p-2',
        name: 'HP Pavilion 15, 12th Gen Intel Core i5',
        brand: 'HP',
        category: 'Electronics',
        subcategory: 'Laptops',
        price: 52990,
        originalPrice: 61900,
        discount: '-15%',
        rating: 4.4,
        reviews: 956,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80'
    },
    {
        id: 'p-3',
        name: 'Fire-Boltt Ninja 3 Smartwatch',
        brand: 'Fire-Boltt',
        category: 'Electronics',
        subcategory: 'Smart Watches',
        price: 1799,
        originalPrice: 2399,
        discount: '-25%',
        rating: 4.3,
        reviews: 1876,
        image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400&q=80'
    },
    {
        id: 'p-4',
        name: 'boAt Airdopes 141 Bluetooth',
        brand: 'boAt',
        category: 'Electronics',
        subcategory: 'Headphones',
        price: 1299,
        originalPrice: 1499,
        discount: '-10%',
        rating: 4.4,
        reviews: 2376,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80'
    },
    {
        id: 'p-5',
        name: 'Sony Bravia XR-55A80K (55 Inch)',
        brand: 'Sony',
        category: 'Electronics',
        subcategory: 'TV & Audio',
        price: 119990,
        originalPrice: 136900,
        discount: '-12%',
        rating: 4.7,
        reviews: 645,
        image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=80'
    },
    {
        id: 'p-6',
        name: 'Sony WH-1000XM5 Wireless',
        brand: 'Sony',
        category: 'Electronics',
        subcategory: 'Headphones',
        price: 29990,
        originalPrice: 36990,
        discount: '-18%',
        rating: 4.6,
        reviews: 1874,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80'
    },
    {
        id: 'p-7',
        name: 'Samsung Galaxy S23 5G (128GB)',
        brand: 'Samsung',
        category: 'Electronics',
        subcategory: 'Mobiles',
        price: 74999,
        originalPrice: 94999,
        discount: '-21%',
        rating: 4.5,
        reviews: 2456,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80'
    },
    {
        id: 'p-8',
        name: 'Canon EOS 200D II DSLR Camera',
        brand: 'Canon',
        category: 'Electronics',
        subcategory: 'Cameras',
        price: 38990,
        originalPrice: 46990,
        discount: '-17%',
        rating: 4.4,
        reviews: 765,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80'
    },
    {
        id: 'p-9',
        name: 'JBL Flip 6 Bluetooth Speaker',
        brand: 'JBL',
        category: 'Electronics',
        subcategory: 'Speakers',
        price: 8999,
        originalPrice: 9999,
        discount: '-10%',
        rating: 4.6,
        reviews: 1567,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80'
    },
    {
        id: 'p-10',
        name: 'Logitech G502 Hero Gaming Mouse',
        brand: 'Logitech',
        category: 'Electronics',
        subcategory: 'Accessories',
        price: 3399,
        originalPrice: 3999,
        discount: '-15%',
        rating: 4.5,
        reviews: 956,
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80'
    },
    {
        id: 'p-11',
        name: 'Apple iPad (9th Gen) 64GB',
        brand: 'Apple',
        category: 'Electronics',
        subcategory: 'Laptops',
        price: 24999,
        originalPrice: 31900,
        discount: '-20%',
        rating: 4.6,
        reviews: 876,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80'
    },
    {
        id: 'p-12',
        name: 'Mi Power Bank 3i 20000mAh',
        brand: 'Xiaomi',
        category: 'Electronics',
        subcategory: 'Accessories',
        price: 1499,
        originalPrice: 1799,
        discount: '-16%',
        rating: 4.4,
        reviews: 2345,
        image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=400&q=80'
    },
    {
        id: 'p-13',
        name: 'Puma Unisex Sneakers',
        brand: 'Puma',
        category: 'Fashion',
        subcategory: 'Footwear',
        price: 1499,
        originalPrice: 1999,
        discount: '-25%',
        rating: 4.5,
        reviews: 78,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'
    },
    {
        id: 'p-14',
        name: "Levi's Men's T-Shirt",
        brand: "Levi's",
        category: 'Fashion',
        subcategory: "Men's Wear",
        price: 999,
        originalPrice: 1499,
        discount: '-33%',
        rating: 4.2,
        reviews: 104,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80'
    },
    {
        id: 'p-15',
        name: 'Nike Air Max 270',
        brand: 'Nike',
        category: 'Fashion',
        subcategory: 'Footwear',
        price: 5499,
        originalPrice: 7999,
        discount: '-31%',
        rating: 4.6,
        reviews: 120,
        image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80'
    },
    {
        id: 'p-16',
        name: 'Adidas Essentials Hoodie',
        brand: 'Adidas',
        category: 'Fashion',
        subcategory: "Men's Wear",
        price: 2499,
        originalPrice: 3499,
        discount: '-28%',
        rating: 4.4,
        reviews: 88,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80'
    },
    {
        id: 'p-17',
        name: 'White Armchair Luxury',
        brand: 'CozyHome',
        category: 'Home & Living',
        subcategory: 'Furniture',
        price: 12999,
        originalPrice: 15999,
        discount: '-18%',
        rating: 4.7,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80'
    },
    {
        id: 'p-18',
        name: 'Philips LED Smart Bulb',
        brand: 'Philips',
        category: 'Home & Living',
        subcategory: 'Lighting',
        price: 799,
        originalPrice: 999,
        discount: '-20%',
        rating: 4.3,
        reviews: 310,
        image: 'https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=400&q=80'
    },
    {
        id: 'p-19',
        name: 'Cocooil Natural Body Lotion',
        brand: 'Cocooil',
        category: 'Beauty',
        subcategory: 'Skincare',
        price: 499,
        originalPrice: 699,
        discount: '-28%',
        rating: 4.4,
        reviews: 96,
        image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300&q=80'
    },
    {
        id: 'p-20',
        name: 'Sports Running Shoes Pro',
        brand: 'Nike',
        category: 'Sports',
        subcategory: 'Footwear',
        price: 3499,
        originalPrice: 4499,
        discount: '-22%',
        rating: 4.6,
        reviews: 120,
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&q=80'
    }
];

export const RECOMMENDED_PRODUCTS = [
    {
        id: 'rec-1',
        name: 'Fire-Boltt Ninja 3 Smartwatch',
        category: 'Electronics',
        price: 1799,
        originalPrice: 2299,
        discount: '-20%',
        rating: 5,
        reviews: 120,
        image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400&q=80'
    },
    {
        id: 'rec-2',
        name: 'boAt Rockerz 450',
        category: 'Electronics',
        price: 1499,
        originalPrice: 1799,
        discount: '-18%',
        rating: 5,
        reviews: 96,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'
    },
    {
        id: 'rec-3',
        name: 'Puma Unisex Sneakers',
        category: 'Fashion',
        price: 1499,
        originalPrice: 1999,
        discount: '-25%',
        rating: 5,
        reviews: 78,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'
    },
    {
        id: 'rec-4',
        name: 'Safari Laptop Backpack',
        category: 'Bags & Luggage',
        price: 2199,
        originalPrice: 2499,
        discount: '-10%',
        rating: 5,
        reviews: 64,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80'
    },
    {
        id: 'rec-5',
        name: 'Samsung Galaxy S23',
        category: 'Electronics',
        price: 74999,
        originalPrice: 84999,
        discount: '-12%',
        rating: 5,
        reviews: 207,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80'
    }
];

export const YOU_MAY_ALSO_LIKE = [
    {
        id: 'like-1',
        name: 'Zebronics Keyboard',
        category: 'Electronics',
        price: 499,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80'
    },
    {
        id: 'like-2',
        name: 'Philips LED Bulb',
        category: 'Home & Living',
        price: 249,
        image: 'https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=300&q=80'
    },
    {
        id: 'like-3',
        name: 'Nike Air Max 270',
        category: 'Fashion',
        price: 5499,
        image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&q=80'
    },
    {
        id: 'like-4',
        name: 'Levi\'s Men\'s T-Shirt',
        category: 'Fashion',
        price: 999,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80'
    },
    {
        id: 'like-5',
        name: 'Sony WH-1000XM5',
        category: 'Electronics',
        price: 29990,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&q=80'
    },
    {
        id: 'like-6',
        name: 'boAt Airdopes 141',
        category: 'Electronics',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80'
    }
];

export const BRANDS = ['boAt', 'Puma', 'Samsung', 'Nike', 'Adidas', 'Sony'];

export const SLIDES = [
    {
        badge: 'MEGA SALE',
        title: 'Big Savings on Smart Shopping',
        subtitle: 'Up to 60% off on electronics, fashion, home & more. Get additional first order discounts instantly.',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80',
        btnText: 'Shop Now'
    },
    {
        badge: 'FASHION SALE',
        title: 'Elevate Your Style & Fashion',
        subtitle: 'Min. 50% Off on latest styles, footwear, clothing and trend accessories.',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
        btnText: 'Shop Now'
    },
    {
        badge: 'HOME ESSENTIALS',
        title: 'Modern Living & Comfort Decor',
        subtitle: 'Up to 45% off on aesthetic furniture, organizers, and home sanctuary decor.',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
        btnText: 'Explore Now'
    }
];
