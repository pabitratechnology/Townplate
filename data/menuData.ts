import { FeaturedItem } from '../types';

export const menuData: Record<number, FeaturedItem[]> = {
    // Pizza Palace (id: 201)
    201: [
        { 
            id: 20101, 
            name: "Margherita Pizza", 
            category: "Pizza", 
            rating: 4.8, 
            deliveryTime: "30 min", 
            imageUrl: "https://picsum.photos/400/300?random=20101", 
            price: 350, 
            description: "Classic Margherita with fresh mozzarella, tomatoes, and basil.", 
            ingredients: ["Dough", "Tomato Sauce", "Mozzarella", "Basil"], 
            variants: [{ name: "Regular", price: 350 }, { name: "Large", price: 550 }],
            customizationGroups: [
                {
                    name: "Choose Your Crust",
                    type: 'radio',
                    required: true,
                    options: [
                        { name: "Classic Hand-Tossed", price: 0 },
                        { name: "Thin Crust", price: 0 },
                        { name: "Cheese Burst", price: 80 }
                    ]
                },
                {
                    name: "Extra Toppings",
                    type: 'checkbox',
                    required: false,
                    options: [
                        { name: "Extra Cheese", price: 50 },
                        { name: "Olives", price: 40 },
                        { name: "Mushrooms", price: 40 },
                        { name: "Jalapenos", price: 30 }
                    ]
                }
            ]
        },
        { id: 20102, name: "Pepperoni Pizza", category: "Pizza", rating: 4.9, deliveryTime: "30 min", imageUrl: "https://picsum.photos/400/300?random=20102", price: 450, description: "A crowd-pleaser with spicy pepperoni and lots of cheese.", ingredients: ["Dough", "Tomato Sauce", "Mozzarella", "Pepperoni"], variants: [{ name: "Regular", price: 450 }, { name: "Large", price: 650 }] },
        { id: 20103, name: "Garlic Breadsticks", category: "Appetizers", rating: 4.7, deliveryTime: "30 min", imageUrl: "https://picsum.photos/400/300?random=20103", price: 180, description: "Warm and buttery breadsticks with a garlic herb topping, served with marinara dip.", ingredients: ["Dough", "Butter", "Garlic", "Herbs"], variants: [{ name: "Standard", price: 180 }] },
    ],
    // Curry House (id: 202)
    202: [
        { id: 20201, name: "Butter Chicken", category: "Main Course", rating: 4.9, deliveryTime: "35 min", imageUrl: "https://picsum.photos/400/300?random=20201", price: 450, description: "Tender chicken in a mildly spiced tomato and butter sauce.", ingredients: ["Chicken", "Tomato", "Butter", "Cream", "Spices"], variants: [{ name: "Half", price: 280 }, { name: "Full", price: 450 }] },
        { id: 20202, name: "Kadai Paneer", category: "Main Course", rating: 4.8, deliveryTime: "35 min", imageUrl: "https://picsum.photos/400/300?random=20202", price: 380, description: "Cottage cheese and bell peppers cooked in a spicy masala.", ingredients: ["Paneer", "Bell Peppers", "Onion", "Tomato", "Spices"], variants: [{ name: "Half", price: 220 }, { name: "Full", price: 380 }] },
        { id: 20203, name: "Garlic Naan", category: "Breads", rating: 4.9, deliveryTime: "35 min", imageUrl: "https://picsum.photos/400/300?random=20203", price: 80, description: "Soft Indian bread topped with garlic and butter.", ingredients: ["Flour", "Yogurt", "Garlic", "Butter"], variants: [{ name: "Standard", price: 80 }] },
    ],
    // Sushi Central (id: 203)
    203: [
        { id: 20301, name: "California Roll", category: "Sushi", rating: 4.7, deliveryTime: "40 min", imageUrl: "https://picsum.photos/400/300?random=20301", price: 550, description: "Classic roll with crab, avocado, and cucumber.", ingredients: ["Sushi Rice", "Nori", "Crab Meat", "Avocado", "Cucumber"], variants: [{ name: "8 Pieces", price: 550 }] },
        { id: 20302, name: "Spicy Tuna Roll", category: "Sushi", rating: 4.8, deliveryTime: "40 min", imageUrl: "https://picsum.photos/400/300?random=20302", price: 650, description: "Tuna mixed with spicy mayo, a favorite for many.", ingredients: ["Sushi Rice", "Nori", "Tuna", "Spicy Mayo"], variants: [{ name: "8 Pieces", price: 650 }] },
        { id: 20303, name: "Miso Soup", category: "Appetizers", rating: 4.6, deliveryTime: "40 min", imageUrl: "https://picsum.photos/400/300?random=20303", price: 150, description: "Traditional Japanese soup with tofu, seaweed, and scallions.", ingredients: ["Miso Paste", "Tofu", "Seaweed", "Dashi"], variants: [{ name: "Standard", price: 150 }] },
    ],
    // Burger Barn (id: 204)
    204: [
        { id: 20401, name: "Classic Cheeseburger", category: "Burgers", rating: 4.6, deliveryTime: "25 min", imageUrl: "https://picsum.photos/400/300?random=20401", price: 280, description: "A juicy beef patty with melted cheese, lettuce, tomato, and our special sauce.", ingredients: ["Beef Patty", "Bun", "Cheese", "Lettuce", "Tomato"], variants: [{ name: "Single Patty", price: 280 }, { name: "Double Patty", price: 400 }] },
        { id: 20402, name: "Bacon & Cheese Burger", category: "Burgers", rating: 4.7, deliveryTime: "25 min", imageUrl: "https://picsum.photos/400/300?random=20402", price: 350, description: "Our classic cheeseburger topped with crispy bacon.", ingredients: ["Beef Patty", "Bun", "Cheese", "Bacon", "Lettuce"], variants: [{ name: "Standard", price: 350 }] },
        { id: 20403, name: "French Fries", category: "Sides", rating: 4.8, deliveryTime: "25 min", imageUrl: "https://picsum.photos/400/300?random=20403", price: 120, description: "Crispy, golden, and perfectly salted.", ingredients: ["Potato", "Salt"], variants: [{ name: "Regular", price: 120 }, { name: "Large", price: 180 }] },
    ],
    // Taco Town (id: 205)
    205: [
        { id: 20501, name: "Chicken Tacos", category: "Tacos", rating: 4.8, deliveryTime: "30 min", imageUrl: "https://picsum.photos/400/300?random=20501", price: 250, description: "Two soft tacos filled with grilled chicken, salsa, and cheese.", ingredients: ["Tortilla", "Chicken", "Salsa", "Cheese", "Lettuce"], variants: [{ name: "2 Tacos", price: 250 }] },
        { id: 20502, name: "Beef Burrito", category: "Burritos", rating: 4.7, deliveryTime: "30 min", imageUrl: "https://picsum.photos/400/300?random=20502", price: 350, description: "A large flour tortilla packed with seasoned beef, rice, beans, and cheese.", ingredients: ["Tortilla", "Beef", "Rice", "Beans", "Cheese"], variants: [{ name: "Standard", price: 350 }] },
        { id: 20503, name: "Chips and Guacamole", category: "Sides", rating: 4.9, deliveryTime: "30 min", imageUrl: "https://picsum.photos/400/300?random=20503", price: 200, description: "Freshly made guacamole served with crispy corn tortilla chips.", ingredients: ["Avocado", "Onion", "Tomato", "Lime", "Corn Chips"], variants: [{ name: "Standard", price: 200 }] },
    ],
    // Noodle Box (id: 206)
    206: [
        { id: 20601, name: "Pad Thai", category: "Noodles", rating: 4.5, deliveryTime: "35 min", imageUrl: "https://picsum.photos/400/300?random=20601", price: 320, description: "Stir-fried rice noodles with shrimp, tofu, peanuts, and a tangy sauce.", ingredients: ["Rice Noodles", "Shrimp", "Tofu", "Peanuts", "Bean Sprouts"], variants: [{ name: "Standard", price: 320 }] },
        { id: 20602, name: "Drunken Noodles", category: "Noodles", rating: 4.6, deliveryTime: "35 min", imageUrl: "https://picsum.photos/400/300?random=20602", price: 340, description: "Spicy wide rice noodles stir-fried with chicken and basil.", ingredients: ["Rice Noodles", "Chicken", "Basil", "Chilli", "Vegetables"], variants: [{ name: "Standard", price: 340 }] },
        { id: 20603, name: "Spring Rolls", category: "Appetizers", rating: 4.7, deliveryTime: "35 min", imageUrl: "https://picsum.photos/400/300?random=20603", price: 180, description: "Crispy fried rolls filled with vegetables, served with a sweet chili sauce.", ingredients: ["Wrapper", "Cabbage", "Carrot", "Noodles"], variants: [{ name: "4 Pieces", price: 180 }] },
    ],
    // Dalma Delights (id: 601)
    601: [
        { id: 60101, name: "Dalma", category: "Main Course", rating: 4.9, deliveryTime: "35 min", imageUrl: "https://picsum.photos/400/300?random=60101", price: 150, description: "The authentic Odia lentil and vegetable stew, a wholesome and nutritious delight.", ingredients: ["Toor Dal", "Mixed Vegetables", "Ghee", "Spices"], variants: [{ name: "Half", price: 90 }, { name: "Full", price: 150 }] },
        { id: 60102, name: "Santula", category: "Main Course", rating: 4.8, deliveryTime: "35 min", imageUrl: "https://picsum.photos/400/300?random=60102", price: 120, description: "A lightly spiced mixed vegetable curry, healthy and flavorful.", ingredients: ["Mixed Vegetables", "Milk", "Panch Phoron"], variants: [{ name: "Standard", price: 120 }] },
        { id: 60103, name: "Badi Chura", category: "Side Dish", rating: 4.9, deliveryTime: "35 min", imageUrl: "https://picsum.photos/400/300?random=60103", price: 80, description: "A crunchy and savory side made from crushed sun-dried lentil dumplings, onion, and garlic.", ingredients: ["Urad Dal Badi", "Onion", "Garlic", "Mustard Oil"], variants: [{ name: "Standard", price: 80 }] },
    ],
    // Pakhala Paradise (id: 602)
    602: [
        { id: 60201, name: "Saja Pakhala", category: "Pakhala", rating: 4.9, deliveryTime: "25 min", imageUrl: "https://picsum.photos/400/300?random=60201", price: 120, description: "Freshly prepared fermented rice water dish, a cooling summer staple.", ingredients: ["Rice", "Water", "Curd"], variants: [{ name: "Standard", price: 120 }] },
        { id: 60202, name: "Dahi Pakhala", category: "Pakhala", rating: 4.8, deliveryTime: "25 min", imageUrl: "https://picsum.photos/400/300?random=60202", price: 140, description: "Fermented rice with yogurt, tempered with curry leaves and mustard seeds.", ingredients: ["Rice", "Water", "Yogurt", "Spices"], variants: [{ name: "Standard", price: 140 }] },
        { id: 60203, name: "Macha Bhaja", category: "Side Dish", rating: 4.9, deliveryTime: "25 min", imageUrl: "https://picsum.photos/400/300?random=60203", price: 200, description: "Shallow fried fish marinated in traditional Odia spices.", ingredients: ["Rohu Fish", "Turmeric", "Chilli Powder", "Mustard Oil"], variants: [{ name: "Standard", price: 200 }] },
    ],
};