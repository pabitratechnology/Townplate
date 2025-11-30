import React from 'react';

export type AppTheme = 'light' | 'dark';

export type Location = {
  city: string;
  country: string;
  currency: string;
  currencySymbol: string;
};

export interface Category {
  name: string;
  icon: React.ReactNode;
  bgColor: string;
  shadowColor: string;
  href: string;
}

export interface ProductVariant {
  name: string; // e.g., "500g", "Large", "Spicy"
  price: number;
}

export interface CustomizationOption {
  name: string;
  price: number; // Price difference, can be 0
}

export interface CustomizationGroup {
  name: string; // e..g., "Choose Your Crust", "Extra Toppings"
  type: 'radio' | 'checkbox';
  required: boolean;
  options: CustomizationOption[];
}


export interface FeaturedItem {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviewCount?: number;
  deliveryTime: string;
  imageUrl: string;
  isNew?: boolean;
  price: number; // Represents a base or default price
  unit?: string;
  description?: string;
  ingredients?: string[];
  variants?: ProductVariant[];
  customizationGroups?: CustomizationGroup[];
  availability?: 'In Stock' | 'Out of Stock';
}

export interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string;
  avatarUrl: string;
}

export type CartItem = {
  id: string; // Composite key: `${productId}-${variantName}-${customizationHash}`
  productId: number;
  name: string; // Product's main name
  variantName: string;
  price: number; // Final price including variant and customizations
  imageUrl: string;
  quantity: number;
  customizations?: {
    groupName: string;
    optionName: string;
    price: number;
  }[];
};

export interface Address {
  id: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
  lat?: number;
  lng?: number;
}

export interface CreditCard {
  id: string;
  last4: string;
  brand: 'Visa' | 'Mastercard' | 'American Express' | 'Other';
  expiry: string; // "MM/YY"
  isDefault?: boolean;
}

export type User = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    photoURL?: string;
    addresses?: Address[];
    paymentMethods?: CreditCard[];
    registeredDate: string;
    status: 'active' | 'suspended';
};

export type OrderStatus = 'Processing' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: number;
  date: string;
  items: CartItem[];
  totalAmount: number;
  currencySymbol: string;
  status: OrderStatus;
  restaurantId: number;
  customerName: string;
  customerEmail?: string;
}

export interface Review {
  id: string;
  targetId: number; // productId or restaurantId
  targetType: 'product' | 'restaurant';
  userEmail: string;
  userName: string;
  userPhotoURL?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string; // ISO string
}


// --- New Types for Service Pages ---

export interface Restaurant {
    id: number;
    name: string;
    cuisine: string[];
    rating: number;
    reviewCount?: number;
    deliveryTime: string;
    priceForTwo: number;
    imageUrl: string;
}

export interface GroceryStore {
    id: number;
    name: string;
    deliveryTime: string;
    imageUrl: string;
    tags: string[];
}

export interface Pharmacy {
    id: number;
    name: string;
    deliveryTime: string;
    imageUrl: string;
    isOpen247: boolean;
}

export interface MedicineProduct extends FeaturedItem {
    // description, ingredients, variants will be inherited
}

export interface GroceryProduct extends FeaturedItem {
    // description, ingredients, variants will be inherited
}

export interface GroceryCategory {
  name: string;
  imageUrl: string;
  href: string;
}

export interface HomeService {
    id: number;
    name: string;
    description: string;
    icon: React.ReactNode;
}

export interface VehicleOption {
  id: string;
  name: string;
  description: string;
  capacity: string;
  icon: React.ComponentType<{ className?: string }>;
  baseFare: number;
  perKmFare: number;
}


// --- New Types for Delivery Partners ---

export type DeliveryOrderStatus = 'Accepted' | 'Picked Up' | 'Delivered';

export interface DeliveryOrder {
  id: number;
  customerName: string;
  pickupAddress: string;
  dropoffAddress: string;
  status: DeliveryOrderStatus;
  earnings: number;
}

export interface DeliveryPartner {
    id: number;
    name: string;
    email: string;
    phone?: string;
    vehicleType: 'Motorcycle' | 'Bicycle' | 'Car';
    status: 'Active' | 'Inactive' | 'Pending';
    memberSince: string;
    totalEarnings: number;
}


// --- New Types for Business Owners and Admin ---

export type BusinessType = 'Restaurant' | 'Grocery Store' | 'Pharmacy' | 'Other';
export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface BusinessApplication {
  id: number;
  businessName: string;
  ownerName: string;
  email: string;
  businessType: BusinessType;
  status: ApplicationStatus;
  date: string;
}

export interface BusinessPartner {
  id: number; // This will correspond to a restaurant ID from foodData
  businessName: string;
  ownerName: string;
  email: string;
  businessType: BusinessType;
  status: 'Active' | 'Inactive';
  memberSince: string;
}

export type AIFoodSuggestion = {
  name: string;
  description: string;
};
