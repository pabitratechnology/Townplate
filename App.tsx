import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from './firebase';
import Header from './components/Header';
import Footer from './components/Footer';
import LocationModal from './components/LocationModal';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';
import MobileBottomNav from './components/MobileBottomNav';
import AssistantModal from './components/AssistantModal';
import { AppTheme, Location, CartItem, FeaturedItem, User, Order, ProductVariant, CustomizationOption } from './types';
import { AssistantIcon } from './components/IconComponents';
import HomePage from './pages/HomePage';
import FoodPage from './pages/FoodPage';
import GroceryPage from './pages/GroceryPage';
import MedicinesPage from './pages/MedicinesPage';
import HomeServicesPage from './pages/HomeServicesPage';
import PickupDropPage from './pages/PickupDropPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import BecomePartnerPage from './pages/partner/BecomePartnerPage';
import BusinessOwnerPage from './pages/business/BusinessOwnerPage';
import DeliveryPartnerPage from './pages/partner/DeliveryPartnerPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DeliveryPartnerDashboardPage from './pages/partner/DeliveryPartnerDashboardPage';
import BusinessDashboardPage from './pages/business/BusinessDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import QuizPage from './pages/QuizPage';
import SearchResultsPage from './pages/SearchResultsPage';
import RestaurantPage from './pages/RestaurantPage';
import ProductPage from './pages/ProductPage';
import MakeThisPage from './pages/MakeThisPage';
import EditProfilePage from './pages/EditProfilePage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import * as api from './services/api';
import DeliveryPartnerLoginPage from './pages/partner/DeliveryPartnerLoginPage';


// New Page Imports
import AboutUsPage from './pages/company/AboutUsPage';
import TeamPage from './pages/company/TeamPage';
import CareersPage from './pages/company/CareersPage';
import BlogPage from './pages/company/BlogPage';
import HelpSupportPage from './pages/contact/HelpSupportPage';
import TermsPage from './pages/legal/TermsPage';
import CookiePolicyPage from './pages/legal/CookiePolicyPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';

type SelectedCustomization = { groupName: string; option: CustomizationOption };

