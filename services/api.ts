
import {
    User, Order, BusinessPartner, FeaturedItem, Restaurant, Pharmacy, ProductVariant, Address, CreditCard, Review, OrderStatus, BusinessType, DeliveryPartner, GroceryProduct, MedicineProduct
} from '../types';
import { restaurants as initialRestaurants } from '../data/foodData';
import { groceryProducts as initialGroceryProducts } from '../data/groceryData';
import { medicineProducts as initialMedicineProducts, pharmacies as initialPharmacies } from '../data/medicinesData';
import { menuData as initialMenuData } from '../data/menuData';

// --- MOCK DATABASE INITIALIZATION ---
const initializeDatabase = () => {
    if (!localStorage.getItem('api_initialized_v5_delivery')) { // Updated version key
        console.log("Initializing Mock API Database in localStorage...");
        
        const initialPartners: BusinessPartner[] = initialRestaurants.map(r => ({
            id: r.id,
            businessName: r.name,
            ownerName: `Owner of ${r.name}`,
            email: `${r.name.toLowerCase().replace(/\s/g, '')}@example.com`,
            businessType: 'Restaurant',
            status: 'Active',
            memberSince: new Date().toISOString(),
        }));
        localStorage.setItem('api_business_partners', JSON.stringify(initialPartners));

        const initialDeliveryPartners: DeliveryPartner[] = [
            { id: 1, name: 'Rider Rick', email: 'rick@rider.com', phone: '555-0101', vehicleType: 'Motorcycle', status: 'Active', memberSince: new Date().toISOString(), totalEarnings: 1250.75 },
            { id: 2, name: 'Cyclist Cathy', email: 'cathy@cyclist.com', phone: '555-0102', vehicleType: 'Bicycle', status: 'Active', memberSince: new Date().toISOString(), totalEarnings: 850.50 },
            { id: 3, name: 'Driver Dan', email: 'dan@driver.com', phone: '555-0103', vehicleType: 'Car', status: 'Inactive', memberSince: new Date().toISOString(), totalEarnings: 2100.00 },
        ];
        localStorage.setItem('api_delivery_partners', JSON.stringify(initialDeliveryPartners));
        
        initialRestaurants.forEach(r => {
            const menu = initialMenuData[r.id] || [];
            localStorage.setItem(`api_menu_${r.id}`, JSON.stringify(menu));
        });

        localStorage.setItem('api_pharmacies', JSON.stringify(initialPharmacies));
        localStorage.setItem('api_products_grocery', JSON.stringify(initialGroceryProducts));
        localStorage.setItem('api_products_medicine', JSON.stringify(initialMedicineProducts));
        
        localStorage.setItem('api_users', JSON.stringify({})); 
        localStorage.setItem('api_orders', JSON.stringify([]));
        localStorage.setItem('api_reviews', JSON.stringify([])); 
        
        localStorage.setItem('api_initialized_v5_delivery', 'true');
    }
};

initializeDatabase();

const MOCK_API_DELAY = 300; 

const mockFetch = <T>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(data))); 
        }, MOCK_API_DELAY);
    });
};

const _getAllReviews = (): Review[] => {
    return JSON.parse(localStorage.getItem('api_reviews') || '[]');
};

// --- RATING CALCULATION HELPER ---
const _applyRatingsAndReviews = (items: (FeaturedItem | Restaurant)[], allReviews: Review[], targetType: 'product' | 'restaurant') => {
    return items.map(item => {
        const itemReviews = allReviews.filter(r => r.targetType === targetType && r.targetId === item.id);
        const reviewCount = itemReviews.length;
        if (reviewCount === 0) {
            return { ...item, rating: item.rating || 3.5, reviewCount: 0 };
        }
        const totalRating = itemReviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRating / reviewCount;

        return {
            ...item,
            rating: parseFloat(averageRating.toFixed(1)),
            reviewCount: reviewCount
        };
    });
};

// --- API FUNCTIONS ---

export const uploadImage = (file: File): Promise<string> => {
    console.log(`Simulating upload for ${file.name}...`);
    return new Promise(resolve => {
        setTimeout(() => {
            const mockUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
            console.log(`Upload finished. Mock URL: ${mockUrl}`);
            resolve(mockUrl);
        }, 1500);
    });
};

