import React, { useState, useEffect } from 'react';
import { Location, Restaurant, FeaturedItem, ProductVariant, User, Review } from '../types';
import { StarIcon, PlusCircleIcon, ArrowLeftIcon, CheckCircleIcon } from '../components/IconComponents';
import * as api from '../services/api';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import StarRatingDisplay from '../components/StarRatingDisplay';

const SCRIPT_ID = 'json-ld-script';

const injectJSONLD = (restaurant: Restaurant, location: Location) => {
    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
        existingScript.remove();
    }

    if (!restaurant) return;

    const schema = {
        "@context": "https://schema.org",
        "@type": "FoodEstablishment",
        "name": restaurant.name,
        "image": restaurant.imageUrl,
        "servesCuisine": restaurant.cuisine.join(", "),
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": restaurant.rating,
            "reviewCount": restaurant.reviewCount || 0
        },
        "priceRange": `~${location.currencySymbol}${restaurant.priceForTwo}`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": location.city,
            "addressCountry": location.country
        }
    };

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
};

interface RestaurantPageProps {
  currentUser: User | null;
  location: Location;
  onAddToCart: (product: FeaturedItem, variant?: ProductVariant, quantity?: number) => void;
}

const RestaurantPage: React.FC<RestaurantPageProps> = ({ currentUser, location, onAddToCart }) => {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menu, setMenu] = useState<FeaturedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [canUserReview, setCanUserReview] = useState(false);
    const [hasUserReviewed, setHasUserReviewed] = useState(false);

    const requestLogin = () => {
        window.dispatchEvent(new CustomEvent('request-login'));
    };
    
    const checkUserStatus = async (user: User | null, restaurantId: number) => {
        if (!user) {
            setCanUserReview(false);
            setHasUserReviewed(false);
            return;
        }
        const [purchased, reviewed] = await Promise.all([
            api.hasUserPurchased(user.email, restaurantId, 'restaurant'),
            api.hasUserReviewed(user.email, restaurantId, 'restaurant')
        ]);
        setHasUserReviewed(reviewed);
        setCanUserReview(purchased && !reviewed);
    };

    useEffect(() => {
        const fetchRestaurantData = async () => {
            setIsLoading(true);
            const hashParts = window.location.hash.split('/');
            const id = parseInt(hashParts[hashParts.length - 1], 10);

            if (id) {
                try {
                    const [restaurantData, menuData, reviewData] = await Promise.all([
                        api.getRestaurantById(id),
                        api.getMenuForRestaurant(id),
                        api.getReviewsForTarget(id, 'restaurant')
                    ]);
                    setRestaurant(restaurantData);
                    setMenu(menuData);
                    setReviews(reviewData);
                    checkUserStatus(currentUser, id);
                } catch (error) {
                    console.error("Failed to fetch restaurant data:", error);
                    setRestaurant(null);
                    setMenu([]);
                }
            }
            setIsLoading(false);
        };

        fetchRestaurantData();
        
        return () => {
            const existingScript = document.getElementById(SCRIPT_ID);
            if (existingScript) existingScript.remove();
        };

    }, [window.location.hash, currentUser]);
    
    useEffect(() => {
        if (restaurant) {
            document.title = `${restaurant.name} - Order Online - TownPlate`;
            const descriptionTag = document.getElementById('page-description');
            if (descriptionTag) {
                descriptionTag.setAttribute('content', `Order from ${restaurant.name} in ${location.city}. Enjoy ${restaurant.cuisine.join(', ')} food delivered fast. View menu, ratings, and reviews.`);
            }
            injectJSONLD(restaurant, location);
        }
    }, [restaurant, location]);


    const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (window.history.length > 2) {
            window.history.back();
        } else {
            window.location.hash = '#/food';
        }
    };
    
    const handleReviewSubmit = async (reviewData: Omit<Review, 'id' | 'date'>) => {
        if (!restaurant) return;
        await api.addReview(reviewData);
        
        const [updatedRestaurant, updatedReviews] = await Promise.all([
            api.getRestaurantById(restaurant.id),
            api.getReviewsForTarget(restaurant.id, 'restaurant')
        ]);

        setRestaurant(updatedRestaurant);
        setReviews(updatedReviews);
        checkUserStatus(currentUser, restaurant.id);
    };

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-brand-saffron border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!restaurant) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Restaurant not found.</p>
            </div>
        );
    }
    
    const menuByCategory: Record<string, FeaturedItem[]> = {};
    for (const item of menu) {
        const category = item.category || 'Miscellaneous';
        if (!menuByCategory[category]) {
            menuByCategory[category] = [];
        }
        menuByCategory[category].push(item);
    }

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Food Delivery', href: '#/food' },
        { label: restaurant.name }
    ];

    return (
        <div className="animate-fade-in">
            {/* Header section with image */}
            <div className="relative h-64 md:h-80">
                <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
                    <h1 className="text-4xl md:text-5xl font-black">{restaurant.name}</h1>
                    <p className="mt-1 text-lg opacity-90">{restaurant.cuisine.join(', ')}</p>
                    <a href="#reviews" className="mt-2 flex items-center text-sm font-semibold bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                        <StarIcon className="h-5 w-5 text-green-400 mr-1.5"/>
                        <span>{restaurant.rating.toFixed(1)} ({restaurant.reviewCount || 0} reviews)</span>
                        <span className="mx-2 text-white/50">•</span>
                        <span>{restaurant.deliveryTime}</span>
                        <span className="mx-2 text-white/50">•</span>
                        <span>{location.currencySymbol}{restaurant.priceForTwo} for two</span>
                    </a>
                </div>
                 <a href="#" onClick={handleBack} aria-label="Go back" className="absolute top-6 left-6 bg-black/30 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/50 transition">
                    <ArrowLeftIcon className="w-6 h-6"/>
                </a>
            </div>

            {/* Breadcrumbs */}
             <nav aria-label="Breadcrumb" className="bg-gray-50 dark:bg-charcoal-light">
                <div className="container mx-auto px-4">
                    <ol className="flex items-center space-x-2 text-sm font-semibold text-gray-500 dark:text-gray-400 py-2">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="flex items-center">
                                {crumb.href ? (
                                    <a href={crumb.href} onClick={(e) => { e.preventDefault(); window.location.hash = crumb.href; }} className="hover:text-brand-chakra-blue transition-colors">{crumb.label}</a>
                                ) : (
                                    <span className="text-charcoal dark:text-white">{crumb.label}</span>
                                )}
                                {index < breadcrumbs.length - 1 && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                )}
                            </li>
                        ))}
                    </ol>
                </div>
            </nav>

            {/* Menu & Reviews Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {Object.keys(menuByCategory).length > 0 ? (
                        Object.entries(menuByCategory).map(([category, items]) => (
                            <section key={category} className="mb-10">
                                <h2 className="text-3xl font-bold mb-4 border-b-2 border-brand-saffron/50 pb-2">{category}</h2>
                                <div className="space-y-4">
                                    {items.map(item => {
                                        const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                                            e.preventDefault();
                                            window.location.hash = `#/product/${item.id}`;
                                        };

                                        return (
                                            <a href={`#/product/${item.id}`} key={item.id} onClick={handleClick} className="block w-full text-left p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-charcoal-light transition-colors group">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 pr-4">
                                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                                                        <p className="font-bold text-brand-saffron mt-2">{location.currencySymbol}{item.price.toFixed(2)}</p>
                                                    </div>
                                                    <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden bg-gray-200 dark:bg-charcoal relative">
                                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                                                        <button 
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(item); }}
                                                            className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-1.5 font-bold text-xs rounded-md bg-white dark:bg-charcoal text-brand-saffron shadow-md border border-gray-200 dark:border-charcoal-light group-hover:bottom-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                                            aria-label={`Add ${item.name} to cart`}
                                                        >
                                                        <PlusCircleIcon className="w-4 h-4"/>
                                                        ADD
                                                        </button>
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </section>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-10">This restaurant hasn't added their menu yet. Please check back later!</p>
                    )}
                    
                    <section id="reviews" className="mt-10">
                        <h2 className="text-3xl font-bold mb-4 border-b-2 border-brand-saffron/50 pb-2">Ratings & Reviews</h2>
                         <div className="bg-white dark:bg-charcoal-light p-6 rounded-2xl shadow-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            <div className="text-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-charcoal pb-4 md:pb-0 md:pr-4">
                                <p className="text-5xl font-black text-brand-chakra-blue">{restaurant.rating.toFixed(1)}</p>
                                <StarRatingDisplay rating={restaurant.rating} size="h-6 w-6" />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Based on {restaurant.reviewCount} reviews</p>
                            </div>
                            <div className="md:col-span-2">
                                {currentUser && canUserReview && (
                                    <ReviewForm
                                        targetId={restaurant.id}
                                        targetType="restaurant"
                                        user={currentUser}
                                        onReviewSubmit={handleReviewSubmit}
                                    />
                                )}
                                {currentUser && hasUserReviewed && (
                                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-300 font-semibold">
                                        <CheckCircleIcon className="w-6 h-6 mx-auto mb-2" />
                                        You've already reviewed this restaurant. Thank you!
                                    </div>
                                )}
                                {!currentUser && !canUserReview && !hasUserReviewed && (
                                    <div className="text-center p-4 bg-gray-100 dark:bg-charcoal rounded-lg text-gray-600 dark:text-gray-300">
                                        <p>
                                            <a href="#" onClick={(e) => { e.preventDefault(); requestLogin(); }} className="font-bold text-brand-chakra-blue hover:underline">Log in</a> to share your experience.
                                        </p>
                                         <p className="text-xs mt-1">Only customers who have ordered from this restaurant can leave a review.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <ReviewList reviews={reviews} />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RestaurantPage;