const App: React.FC = () => {
  const [theme, setTheme] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedPrefs = window.localStorage.getItem('theme');
      if (storedPrefs === 'light') {
        return 'light';
      }
    }
    // Default to dark mode
    return 'dark';
  });

  const [location, setLocation] = useState<Location>({ city: 'Bhubaneswar', country: 'India', currency: 'INR', currencySymbol: '₹' });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [checkoutIntent, setCheckoutIntent] = useState(false);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global login request handler
  useEffect(() => {
    const handleLoginRequest = () => setIsAuthModalOpen(true);
    window.addEventListener('request-login', handleLoginRequest as EventListener);
    return () => window.removeEventListener('request-login', handleLoginRequest as EventListener);
  }, []);

  // Theme Management
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  // Auth Management with Firebase & Backend
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // After Firebase auth, get full profile from our backend
        try {
            const userProfile = await api.getUserProfile(user.email!, {
                name: user.displayName || 'User',
                photoURL: user.photoURL || undefined,
            });
            
            // Security check: If user is suspended, log them out immediately.
            if (userProfile.status === 'suspended') {
                alert('Your account has been suspended by an administrator.');
                await signOut(auth);
                setCurrentUser(null);
            } else {
                setCurrentUser(userProfile);
            }
        } catch (error) {
            console.error("Failed to fetch user profile from backend", error);
            // Fallback to basic Firebase info without status checks
            setCurrentUser({ 
                id: `fb_${user.uid}`,
                name: user.displayName || 'User', 
                email: user.email!,
                registeredDate: user.metadata.creationTime || new Date().toISOString(),
                status: 'active'
            });
        }
      } else {
        setCurrentUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);


  // Location Management & Dynamic Content
  const handleLocationChange = useCallback((newLocation: Location) => {
    setLocation(newLocation);
    window.localStorage.setItem('townplate-location', JSON.stringify(newLocation));
    setIsLocationModalOpen(false);
  }, []);
  
  useEffect(() => {
    const savedLocationString = window.localStorage.getItem('townplate-location');
    let initialLocation = { city: 'Bhubaneswar', country: 'India', currency: 'INR', currencySymbol: '₹' };
    
    if (savedLocationString) {
      try {
        const savedLocation = JSON.parse(savedLocationString);
        initialLocation = savedLocation;
      } catch (e) {
        console.error("Failed to parse location from localStorage", e);
      }
    }
    handleLocationChange(initialLocation);
  }, [handleLocationChange]);

  
  // Cart Management
  useEffect(() => {
    const savedCart = window.localStorage.getItem('townplate-cart');
    if (savedCart) {
        try {
            setCartItems(JSON.parse(savedCart));
        } catch (e) {
            console.error("Failed to parse cart from localStorage", e);
            setCartItems([]);
        }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('townplate-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleAddToCart = (product: FeaturedItem, variant?: ProductVariant, quantity: number = 1, customizations: SelectedCustomization[] = []) => {
    const selectedVariant = variant || (product.variants && product.variants[0]) || { name: product.unit || 'Standard', price: product.price };
    
    // Create a stable ID for customizations to differentiate cart items
    const customizationId = customizations.map(c => c.option.name).sort().join('-');
    const cartId = `${product.id}-${selectedVariant.name}-${customizationId}`;

    const customizationPrice = customizations.reduce((acc, curr) => acc + curr.option.price, 0);
    const finalPrice = selectedVariant.price + customizationPrice;

    setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === cartId);
        if (existingItem) {
            return prevItems.map(item =>
                item.id === cartId ? { ...item, quantity: item.quantity + quantity } : item
            );
        } else {
            const newItem: CartItem = {
                id: cartId,
                productId: product.id,
                name: product.name,
                variantName: selectedVariant.name,
                price: finalPrice,
                imageUrl: product.imageUrl,
                quantity: quantity,
                customizations: customizations.map(c => ({
                    groupName: c.groupName,
                    optionName: c.option.name,
                    price: c.option.price
                }))
            };
            return [...prevItems, newItem];
        }
    });
  };
  
  const handleRemoveFromCart = (cartId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== cartId));
  };
  
  const handleUpdateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
        handleRemoveFromCart(cartId);
    } else {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === cartId ? { ...item, quantity: quantity } : item
            )
        );
    }
  };

  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth).catch((error) => console.error("Logout Error: ", error));
    window.location.hash = '#/';
  };

  const handleCheckout = () => {
    if (!currentUser) {
        setCheckoutIntent(true);
        setIsAuthModalOpen(true);
        return;
    }
    if (cartItems.length > 0) {
      setIsPaymentModalOpen(true);
    }
  };
  
  const handleAuthSuccess = async () => {
    setIsAuthModalOpen(false);
    // Re-fetch user from backend on successful auth
    const auth = getAuth(app);
    if(auth.currentUser) {
        const userProfile = await api.getUserProfile(auth.currentUser.email!, {
            name: auth.currentUser.displayName!,
            photoURL: auth.currentUser.photoURL!
        });
        setCurrentUser(userProfile);
    }

    if (checkoutIntent && cartItems.length > 0) {
      setIsPaymentModalOpen(true);
      setCheckoutIntent(false); // Reset intent
    }
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    setCheckoutIntent(false); // Reset intent
  };

  const handleSearch = (term: string) => {
    const trimmedTerm = term.trim();
    if (trimmedTerm) {
      try {
        const recentSearches: string[] = JSON.parse(localStorage.getItem('townplate-recent-searches') || '[]');
        const lowercasedTerm = trimmedTerm.toLowerCase();
        
        const filteredSearches = recentSearches.filter(s => s.toLowerCase() !== lowercasedTerm);
        const newSearches = [trimmedTerm, ...filteredSearches];
        const finalSearches = newSearches.slice(0, 5);
        
        localStorage.setItem('townplate-recent-searches', JSON.stringify(finalSearches));
      } catch (e) {
        console.error("Failed to update recent searches", e);
      }
      
      window.location.hash = `#/search?q=${encodeURIComponent(trimmedTerm)}`;
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    if (currentUser?.email) {
        try {
            const savedUser = await api.updateUserProfile(currentUser.email, updatedUser);
            setCurrentUser(savedUser);
        } catch (error) {
            console.error("Failed to update user profile via API", error);
        }
    }
  };

  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePaymentSuccess = async () => {
    // Calculate final total including fees and taxes
    const deliveryFee = cartSubtotal * 0.05;
    const taxes = cartSubtotal * 0.1;
    const finalTotal = cartSubtotal + deliveryFee + taxes;

    // For demo purposes, assign the order to a random restaurant
    const restaurants = await api.getRestaurants();
    const restaurantIds = restaurants.map(r => r.id);

    if (restaurantIds.length === 0) {
        console.error("No restaurants available to assign order to.");
        return;
    }
    const randomRestaurantId = restaurantIds[Math.floor(Math.random() * restaurantIds.length)];

    const newOrder: Omit<Order, 'id' | 'date'> = {
        items: cartItems,
        totalAmount: finalTotal,
        currencySymbol: location.currencySymbol,
        status: 'Processing',
        restaurantId: randomRestaurantId,
        customerName: currentUser?.name || 'Guest User',
        customerEmail: currentUser?.email,
    };

    try {
        await api.createOrder(newOrder);
        setCartItems([]);
        setIsPaymentModalOpen(false);
        setIsCartOpen(false);
        // Optionally redirect to order history
        window.location.hash = '#/orders';
    } catch (error) {
        console.error("Failed to create order", error);
        alert("There was an issue placing your order. Please try again.");
    }
  };
  
  const handleOrderAgain = (orderToReorder: Order) => {
    if (cartItems.length > 0 && !window.confirm("This will clear your current cart and add all items from this past order. Do you want to continue?")) {
      return;
    }
    setCartItems(orderToReorder.items);
    setIsCartOpen(true);
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const renderPage = () => {
    const path = route.split('?')[0];

    if (path.startsWith('#/restaurant/')) {
        return <RestaurantPage currentUser={currentUser} location={location} onAddToCart={handleAddToCart} />;
    }
    if (path.startsWith('#/product/')) {
        return <ProductPage currentUser={currentUser} location={location} onAddToCart={handleAddToCart} />;
    }
     if (path === '#/search') {
        return <SearchResultsPage location={location} onAddToCart={handleAddToCart} />;
    }

    switch (path) {
        case '#/food':
            return <FoodPage location={location} onAddToCart={handleAddToCart} />;
        case '#/grocery':
            return <GroceryPage location={location} onAddToCart={handleAddToCart} />;
        case '#/medicines':
            return <MedicinesPage location={location} onAddToCart={handleAddToCart} />;
        case '#/services':
            return <HomeServicesPage location={location} />;
        case '#/courier':
            return <PickupDropPage location={location} />;
        case '#/orders':
            return currentUser ? <OrderHistoryPage user={currentUser} onOrderAgain={handleOrderAgain} /> : <HomePage location={location} onAddToCart={handleAddToCart} onSearch={handleSearch}/>;
        case '#/profile':
            return currentUser ? <ProfilePage user={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} /> : <HomePage location={location} onAddToCart={handleAddToCart} onSearch={handleSearch}/>;
        case '#/profile/edit':
            return currentUser ? <EditProfilePage user={currentUser} onUpdateUser={handleUpdateUser} /> : <HomePage location={location} onAddToCart={handleAddToCart} onSearch={handleSearch} />;
        case '#/profile/payments':
            return currentUser ? <PaymentMethodsPage user={currentUser} onUpdateUser={handleUpdateUser} /> : <HomePage location={location} onAddToCart={handleAddToCart} onSearch={handleSearch} />;
        case '#/partner/become':
            return <BecomePartnerPage />;
        case '#/business/owners':
            return <BusinessOwnerPage />;
        case '#/business/dashboard':
            return <BusinessDashboardPage />;
        case '#/partner/delivery':
            return <DeliveryPartnerPage />;
        case '#/partner/login':
            return <DeliveryPartnerLoginPage />;
        case '#/partner/dashboard':
            return <DeliveryPartnerDashboardPage />;
        case '#/admin/login':
            return <AdminLoginPage />;
        case '#/admin/dashboard':
            return <AdminDashboardPage />;
        case '#/quiz':
            return <QuizPage />;
        case '#/make-this':
            return <MakeThisPage />;
        // Footer Pages
        case '#/about':
            return <AboutUsPage />;
        case '#/team':
            return <TeamPage />;
        case '#/careers':
            return <CareersPage />;
        case '#/blog':
            return <BlogPage />;
        case '#/support':
            return <HelpSupportPage />;
        case '#/terms':
            return <TermsPage />;
        case '#/cookies':
            return <CookiePolicyPage />;
        case '#/privacy':
            return <PrivacyPolicyPage />;
        case '#/':
        case '':
            return <HomePage 
                        location={location}
                        onAddToCart={handleAddToCart}
                        onSearch={handleSearch}
                    />;
        default:
             return <HomePage 
                        location={location}
                        onAddToCart={handleAddToCart}
                        onSearch={handleSearch}
                    />;
    }
  };

  return (
    <div className="bg-white dark:bg-charcoal text-charcoal dark:text-gray-200 transition-colors duration-500 pb-20 md:pb-0">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme}
        location={location}
        onLocationClick={() => setIsLocationModalOpen(true)}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />
      <main>
        {isAuthLoading ? (
            <div className="h-screen flex items-center justify-center">
                 <div className="w-16 h-16 border-4 border-brand-saffron border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : renderPage()}
      </main>
      <Footer />
      {isLocationModalOpen && (
        <LocationModal 
          currentLocation={location}
          onSelectLocation={handleLocationChange}
          onClose={() => setIsLocationModalOpen(false)}
        />
      )}
      {isAuthModalOpen && (
          <AuthModal 
            onClose={handleCloseAuthModal}
            onAuthSuccess={handleAuthSuccess}
          />
      )}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currencySymbol={location.currencySymbol}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          totalAmount={cartSubtotal}
          currencySymbol={location.currencySymbol}
          currentUser={currentUser}
        />
      )}
      <MobileBottomNav
        currentUser={currentUser}
        onLoginClick={() => setIsAuthModalOpen(true)}
      />
      <button
        onClick={() => setIsAssistantModalOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-16 h-16 bg-brand-chakra-blue text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform animate-pulse-light"
        aria-label="Open AI Assistant"
      >
        <AssistantIcon className="w-8 h-8" />
      </button>

      <AssistantModal
        isOpen={isAssistantModalOpen}
        onClose={() => setIsAssistantModalOpen(false)}
      />
    </div>
  );
};

export default App;