// USER API
export const getUserProfile = (email: string, defaults: Partial<User>): Promise<User> => {
    const users: Record<string, User> = JSON.parse(localStorage.getItem('api_users') || '{}');
    if (users[email]) {
        return mockFetch(users[email]);
    } else {
        const newUser: User = {
            id: `user_${Date.now()}`,
            email,
            name: defaults.name || 'New User',
            photoURL: defaults.photoURL,
            phone: '',
            registeredDate: new Date().toISOString(),
            status: 'active',
            addresses: [{ id: `addr_${Date.now()}`, street: 'Plot No 42, Infocity Avenue', city: 'Bhubaneswar', country: 'India', postalCode: '751024', isDefault: true, lat: 20.2961, lng: 85.8245 }],
            paymentMethods: [{ id: `card_${Date.now()}`, last4: '4242', brand: 'Visa', expiry: '12/28', isDefault: true }],
        };
        users[email] = newUser;
        localStorage.setItem('api_users', JSON.stringify(users));
        return mockFetch(newUser);
    }
};

export const updateUserProfile = (email: string, updatedUser: User): Promise<User> => {
    const users: Record<string, User> = JSON.parse(localStorage.getItem('api_users') || '{}');
    users[email] = updatedUser;
    localStorage.setItem('api_users', JSON.stringify(users));
    return mockFetch(updatedUser);
};

export const getAllUsers = (): Promise<User[]> => {
    const users: Record<string, User> = JSON.parse(localStorage.getItem('api_users') || '{}');
    return mockFetch(Object.values(users));
};

export const createUser = (userData: Partial<User>): Promise<User> => {
    if (!userData.email) return Promise.reject("Email is required to create a user.");
    const users: Record<string, User> = JSON.parse(localStorage.getItem('api_users') || '{}');
    const newUser = { ...getUserProfile(userData.email, userData), ...userData };
    users[userData.email] = newUser as User;
    localStorage.setItem('api_users', JSON.stringify(users));
    return mockFetch(newUser as User);
};

export const updateUser = (email: string, userData: Partial<User>): Promise<User> => {
    const users: Record<string, User> = JSON.parse(localStorage.getItem('api_users') || '{}');
    if (!users[email]) return Promise.reject("User not found.");
    users[email] = { ...users[email], ...userData };
    localStorage.setItem('api_users', JSON.stringify(users));
    return mockFetch(users[email]);
};

export const deleteUser = (email: string): Promise<void> => {
    const users: Record<string, User> = JSON.parse(localStorage.getItem('api_users') || '{}');
    delete users[email];
    localStorage.setItem('api_users', JSON.stringify(users));
    return mockFetch(undefined);
};

export const updateUserStatus = (email: string, status: 'active' | 'suspended'): Promise<User> => {
    const users: Record<string, User> = JSON.parse(localStorage.getItem('api_users') || '{}');
    if (users[email]) {
        users[email].status = status;
        localStorage.setItem('api_users', JSON.stringify(users));
        return mockFetch(users[email]);
    }
    return Promise.reject("User not found");
};

// RESTAURANT & MENU API
export const getRestaurants = (): Promise<Restaurant[]> => {
    const restaurants = JSON.parse(JSON.stringify(initialRestaurants)) as Restaurant[];
    const allReviews = _getAllReviews();
    const restaurantsWithRatings = _applyRatingsAndReviews(restaurants, allReviews, 'restaurant') as Restaurant[];
    return mockFetch(restaurantsWithRatings);
};

export const getRestaurantById = async (id: number): Promise<Restaurant> => {
    const restaurants = await getRestaurants();
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) throw new Error("Restaurant not found");
    return mockFetch(restaurant);
};

export const getMenuForRestaurant = (restaurantId: number): Promise<FeaturedItem[]> => {
    const menu = JSON.parse(localStorage.getItem(`api_menu_${restaurantId}`) || '[]') as FeaturedItem[];
    const allReviews = _getAllReviews();
    const menuWithRatings = _applyRatingsAndReviews(menu, allReviews, 'product') as FeaturedItem[];
    return mockFetch(menuWithRatings);
};

export const updateMenuForRestaurant = (restaurantId: number, menu: FeaturedItem[]): Promise<FeaturedItem[]> => {
    // Strip dynamic fields before saving
    const menuToSave = menu.map(({ rating, reviewCount, ...item }) => item);
    localStorage.setItem(`api_menu_${restaurantId}`, JSON.stringify(menuToSave));
    return mockFetch(menu);
};

// PHARMACY & MEDICINE API
export const getPharmacies = (): Promise<Pharmacy[]> => {
    return mockFetch(initialPharmacies);
};

export const getMedicineProducts = (): Promise<MedicineProduct[]> => {
    const products = JSON.parse(localStorage.getItem('api_products_medicine') || '[]') as MedicineProduct[];
    const allReviews = _getAllReviews();
    const productsWithRatings = _applyRatingsAndReviews(products, allReviews, 'product') as MedicineProduct[];
    return mockFetch(productsWithRatings);
};

