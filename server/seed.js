import mongoose from "mongoose";
import dotenv from "dotenv";
import CategoryModel from "./models/category.model.js";
import SubCategoryModel from "./models/subCategory.model.js";
import ProductModel from "./models/product.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI is not defined in your server/.env file.");
    process.exit(1);
}

const categoriesData = [
    { name: "Dairy, Bread & Eggs", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500" },
    { name: "Snacks & Munchies", image: "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=500" },
    { name: "Fruits & Vegetables", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500" },
    { name: "Cold Drinks & Juices", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500" },
    { name: "Instant & Frozen Food", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500" },
    { name: "Tea, Coffee & Health Drinks", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500" },
    { name: "Bakery & Biscuits", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500" },
    { name: "Atta, Rice & Dal", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500" }
];

const subCategoriesData = [
    // Dairy, Bread & Eggs
    { name: "Milk, Butter & Cheese", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500", categoryName: "Dairy, Bread & Eggs" },
    { name: "Eggs & Bread", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500", categoryName: "Dairy, Bread & Eggs" },
    
    // Snacks & Munchies
    { name: "Chips & Crisps", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500", categoryName: "Snacks & Munchies" },
    { name: "Namkeen & Popcorn", image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500", categoryName: "Snacks & Munchies" },

    // Fruits & Vegetables
    { name: "Fresh Vegetables", image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500", categoryName: "Fruits & Vegetables" },
    { name: "Fresh Fruits", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500", categoryName: "Fruits & Vegetables" },

    // Cold Drinks & Juices
    { name: "Soft Drinks & Soda", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500", categoryName: "Cold Drinks & Juices" },
    { name: "Fruit Juices", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500", categoryName: "Cold Drinks & Juices" },

    // Instant & Frozen Food
    { name: "Instant Noodles & Pasta", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500", categoryName: "Instant & Frozen Food" },
    { name: "Frozen Snacks", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500", categoryName: "Instant & Frozen Food" },

    // Tea, Coffee & Health Drinks
    { name: "Tea & Green Tea", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500", categoryName: "Tea, Coffee & Health Drinks" },
    { name: "Coffee", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500", categoryName: "Tea, Coffee & Health Drinks" },

    // Bakery & Biscuits
    { name: "Cookies & Biscuits", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500", categoryName: "Bakery & Biscuits" },
    { name: "Cakes & Muffins", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500", categoryName: "Bakery & Biscuits" },

    // Atta, Rice & Dal
    { name: "Atta & Flour", image: "https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=500", categoryName: "Atta, Rice & Dal" },
    { name: "Basmati Rice & Dals", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500", categoryName: "Atta, Rice & Dal" }
];

const productsData = [
    // ==========================================
    // Category 1: Dairy, Bread & Eggs (10 items)
    // ==========================================
    {
        name: "Amul Gold Full Cream Milk",
        image: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500"],
        categoryName: "Dairy, Bread & Eggs",
        subCategoryName: "Milk, Butter & Cheese",
        unit: "500 ml",
        stock: 120,
        price: 33,
        discount: 0,
        description: "Fresh full cream milk from Amul, rich and creamy, perfect for daily use."
    },
    {
        name: "Amul Pasteurised Butter",
        image: ["https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500"],
        categoryName: "Dairy, Bread & Eggs",
        subCategoryName: "Milk, Butter & Cheese",
        unit: "100 g",
        stock: 85,
        price: 58,
        discount: 2,
        description: "Delicious salted pasteurized butter from Amul. Perfect spread for breakfast."
    },
    {
        name: "Amul Processed Cheese Slices",
        image: ["https://images.unsplash.com/photo-1528750908543-82427ecae164?w=500"],
        categoryName: "Dairy, Bread & Eggs",
        subCategoryName: "Milk, Butter & Cheese",
        unit: "200 g",
        stock: 60,
        price: 135,
        discount: 5,
        description: "Rich, creamy processed cheese slices. Ideal for burgers, sandwiches, and quick snacks."
    },
    {
        name: "Mother Dairy Paneer",
        image: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500"],
        categoryName: "Dairy, Bread & Eggs",
        subCategoryName: "Milk, Butter & Cheese",
        unit: "200 g",
        stock: 90,
        price: 90,
        discount: 4,
        description: "Fresh and soft block of paneer (cottage cheese). Premium quality product."
    },
    {
        name: "Britannia Cheese Block",
        image: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500"],
        categoryName: "Dairy, Bread & Eggs",
        subCategoryName: "Milk, Butter & Cheese",
        unit: "200 g",
        stock: 55,
        price: 145,
        discount: 8,
        description: "Premium processed cheddar cheese block. Grate on pizzas or slice for toast."
    },
    {
        name: "Mother Dairy Classic Curd",
        image: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500"],
        categoryName: "Dairy, Bread & Eggs",
        subCategoryName: "Milk, Butter & Cheese",
        unit: "400 g",
        stock: 150,
        price: 35,
        discount: 0,
        description: "Creamy, delicious local curd from Mother Dairy. Perfect probiotic addition to meals."
    },
    {
        name: "Amul Taaza Toned Milk",
        image: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500"],
        categoryName: "Dairy, Bread & Eggs",
        subCategoryName: "Milk, Butter & Cheese",
        unit: "1 L",
        stock: 200,
        price: 56,
        discount: 0,
        description: "Pasteurized toned milk with minimum 3.0% fat. Fresh milk for tea and cereal."
    },
    {
        name: "Amul Masti Spiced Buttermilk",
        image: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500"],
        categoryName: "Dairy, Bread & Eggs",
        subCategoryName: "Milk, Butter & Cheese",
        unit: "250 ml",
        stock: 140,
        price: 15,
        discount: 0,
        description: "Tangy, cooling spiced buttermilk, rich in spices and probiotics. Great summer refresher."
    },
    {
        name: "English Oven Brown Bread",
        image: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"],
        categoryName: "Dairy, Bread & Eggs",
        subCategoryName: "Eggs & Bread",
        unit: "400 g",
        stock: 50,
        price: 45,
        discount: 0,
        description: "Healthy and soft whole wheat brown bread, freshly baked and rich in dietary fiber."
    },
    {
        name: "Farm Fresh Table Eggs (Pack of 12)",
        image: ["https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=500"],
        categoryName: "Dairy, Bread & Eggs",
        subCategoryName: "Eggs & Bread",
        unit: "12 pcs",
        stock: 90,
        price: 90,
        discount: 8,
        description: "Farm-fresh table eggs packed with essential nutrients, high-quality protein, and vitamins."
    },

    // ==========================================
    // Category 2: Snacks & Munchies (10 items)
    // ==========================================
    {
        name: "Lays Classic Salted Potato Chips",
        image: ["https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500"],
        categoryName: "Snacks & Munchies",
        subCategoryName: "Chips & Crisps",
        unit: "90 g",
        stock: 250,
        price: 30,
        discount: 0,
        description: "Classic salted crispy potato chips made from selected farm-grown potatoes."
    },
    {
        name: "Kurkure Masala Munch",
        image: ["https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=500"],
        categoryName: "Snacks & Munchies",
        subCategoryName: "Chips & Crisps",
        unit: "85 g",
        stock: 180,
        price: 20,
        discount: 0,
        description: "Crunchy, spicy and tangy corn-based snacks, perfect for teatime."
    },
    {
        name: "Lays Cream & Onion Chips",
        image: ["https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500"],
        categoryName: "Snacks & Munchies",
        subCategoryName: "Chips & Crisps",
        unit: "90 g",
        stock: 220,
        price: 30,
        discount: 3,
        description: "Delicious potato chips flavored with sour cream and mild green onions."
    },
    {
        name: "Pringles Sour Cream & Onion",
        image: ["https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500"],
        categoryName: "Snacks & Munchies",
        subCategoryName: "Chips & Crisps",
        unit: "110 g",
        stock: 150,
        price: 110,
        discount: 10,
        description: "Delectable stacked potato chips with sour cream flavor in a premium resealable tube."
    },
    {
        name: "Doritos Cheese Nachos",
        image: ["https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500"],
        categoryName: "Snacks & Munchies",
        subCategoryName: "Chips & Crisps",
        unit: "150 g",
        stock: 120,
        price: 90,
        discount: 5,
        description: "Crunchy tortilla chips loaded with a bold, savory nacho cheese flavor."
    },
    {
        name: "Bingo Mad Angles Chili Achari",
        image: ["https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=500"],
        categoryName: "Snacks & Munchies",
        subCategoryName: "Chips & Crisps",
        unit: "80 g",
        stock: 160,
        price: 20,
        discount: 0,
        description: "Triangular crunchy corn snacks seasoned with a spicy pickle (Achari) flavor."
    },
    {
        name: "Haldiram's Aloo Bhujia",
        image: ["https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500"],
        categoryName: "Snacks & Munchies",
        subCategoryName: "Namkeen & Popcorn",
        unit: "400 g",
        stock: 100,
        price: 110,
        discount: 10,
        description: "Crispy and spicy potato noodles (Aloo Bhujia) namkeen. A classic Indian snack."
    },
    {
        name: "Haldiram's Bhujia Sev",
        image: ["https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500"],
        categoryName: "Snacks & Munchies",
        subCategoryName: "Namkeen & Popcorn",
        unit: "400 g",
        stock: 95,
        price: 105,
        discount: 5,
        description: "Classic spicy gram flour noodles. The perfect teatime namkeen."
    },
    {
        name: "Haldiram's Moong Dal",
        image: ["https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500"],
        categoryName: "Snacks & Munchies",
        subCategoryName: "Namkeen & Popcorn",
        unit: "150 g",
        stock: 200,
        price: 45,
        discount: 0,
        description: "Crispy, salted split yellow moong dal snack. High in protein, low in oil."
    },
    {
        name: "Act II Classic Salted Popcorn",
        image: ["https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500"],
        categoryName: "Snacks & Munchies",
        subCategoryName: "Namkeen & Popcorn",
        unit: "70 g",
        stock: 140,
        price: 35,
        discount: 5,
        description: "Instant hot popcorn, easy to make and delicious. The perfect movie night snack."
    },

    // ==========================================
    // Category 3: Fruits & Vegetables (10 items)
    // ==========================================
    {
        name: "Hybrid Tomatoes",
        image: ["https://images.unsplash.com/photo-1595855759920-86582396756a?w=500"],
        categoryName: "Fruits & Vegetables",
        subCategoryName: "Fresh Vegetables",
        unit: "1 kg",
        stock: 150,
        price: 40,
        discount: 15,
        description: "Fresh and glossy red hybrid tomatoes, sourced directly from local farms."
    },
    {
        name: "Fresh Potato (Alu)",
        image: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500"],
        categoryName: "Fruits & Vegetables",
        subCategoryName: "Fresh Vegetables",
        unit: "1 kg",
        stock: 300,
        price: 28,
        discount: 0,
        description: "High-quality, freshly harvested starch-rich potatoes, ideal for daily curry."
    },
    {
        name: "Fresh Onion (Pyaz)",
        image: ["https://images.unsplash.com/photo-1508747703725-719ae2c73ee8?w=500"],
        categoryName: "Fruits & Vegetables",
        subCategoryName: "Fresh Vegetables",
        unit: "1 kg",
        stock: 280,
        price: 35,
        discount: 5,
        description: "Crisp and fresh red onions, an essential base ingredient for all Indian gravies."
    },
    {
        name: "Fresh Coriander Leaves (Dhaniya)",
        image: ["https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500"],
        categoryName: "Fruits & Vegetables",
        subCategoryName: "Fresh Vegetables",
        unit: "100 g",
        stock: 150,
        price: 15,
        discount: 0,
        description: "Fragrant fresh green coriander leaves, freshly plucked, ideal for garnish."
    },
    {
        name: "Fresh Lemon (Nimbu)",
        image: ["https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500"],
        categoryName: "Fruits & Vegetables",
        subCategoryName: "Fresh Vegetables",
        unit: "250 g",
        stock: 180,
        price: 30,
        discount: 0,
        description: "Tangy and juicy fresh lemons. Squeeze on salads, tea, or make fresh lemonade."
    },
    {
        name: "Fresh Ginger (Adrak)",
        image: ["https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500"],
        categoryName: "Fruits & Vegetables",
        subCategoryName: "Fresh Vegetables",
        unit: "250 g",
        stock: 100,
        price: 40,
        discount: 0,
        description: "Fresh aromatic ginger roots. Perfect for cooking masalas or brewing ginger tea."
    },
    {
        name: "Garlic (Lahsun)",
        image: ["https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500"],
        categoryName: "Fruits & Vegetables",
        subCategoryName: "Fresh Vegetables",
        unit: "250 g",
        stock: 110,
        price: 60,
        discount: 10,
        description: "Whole fresh garlic cloves, offering strong aroma and authentic flavor to dishes."
    },
    {
        name: "Green Chilli (Hari Mirch)",
        image: ["https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500"],
        categoryName: "Fruits & Vegetables",
        subCategoryName: "Fresh Vegetables",
        unit: "200 g",
        stock: 130,
        price: 25,
        discount: 0,
        description: "Spicy fresh green chillies, handpicked to add heat to your daily curries."
    },
    {
        name: "Shimla Apple (Royal Delicious)",
        image: ["https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500"],
        categoryName: "Fruits & Vegetables",
        subCategoryName: "Fresh Fruits",
        unit: "4 pcs",
        stock: 80,
        price: 150,
        discount: 10,
        description: "Juicy, sweet and crunchy Shimla apples. Handpicked for the best quality."
    },
    {
        name: "Robusta Banana",
        image: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500"],
        categoryName: "Fruits & Vegetables",
        subCategoryName: "Fresh Fruits",
        unit: "6 pcs",
        stock: 120,
        price: 45,
        discount: 0,
        description: "Sweet, nutrient-rich Robusta bananas. Excellent source of instant energy."
    },

    // ==========================================
    // Category 4: Cold Drinks & Juices (10 items)
    // ==========================================
    {
        name: "Coca-Cola Soft Drink Can",
        image: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500"],
        categoryName: "Cold Drinks & Juices",
        subCategoryName: "Soft Drinks & Soda",
        unit: "300 ml",
        stock: 200,
        price: 40,
        discount: 0,
        description: "Crisp, delicious, and refreshing Coca-Cola sparkling soft drink in a handy can."
    },
    {
        name: "Sprite Lime Soft Drink",
        image: ["https://images.unsplash.com/photo-1626078440494-4d82b173ad5f?w=500"],
        categoryName: "Cold Drinks & Juices",
        subCategoryName: "Soft Drinks & Soda",
        unit: "750 ml",
        stock: 110,
        price: 45,
        discount: 4,
        description: "Lemon-lime flavored carbonated soft drink that refreshes you instantly."
    },
    {
        name: "Thums Up Cold Drink",
        image: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500"],
        categoryName: "Cold Drinks & Juices",
        subCategoryName: "Soft Drinks & Soda",
        unit: "750 ml",
        stock: 140,
        price: 45,
        discount: 5,
        description: "Strong, fizzy cola beverage with a unique spicy bite. Best served chilled."
    },
    {
        name: "Pepsi Soft Drink Bottle",
        image: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500"],
        categoryName: "Cold Drinks & Juices",
        subCategoryName: "Soft Drinks & Soda",
        unit: "750 ml",
        stock: 160,
        price: 45,
        discount: 0,
        description: "Refreshing fizzy sweet cola drink. Great for parties and meals."
    },
    {
        name: "Fanta Orange Soft Drink",
        image: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500"],
        categoryName: "Cold Drinks & Juices",
        subCategoryName: "Soft Drinks & Soda",
        unit: "750 ml",
        stock: 120,
        price: 45,
        discount: 5,
        description: "Bright orange carbonated soda. Fruity, sweet, and fun to drink."
    },
    {
        name: "Limca Lemon Drink",
        image: ["https://images.unsplash.com/photo-1626078440494-4d82b173ad5f?w=500"],
        categoryName: "Cold Drinks & Juices",
        subCategoryName: "Soft Drinks & Soda",
        unit: "750 ml",
        stock: 90,
        price: 45,
        discount: 2,
        description: "Thirst-quenching cloudy lime carbonated drink. Sharp, crisp flavor."
    },
    {
        name: "Red Bull Energy Drink",
        image: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500"],
        categoryName: "Cold Drinks & Juices",
        subCategoryName: "Soft Drinks & Soda",
        unit: "250 ml",
        stock: 180,
        price: 125,
        discount: 10,
        description: "Vitalizes body and mind. High caffeine energy drink, perfect for workout sessions."
    },
    {
        name: "Real Fruit Power Mixed Fruit Juice",
        image: ["https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500"],
        categoryName: "Cold Drinks & Juices",
        subCategoryName: "Fruit Juices",
        unit: "1 L",
        stock: 95,
        price: 120,
        discount: 12,
        description: "Loaded with the goodness of 9 delicious fruits. No added preservatives."
    },
    {
        name: "Real Fruit Power Orange Juice",
        image: ["https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500"],
        categoryName: "Cold Drinks & Juices",
        subCategoryName: "Fruit Juices",
        unit: "1 L",
        stock: 100,
        price: 120,
        discount: 10,
        description: "Rich source of Vitamin C. Refreshing citrus orange juice for breakfast."
    },
    {
        name: "Tropicana 100% Apple Juice",
        image: ["https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500"],
        categoryName: "Cold Drinks & Juices",
        subCategoryName: "Fruit Juices",
        unit: "1 L",
        stock: 80,
        price: 135,
        discount: 15,
        description: "100% pure apple juice. No added sugars, rich and crisp natural apple flavor."
    },

    // ==========================================
    // Category 5: Instant & Frozen Food (10 items)
    // ==========================================
    {
        name: "Maggi 2-Minute Masala Noodles",
        image: ["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"],
        categoryName: "Instant & Frozen Food",
        subCategoryName: "Instant Noodles & Pasta",
        unit: "280 g",
        stock: 240,
        price: 56,
        discount: 2,
        description: "India's favorite instant noodles pack, with the authentic taste of Maggi Masala spices."
    },
    {
        name: "Yippee Magic Masala Noodles",
        image: ["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"],
        categoryName: "Instant & Frozen Food",
        subCategoryName: "Instant Noodles & Pasta",
        unit: "240 g",
        stock: 180,
        price: 48,
        discount: 0,
        description: "Non-sticky, round, delicious noodles containing real vegetables and magic spices."
    },
    {
        name: "Ching's Secret Schezwan Noodles",
        image: ["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"],
        categoryName: "Instant & Frozen Food",
        subCategoryName: "Instant Noodles & Pasta",
        unit: "240 g",
        stock: 120,
        price: 50,
        discount: 5,
        description: "Hot & spicy instant schezwan noodles. Satiate your Chinese cravings in minutes."
    },
    {
        name: "Knorr Soupy Noodles Masala",
        image: ["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"],
        categoryName: "Instant & Frozen Food",
        subCategoryName: "Instant Noodles & Pasta",
        unit: "240 g",
        stock: 130,
        price: 55,
        discount: 4,
        description: "Double fun of delicious noodles and aromatic warm masala soup combined."
    },
    {
        name: "Del Monte Penne Pasta",
        image: ["https://images.unsplash.com/photo-1612966608997-30004f75054f?w=500"],
        categoryName: "Instant & Frozen Food",
        subCategoryName: "Instant Noodles & Pasta",
        unit: "500 g",
        stock: 90,
        price: 120,
        discount: 10,
        description: "Premium quality dry penne pasta made of 100% durum wheat semolina."
    },
    {
        name: "Ching's Secret Hakka Noodles",
        image: ["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"],
        categoryName: "Instant & Frozen Food",
        subCategoryName: "Instant Noodles & Pasta",
        unit: "600 g",
        stock: 110,
        price: 90,
        discount: 5,
        description: "Authentic Hakka noodles. Make restaurant style veg chowmein or chicken noodles at home."
    },
    {
        name: "Maggi Hot & Sweet Ketchup",
        image: ["https://images.unsplash.com/photo-1612966608997-30004f75054f?w=500"],
        categoryName: "Instant & Frozen Food",
        subCategoryName: "Instant Noodles & Pasta",
        unit: "1 kg",
        stock: 140,
        price: 155,
        discount: 12,
        description: "A unique blend of tangy tomatoes and spicy chillies, perfect dip for snacks."
    },
    {
        name: "McCain French Fries",
        image: ["https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"],
        categoryName: "Instant & Frozen Food",
        subCategoryName: "Frozen Snacks",
        unit: "750 g",
        stock: 70,
        price: 160,
        discount: 10,
        description: "Crispy, golden French Fries. Easy to deep fry, air fry, or oven bake."
    },
    {
        name: "McCain Aloo Tikki",
        image: ["https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"],
        categoryName: "Instant & Frozen Food",
        subCategoryName: "Frozen Snacks",
        unit: "400 g",
        stock: 80,
        price: 115,
        discount: 5,
        description: "Crispy spiced potato patties (aloo tikkis). Ideal quick party snack."
    },
    {
        name: "Safal Frozen Green Peas",
        image: ["https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"],
        categoryName: "Instant & Frozen Food",
        subCategoryName: "Frozen Snacks",
        unit: "500 g",
        stock: 120,
        price: 85,
        discount: 0,
        description: "Naturally sweet, fresh frozen green peas. Sourced from the best farms."
    },

    // ==========================================
    // Category 6: Tea, Coffee & Health Drinks (10 items)
    // ==========================================
    {
        name: "Tata Tea Premium",
        image: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500"],
        categoryName: "Tea, Coffee & Health Drinks",
        subCategoryName: "Tea & Green Tea",
        unit: "1 kg",
        stock: 120,
        price: 420,
        discount: 8,
        description: "Expert blend of high-quality tea leaves, offering a strong taste and rich aroma."
    },
    {
        name: "Red Label Tea",
        image: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500"],
        categoryName: "Tea, Coffee & Health Drinks",
        subCategoryName: "Tea & Green Tea",
        unit: "1 kg",
        stock: 110,
        price: 399,
        discount: 5,
        description: "Brooke Bond Red Label black tea leaves, famous for its perfect taste and health benefits."
    },
    {
        name: "Taj Mahal Tea",
        image: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500"],
        categoryName: "Tea, Coffee & Health Drinks",
        subCategoryName: "Tea & Green Tea",
        unit: "500 g",
        stock: 80,
        price: 260,
        discount: 10,
        description: "Premium orange pekoe black tea blend. Rare flavor offering an exquisite cup."
    },
    {
        name: "Wagh Bakri Premium Tea",
        image: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500"],
        categoryName: "Tea, Coffee & Health Drinks",
        subCategoryName: "Tea & Green Tea",
        unit: "1 kg",
        stock: 130,
        price: 440,
        discount: 5,
        description: "Consistent strong color, taste, and aroma. Perfect for family chai time."
    },
    {
        name: "Lipton Green Tea Honey Lemon",
        image: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500"],
        categoryName: "Tea, Coffee & Health Drinks",
        subCategoryName: "Tea & Green Tea",
        unit: "25 bags",
        stock: 150,
        price: 160,
        discount: 12,
        description: "Zero calories green tea bags with flavor of honey and lemon, good for metabolism."
    },
    {
        name: "Nescafe Classic Instant Coffee",
        image: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500"],
        categoryName: "Tea, Coffee & Health Drinks",
        subCategoryName: "Coffee",
        unit: "100 g",
        stock: 90,
        price: 320,
        discount: 5,
        description: "100% pure instant coffee powder, rich in taste and aroma for the perfect morning start."
    },
    {
        name: "Bru Instant Coffee",
        image: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500"],
        categoryName: "Tea, Coffee & Health Drinks",
        subCategoryName: "Coffee",
        unit: "100 g",
        stock: 85,
        price: 210,
        discount: 4,
        description: "Blend of select coffee beans and chicory. Perfect taste and strong aroma."
    },
    {
        name: "Nescafe Sunrise Instant Coffee",
        image: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500"],
        categoryName: "Tea, Coffee & Health Drinks",
        subCategoryName: "Coffee",
        unit: "100 g",
        stock: 75,
        price: 240,
        discount: 8,
        description: "Fine blend of coffee and chicory, slow roasted to release an authentic rich aroma."
    },
    {
        name: "Horlicks Chocolate Health Drink",
        image: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500"],
        categoryName: "Tea, Coffee & Health Drinks",
        subCategoryName: "Coffee",
        unit: "500 g",
        stock: 120,
        price: 290,
        discount: 10,
        description: "Nutritional milk powder beverage clinically proven to make kids taller, stronger, sharper."
    },
    {
        name: "Bournvita Chocolate Health Drink",
        image: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500"],
        categoryName: "Tea, Coffee & Health Drinks",
        subCategoryName: "Coffee",
        unit: "500 g",
        stock: 140,
        price: 285,
        discount: 5,
        description: "Nutritious chocolate health drink loaded with vitamins and essential minerals."
    },

    // ==========================================
    // Category 7: Bakery & Biscuits (10 items)
    // ==========================================
    {
        name: "Britannia Good Day Butter Cookies",
        image: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500"],
        categoryName: "Bakery & Biscuits",
        subCategoryName: "Cookies & Biscuits",
        unit: "200 g",
        stock: 160,
        price: 40,
        discount: 0,
        description: "Crispy butter cookies with a beautiful smiley design, offering a rich taste."
    },
    {
        name: "Britannia Bourbon Biscuits",
        image: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"],
        categoryName: "Bakery & Biscuits",
        subCategoryName: "Cookies & Biscuits",
        unit: "150 g",
        stock: 130,
        price: 30,
        discount: 0,
        description: "Chocolate cream biscuits sprinkled with sugar crystals."
    },
    {
        name: "Parle-G Gluco Biscuits",
        image: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500"],
        categoryName: "Bakery & Biscuits",
        subCategoryName: "Cookies & Biscuits",
        unit: "250 g",
        stock: 300,
        price: 15,
        discount: 0,
        description: "The original glucose biscuits, filled with energy, milk, and wheat."
    },
    {
        name: "Oreo Chocolate Cookies",
        image: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500"],
        categoryName: "Bakery & Biscuits",
        subCategoryName: "Cookies & Biscuits",
        unit: "120 g",
        stock: 220,
        price: 35,
        discount: 2,
        description: "Rich dark chocolate cookie sandwich with a sweet vanilla cream filling."
    },
    {
        name: "Britannia Marie Gold Biscuits",
        image: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500"],
        categoryName: "Bakery & Biscuits",
        subCategoryName: "Cookies & Biscuits",
        unit: "250 g",
        stock: 240,
        price: 30,
        discount: 0,
        description: "Light, crispy tea biscuits baked with goodness of wheat and 10 vitamins."
    },
    {
        name: "Britannia NutriChoice Digestive",
        image: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500"],
        categoryName: "Bakery & Biscuits",
        subCategoryName: "Cookies & Biscuits",
        unit: "250 g",
        stock: 180,
        price: 70,
        discount: 10,
        description: "High-fiber wheat biscuits, no added sugar, perfect healthy tea companion."
    },
    {
        name: "Parle Hide & Seek Cookies",
        image: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500"],
        categoryName: "Bakery & Biscuits",
        subCategoryName: "Cookies & Biscuits",
        unit: "200 g",
        stock: 140,
        price: 50,
        discount: 5,
        description: "Classic chocolate chip cookies baked with premium chocolate chips."
    },
    {
        name: "Sunfeast Dark Fantasy Fills",
        image: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500"],
        categoryName: "Bakery & Biscuits",
        subCategoryName: "Cookies & Biscuits",
        unit: "150 g",
        stock: 160,
        price: 80,
        discount: 15,
        description: "Crunchy baked chocolate cookies containing a molten, luxurious chocolate center."
    },
    {
        name: "Britannia Little Hearts Biscuits",
        image: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500"],
        categoryName: "Bakery & Biscuits",
        subCategoryName: "Cookies & Biscuits",
        unit: "75 g",
        stock: 200,
        price: 25,
        discount: 0,
        description: "Heart-shaped sugar sprinkled crispy puffed biscuits, delightful melt-in-mouth snack."
    },
    {
        name: "Cadbury Chocobake Chocolate Cakes",
        image: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"],
        categoryName: "Bakery & Biscuits",
        subCategoryName: "Cakes & Muffins",
        unit: "150 g",
        stock: 80,
        price: 90,
        discount: 10,
        description: "Soft chocolate cake layers filled with delicious Cadbury liquid chocolate center."
    },

    // ==========================================
    // Category 8: Atta, Rice & Dal (10 items)
    // ==========================================
    {
        name: "Aashirvaad Shudh Chakki Atta",
        image: ["https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=500"],
        categoryName: "Atta, Rice & Dal",
        subCategoryName: "Atta & Flour",
        unit: "10 kg",
        stock: 150,
        price: 460,
        discount: 5,
        description: "100% pure whole wheat flour processed in traditional stone chakki grinders."
    },
    {
        name: "Fortune Chakki Fresh Atta",
        image: ["https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=500"],
        categoryName: "Atta, Rice & Dal",
        subCategoryName: "Atta & Flour",
        unit: "5 kg",
        stock: 130,
        price: 240,
        discount: 0,
        description: "Natural whole wheat atta, stone-ground, retains dietary fiber and nutrients."
    },
    {
        name: "Fortune Rozana Basmati Rice",
        image: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500"],
        categoryName: "Atta, Rice & Dal",
        subCategoryName: "Basmati Rice & Dals",
        unit: "5 kg",
        stock: 90,
        price: 399,
        discount: 15,
        description: "Perfectly aged fragrant basmati rice grains, ideal for daily pulao."
    },
    {
        name: "Tata Sampann Toor Dal",
        image: ["https://images.unsplash.com/photo-1547058881-aa0edd92aab3?w=500"],
        categoryName: "Atta, Rice & Dal",
        subCategoryName: "Basmati Rice & Dals",
        unit: "1 kg",
        stock: 110,
        price: 185,
        discount: 7,
        description: "High-protein, unpolished yellow split pigeon peas (Toor Dal). Natural taste."
    },
    {
        name: "Tata Sampann Moong Dal",
        image: ["https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500"],
        categoryName: "Atta, Rice & Dal",
        subCategoryName: "Basmati Rice & Dals",
        unit: "1 kg",
        stock: 120,
        price: 160,
        discount: 5,
        description: "Unpolished split yellow moong dal. Sourced from high quality farms."
    },
    {
        name: "Tata Sampann Masoor Dal",
        image: ["https://images.unsplash.com/photo-1515543904379-3d757afe72e2?w=500"],
        categoryName: "Atta, Rice & Dal",
        subCategoryName: "Basmati Rice & Dals",
        unit: "1 kg",
        stock: 95,
        price: 140,
        discount: 10,
        description: "Unpolished red split lentils (Masoor Dal), cooks fast and rich in nutrients."
    },
    {
        name: "Tata Sampann Kabuli Chana",
        image: ["https://images.unsplash.com/photo-1536304997881-a372c179924b?w=500"],
        categoryName: "Atta, Rice & Dal",
        subCategoryName: "Basmati Rice & Dals",
        unit: "1 kg",
        stock: 80,
        price: 155,
        discount: 5,
        description: "Premium large unpolished chickpeas, rich in protein and fiber."
    },
    {
        name: "Fortune Soyabean Oil",
        image: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500"],
        categoryName: "Atta, Rice & Dal",
        subCategoryName: "Basmati Rice & Dals",
        unit: "1 L",
        stock: 200,
        price: 135,
        discount: 5,
        description: "Refined Soyabean cooking oil, light, healthy, and enriched with Vitamin A & D."
    },
    {
        name: "Fortune Mustard Oil",
        image: ["https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=500"],
        categoryName: "Atta, Rice & Dal",
        subCategoryName: "Basmati Rice & Dals",
        unit: "1 L",
        stock: 180,
        price: 165,
        discount: 8,
        description: "Kachi Ghani pure mustard cooking oil, strong aroma and natural flavor."
    },
    {
        name: "Tata Salt",
        image: ["https://images.unsplash.com/photo-1604882737321-e6937fd6f519?w=500"],
        categoryName: "Atta, Rice & Dal",
        subCategoryName: "Basmati Rice & Dals",
        unit: "1 kg",
        stock: 400,
        price: 28,
        discount: 0,
        description: "Iodised vacuum evaporated table salt, the country's trusted choice."
    }
];

async function seed() {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected successfully. Clearing old records...");

        // Clear existing records
        await CategoryModel.deleteMany({});
        await SubCategoryModel.deleteMany({});
        await ProductModel.deleteMany({});

        console.log("Creating categories...");
        const createdCategories = await CategoryModel.insertMany(categoriesData);
        console.log(`Created ${createdCategories.length} categories.`);

        // Map Category Name -> ObjectId
        const categoryMap = {};
        createdCategories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        console.log("Creating subcategories...");
        const subCategoriesPayload = subCategoriesData.map(sub => ({
            name: sub.name,
            image: sub.image,
            category: [categoryMap[sub.categoryName]]
        }));
        const createdSubCategories = await SubCategoryModel.insertMany(subCategoriesPayload);
        console.log(`Created ${createdSubCategories.length} subcategories.`);

        // Map SubCategory Name -> ObjectId
        const subCategoryMap = {};
        createdSubCategories.forEach(sub => {
            subCategoryMap[sub.name] = sub._id;
        });

        console.log("Creating products...");
        const productsPayload = productsData.map(prod => ({
            name: prod.name,
            image: prod.image,
            category: [categoryMap[prod.categoryName]],
            subCategory: [subCategoryMap[prod.subCategoryName]],
            unit: prod.unit,
            stock: prod.stock,
            price: prod.price,
            discount: prod.discount,
            description: prod.description,
            publish: true
        }));
        const createdProducts = await ProductModel.insertMany(productsPayload);
        console.log(`Created ${createdProducts.length} products.`);

        console.log("Creating text indexes on Product collection...");
        await ProductModel.createIndexes();

        console.log("Database seeded successfully with professional dummy data!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seed();
