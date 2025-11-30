import { FeaturedItem } from '../types';

const featuredDataIndia: FeaturedItem[] = [
    { id: 101, name: "Paneer Butter Masala", category: "Indian Cuisine", rating: 4.9, deliveryTime: "30-35 min", imageUrl: "https://picsum.photos/400/300?random=101", isNew: true, price: 250, description: "Creamy and rich tomato-based curry with chunks of soft paneer, perfect with naan or rice.", ingredients: ["Paneer", "Tomato", "Cream", "Butter", "Spices"], variants: [{name: "Half", price: 150}, {name: "Full", price: 250}] },
    { id: 701, name: "Chhena Poda", category: "Odia Sweets", rating: 5.0, deliveryTime: "20-25 min", imageUrl: "https://picsum.photos/400/300?random=701", isNew: true, price: 180, description: "The quintessential Odia dessert, a caramelized baked cottage cheese cake with a hint of cardamom.", ingredients: ["Chhena (Cottage Cheese)", "Sugar", "Cardamom", "Ghee"], variants: [{name: "250g", price: 90}, {name: "500g", price: 180}] },
    { id: 102, name: "Big Bazaar Daily", category: "Grocery", rating: 4.7, deliveryTime: "20-25 min", imageUrl: "https://picsum.photos/400/300?random=102", price: 80, description: "Your one-stop shop for daily essentials and groceries, delivered fast." },
    { id: 702, name: "Macha Ghanta", category: "Odia Cuisine", rating: 4.8, deliveryTime: "40-45 min", imageUrl: "https://picsum.photos/400/300?random=702", price: 350, description: "A traditional Odia fish curry cooked with mixed vegetables in a flavorful gravy." },
    { id: 103, name: "Chicken Biryani", category: "Mughlai", rating: 4.8, deliveryTime: "35-40 min", imageUrl: "https://picsum.photos/400/300?random=103", price: 320, description: "Aromatic basmati rice cooked with succulent chicken and a blend of exotic spices." },
    { id: 104, name: "Apollo Pharmacy", category: "Medicine", rating: 4.9, deliveryTime: "10-15 min", imageUrl: "https://picsum.photos/400/300?random=104", price: 150, description: "Trusted pharmacy for all your healthcare needs, delivering medicines and wellness products." },
];

const featuredDataUSA: FeaturedItem[] = [
    { id: 1, name: "The Pizza Place", category: "Italian", rating: 4.8, deliveryTime: "25-30 min", imageUrl: "https://picsum.photos/400/300?random=10", isNew: true, price: 12.99, description: "Classic New York style pizza with a crispy crust and fresh toppings.", ingredients: ["Flour", "Tomato Sauce", "Mozzarella Cheese"], variants: [{name: "Medium 12\"", price: 12.99}, {name: "Large 16\"", price: 18.99}] },
    { id: 2, name: "FreshMart Groceries", category: "Grocery", rating: 4.9, deliveryTime: "15-20 min", imageUrl: "https://picsum.photos/400/300?random=11", price: 5.49, description: "Farm-fresh groceries and daily essentials delivered to your door." },
    { id: 3, name: "Burger House", category: "Fast Food", rating: 4.5, deliveryTime: "20-25 min", imageUrl: "https://picsum.photos/400/300?random=12", price: 8.50, description: "Juicy, handcrafted burgers made with 100% Angus beef." },
    { id: 4, name: "City Pharmacy", category: "Medicine", rating: 4.9, deliveryTime: "10-15 min", imageUrl: "https://picsum.photos/400/300?random=13", price: 20.00, description: "Your local pharmacy for prescriptions and over-the-counter medications." },
];

export const featuredDataByCountry: { [country: string]: FeaturedItem[] } = {
    'India': featuredDataIndia,
    'USA': featuredDataUSA,
    'UK': featuredDataUSA, // Defaulting to USA data for now
    'Japan': featuredDataUSA, // Defaulting to USA data for now
};