// FIX: Added the missing getGroceryProducts function
export const getGroceryProducts = (): Promise<GroceryProduct[]> => {
    const products = JSON.parse(localStorage.getItem('api_products_grocery') || '[]') as GroceryProduct[];
    const allReviews = _getAllReviews();
    const productsWithRatings = _applyRatingsAndReviews(products, allReviews, 'product') as GroceryProduct[];
    return mockFetch(productsWithRatings);
};


// GENERAL PRODUCT API
export const getAllProducts = async (): Promise<FeaturedItem[]> => {
    const [grocery, medicine] = await Promise.all([
        getGroceryProducts(),
        getMedicineProducts(),
    ]);
    const allMenus = await Promise.all(initialRestaurants.map(r => getMenuForRestaurant(r.id)));
    const menuItems = allMenus.flat();
    return [...grocery, ...medicine, ...menuItems];
};

export const getProductById = async (id: number): Promise<FeaturedItem> => {
    const allProducts = await getAllProducts();
    const product = allProducts.find(p => p.id === id);
    if (!product) throw new Error("Product not found");
    return mockFetch(product);
};

// ORDER API
export const createOrder = (orderData: Omit<Order, 'id' | 'date'>): Promise<Order> => {
    const orders: Order[] = JSON.parse(localStorage.getItem('api_orders') || '[]');
    const newOrder: Order = {
        ...orderData,
        id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
        date: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    localStorage.setItem('api_orders', JSON.stringify(orders));
    // Set notification flag for business dashboard
    localStorage.setItem('new_order_for_business', JSON.stringify({ orderId: newOrder.id, restaurantId: newOrder.restaurantId, timestamp: Date.now() }));
    return mockFetch(newOrder);
};

export const getOrdersForUser = (email: string): Promise<Order[]> => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem('api_orders') || '[]');
    const userOrders = allOrders.filter(o => o.customerEmail === email);
    return mockFetch(userOrders);
};

export const getOrdersForBusiness = (restaurantId: number): Promise<Order[]> => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem('api_orders') || '[]');
    const businessOrders = allOrders.filter(o => o.restaurantId === restaurantId);
    return mockFetch(businessOrders);
};

export const getAllOrders = (): Promise<Order[]> => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem('api_orders') || '[]');
    return mockFetch(allOrders);
};

export const updateOrderStatusAdmin = (id: number, status: OrderStatus): Promise<Order> => {
    const orders: Order[] = JSON.parse(localStorage.getItem('api_orders') || '[]');
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) return Promise.reject("Order not found");
    orders[orderIndex].status = status;
    localStorage.setItem('api_orders', JSON.stringify(orders));
    return mockFetch(orders[orderIndex]);
};

export const deleteOrder = (id: number): Promise<void> => {
    let orders: Order[] = JSON.parse(localStorage.getItem('api_orders') || '[]');
    orders = orders.filter(o => o.id !== id);
    localStorage.setItem('api_orders', JSON.stringify(orders));
    return mockFetch(undefined);
};

// PARTNER API
export const getBusinessPartners = (): Promise<BusinessPartner[]> => {
    const partners = JSON.parse(localStorage.getItem('api_business_partners') || '[]');
    return mockFetch(partners);
};

export const createBusinessPartner = (partnerData: Partial<BusinessPartner>): Promise<BusinessPartner> => {
    const partners: BusinessPartner[] = JSON.parse(localStorage.getItem('api_business_partners') || '[]');
    const newPartner: BusinessPartner = {
        id: partnerData.id || Date.now(),
        businessName: partnerData.businessName || '',
        ownerName: partnerData.ownerName || '',
        email: partnerData.email || '',
        businessType: partnerData.businessType || 'Other',
        status: 'Active',
        memberSince: new Date().toISOString(),
    };
    partners.push(newPartner);
    localStorage.setItem('api_business_partners', JSON.stringify(partners));
    return mockFetch(newPartner);
};

export const updatePartner = (id: number, partnerData: Partial<BusinessPartner>): Promise<BusinessPartner> => {
    const partners: BusinessPartner[] = JSON.parse(localStorage.getItem('api_business_partners') || '[]');
    const index = partners.findIndex(p => p.id === id);
    if (index === -1) return Promise.reject("Partner not found");
    partners[index] = { ...partners[index], ...partnerData };
    localStorage.setItem('api_business_partners', JSON.stringify(partners));
    return mockFetch(partners[index]);
};

