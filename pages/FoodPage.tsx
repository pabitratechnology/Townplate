import React, { useState, useEffect } from 'react';
import { Location, Restaurant, FeaturedItem } from '../types';
import PageHeader from '../components/PageHeader';
import { cuisines } from '../data/foodData';
import { StarIcon, SearchIcon } from '../components/IconComponents';
import * as api from '../services/api';

interface FoodPageProps {
  location: Location;
  onAddToCart: (item: FeaturedItem) => void;
}

const RestaurantCard: React.FC<{ restaurant: Restaurant, currencySymbol: string }> = ({ restaurant, currencySymbol }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = `#/restaurant/${restaurant.id}`;
    };

    return (
        <a href={`#/restaurant/${restaurant.id}`} onClick={handleClick} className="group bg-white dark:bg-charcoal-light rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl dark:hover:shadow-brand-chakra-blue/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
            <div className="relative">
                <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent w-full h-20"></div>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-bold truncate">{restaurant.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{restaurant.cuisine.join(', ')}</p>
                <div className="flex-grow"></div>
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-charcoal flex items-center flex-wrap gap-x-2 text-sm text-gray-700 dark:text-gray-300 font-semibold">
                    <div className="flex items-center">
                        <StarIcon className="h-5 w-5 text-green-500 mr-1"/>
                        <span>{restaurant.rating.toFixed(1)} ({restaurant.reviewCount || 0})</span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span>{restaurant.deliveryTime}</span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span>{currencySymbol}{restaurant.priceForTwo} for two</span>
                </div>
            </div>
        </a>
    );
};

const FoodPage: React.FC<FoodPageProps> = ({ location, onAddToCart }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
    const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        document.title = `Food Delivery in ${location.city} - TownPlate`;
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', `Order your favorite food from the best restaurants in ${location.city}. Fast delivery on pizza, biryani, and more.`);
        }
    }, [location.city]);


    useEffect(() => {
        const fetchRestaurants = async () => {
            setIsLoading(true);
            try {
                const restaurants = await api.getRestaurants();
                setAllRestaurants(restaurants);
            } catch (error) {
                console.error("Failed to fetch restaurants:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRestaurants();
    }, [location]);

    const handleCuisineToggle = (cuisine: string) => {
        setSelectedCuisines(prev => 
            prev.includes(cuisine) 
                ? prev.filter(c => c !== cuisine) 
                : [...prev, cuisine]
        );
    };

    const filteredRestaurants = allRestaurants.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCuisine = selectedCuisines.length === 0 || selectedCuisines.some(c => r.cuisine.some(rc => rc.toLowerCase() === c.toLowerCase()));
        return matchesSearch && matchesCuisine;
    });

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Food Delivery' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader 
                title="Food Delivery"
                subtitle={`Order from the best restaurants in ${location.city}`}
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-8">
                {/* Search and Filter Bar */}
                <div className="mb-8">
                    <div className="relative max-w-2xl mx-auto mb-6">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Search for restaurants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 dark:bg-charcoal-light border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition"
                        />
                    </div>
                     <div className="text-center">
                        <h4 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-3 tracking-wider">Filter by Cuisine</h4>
                        <div className="flex flex-wrap justify-center gap-2">
                            {cuisines.map(cuisine => (
                                <button
                                    key={cuisine}
                                    onClick={() => handleCuisineToggle(cuisine)}
                                    className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${selectedCuisines.includes(cuisine) ? 'bg-brand-chakra-blue text-white' : 'bg-gray-200 dark:bg-charcoal-light hover:bg-gray-300 dark:hover:bg-charcoal'}`}
                                >
                                    {cuisine}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Restaurant Grid */}
                {isLoading ? (
                    <div className="text-center py-10">
                        <div className="w-12 h-12 border-4 border-brand-chakra-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 font-semibold">Loading Restaurants...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredRestaurants.map(restaurant => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} currencySymbol={location.currencySymbol} />
                        ))}
                    </div>
                )}
                 {!isLoading && filteredRestaurants.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 col-span-full py-10">
                        No restaurants found matching your criteria.
                    </p>
                )}
            </div>
        </div>
    );
};

export default FoodPage;