export const deletePartner = (id: number): Promise<void> => {
    let partners: BusinessPartner[] = JSON.parse(localStorage.getItem('api_business_partners') || '[]');
    partners = partners.filter(p => p.id !== id);
    localStorage.setItem('api_business_partners', JSON.stringify(partners));
    return mockFetch(undefined);
};

export const updatePartnerStatus = (id: number, status: 'Active' | 'Inactive'): Promise<BusinessPartner> => {
    const partners: BusinessPartner[] = JSON.parse(localStorage.getItem('api_business_partners') || '[]');
    const index = partners.findIndex(p => p.id === id);
    if (index === -1) return Promise.reject("Partner not found");
    partners[index].status = status;
    localStorage.setItem('api_business_partners', JSON.stringify(partners));
    return mockFetch(partners[index]);
};

// DELIVERY PARTNER API
export const getAllDeliveryPartners = (): Promise<DeliveryPartner[]> => {
    const partners = JSON.parse(localStorage.getItem('api_delivery_partners') || '[]');
    return mockFetch(partners);
};

export const createDeliveryPartner = (partnerData: Partial<DeliveryPartner>): Promise<DeliveryPartner> => {
    const partners: DeliveryPartner[] = JSON.parse(localStorage.getItem('api_delivery_partners') || '[]');
    const newPartner: DeliveryPartner = {
        id: partnerData.id || Date.now(),
        name: partnerData.name || '',
        email: partnerData.email || '',
        phone: partnerData.phone || '',
        vehicleType: partnerData.vehicleType || 'Motorcycle',
        status: 'Active',
        memberSince: new Date().toISOString(),
        totalEarnings: 0
    };
    partners.push(newPartner);
    localStorage.setItem('api_delivery_partners', JSON.stringify(partners));
    return mockFetch(newPartner);
};

export const updateDeliveryPartner = (id: number, partnerData: Partial<DeliveryPartner>): Promise<DeliveryPartner> => {
    const partners: DeliveryPartner[] = JSON.parse(localStorage.getItem('api_delivery_partners') || '[]');
    const index = partners.findIndex(p => p.id === id);
    if (index === -1) return Promise.reject("Delivery Partner not found");
    partners[index] = { ...partners[index], ...partnerData };
    localStorage.setItem('api_delivery_partners', JSON.stringify(partners));
    return mockFetch(partners[index]);
};

export const deleteDeliveryPartner = (id: number): Promise<void> => {
    let partners: DeliveryPartner[] = JSON.parse(localStorage.getItem('api_delivery_partners') || '[]');
    partners = partners.filter(p => p.id !== id);
    localStorage.setItem('api_delivery_partners', JSON.stringify(partners));
    return mockFetch(undefined);
};

export const updateDeliveryPartnerStatus = (id: number, status: 'Active' | 'Inactive'): Promise<DeliveryPartner> => {
    const partners: DeliveryPartner[] = JSON.parse(localStorage.getItem('api_delivery_partners') || '[]');
    const index = partners.findIndex(p => p.id === id);
    if (index === -1) return Promise.reject("Delivery Partner not found");
    partners[index].status = status;
    localStorage.setItem('api_delivery_partners', JSON.stringify(partners));
    return mockFetch(partners[index]);
};


// REVIEW API
export const addReview = (reviewData: Omit<Review, 'id' | 'date'>): Promise<Review> => {
    const reviews: Review[] = JSON.parse(localStorage.getItem('api_reviews') || '[]');
    const newReview: Review = {
        ...reviewData,
        id: `review_${Date.now()}`,
        date: new Date().toISOString(),
    };
    reviews.unshift(newReview);
    localStorage.setItem('api_reviews', JSON.stringify(reviews));
    return mockFetch(newReview);
};

export const getReviewsForTarget = (targetId: number, targetType: 'product' | 'restaurant'): Promise<Review[]> => {
    const allReviews = _getAllReviews();
    const targetReviews = allReviews.filter(r => r.targetId === targetId && r.targetType === targetType);
    return mockFetch(targetReviews);
};

export const hasUserPurchased = async (userEmail: string, targetId: number, targetType: 'product' | 'restaurant'): Promise<boolean> => {
    const orders = await getOrdersForUser(userEmail);
    if (targetType === 'product') {
        return orders.some(order => order.items.some(item => item.productId === targetId));
    }
    if (targetType === 'restaurant') {
        return orders.some(order => order.restaurantId === targetId);
    }
    return false;
};

export const hasUserReviewed = async (userEmail: string, targetId: number, targetType: 'product' | 'restaurant'): Promise<boolean> => {
    const allReviews = _getAllReviews();
    return allReviews.some(r => r.userEmail === userEmail && r.targetId === targetId && r.targetType === targetType);
};
