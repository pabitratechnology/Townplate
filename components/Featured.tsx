

import React, { useState, useEffect } from 'react';
import { FeaturedItem, ProductVariant } from '../types';
import { StarIcon, SearchIcon, ShareIcon } from './IconComponents';

interface ServiceCardProps {
    item: FeaturedItem;
    currencySymbol: string;
    onAddToCart: (item: FeaturedItem, variant?: ProductVariant, quantity?: number) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ item, currencySymbol, onAddToCart }) => {
    const hasVariants = item.variants && item.variants.length > 0;
    
    // Initialize state with the first variant if it exists, otherwise undefined.
    const [selectedVariantName, setSelectedVariantName] = useState<string | undefined>(
        hasVariants ? item.variants![0].name : undefined
    );

    // Find the full variant object based on the selected name
    const selectedVariant = hasVariants 
        ? item.variants!.find(v => v.name === selectedVariantName)
        : undefined;
    
    // Determine the price to display: variant price or base price
    const displayPrice = selectedVariant ? selectedVariant.price : item.price;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = `#/product/${item.id}`;
    };

    const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
 
        const shareData = {
            title: item.name,
            text: item.description || `Check out ${item.name} on TownPlate!`,
            url: `${window.location.origin}${window.location.pathname}#/product/${item.id}`,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing product:', err);
            }
        } else {
            prompt("Copy this link to share:", shareData.url);
        }
    };

    const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.stopPropagation(); // Prevent card click-through
        setSelectedVariantName(e.target.value);
    };

    const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart(item, selectedVariant);
    };

    return (
        <a href={`#/product/${item.id}`} onClick={handleClick} className="group bg-white dark:bg-charcoal-light rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl dark:hover:shadow-brand-chakra-blue/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
            <div className="relative overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                {item.isNew && <div className="absolute top-3 left-3 bg-brand-chakra-blue text-white text-xs font-black uppercase px-3 py-1 rounded-md shadow-lg tracking-wider animate-pulse">Featured</div>}
                <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent w-full h-1/2"></div>
                <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-charcoal/90 px-2 py-1 rounded-full text-sm font-bold">{item.deliveryTime}</div>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-bold truncate">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.category}</p>
                <div className="flex-grow"></div>
                
                {/* Variant and Price section */}
                <div className="mt-4">
                    {hasVariants && item.variants!.length > 1 ? (
                        <div className="mb-2">
                            <label htmlFor={`variant-select-${item.id}`} className="sr-only">Select variant for {item.name}</label>
                            <select
                                id={`variant-select-${item.id}`}
                                value={selectedVariantName}
                                onChange={handleVariantChange}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full p-2 text-sm rounded-md bg-gray-100 dark:bg-charcoal border border-gray-200 dark:border-charcoal-light focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue"
                            >
                                {item.variants!.map(variant => (
                                    <option key={variant.name} value={variant.name}>
                                        {variant.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : hasVariants ? (
                        // If only one variant, just display its name for consistency in layout
                        <div className="h-[40px] mb-2 flex items-center">
                             <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold px-2">{item.variants![0].name}</p>
                        </div>
                    ) : (
                        // Placeholder for alignment if no variants
                        <div className="h-[40px] mb-2"></div>
                    )}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/50 px-2.5 py-1 rounded-full">
                                <StarIcon className="h-4 w-4 text-brand-green" />
                                <span className="text-sm font-bold text-brand-green dark:text-green-200">{item.rating.toFixed(1)}</span>
                            </div>
                             <span className="text-xs text-gray-500 dark:text-gray-400">({item.reviewCount || 0})</span>
                        </div>
                        <span className="font-bold text-lg">{currencySymbol}{displayPrice.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <button
                        onClick={handleAddToCartClick}
                        aria-label={`Add ${item.name} to cart`}
                        className="w-full px-4 py-2 text-sm font-bold rounded-full bg-brand-chakra-blue/10 text-brand-chakra-blue border-2 border-transparent hover:bg-brand-chakra-blue hover:text-white transition-all transform hover:scale-105"
                    >
                        ADD TO CART
                    </button>
                    <button
                        onClick={handleShare}
                        aria-label={`Share ${item.name}`}
                        className="flex-shrink-0 p-2.5 rounded-full bg-gray-200/80 dark:bg-charcoal text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-300 dark:hover:bg-charcoal-dark transition-all transform hover:scale-105"
                    >
                        <ShareIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </a>
    );
};

interface FeaturedProps {
    items: FeaturedItem[];
    currencySymbol: string;
    onAddToCart: (item: FeaturedItem, variant?: ProductVariant, quantity?: number) => void;
}

const Featured: React.FC<FeaturedProps> = ({ items, currencySymbol, onAddToCart }) => {
    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedRating, setSelectedRating] = useState(0); // 0 = All ratings
    
    // Dynamically determine price range from items
    const maxPossiblePrice = items.length > 0 ? Math.ceil(Math.max(...items.map(item => item.price))) : 100;
    const [maxPrice, setMaxPrice] = useState(maxPossiblePrice);

    // Reset max price if items change (e.g., location change)
    useEffect(() => {
        const newMax = items.length > 0 ? Math.ceil(Math.max(...items.map(item => item.price))) : 100;
        setMaxPrice(newMax);
    }, [items]);

    // Get unique categories for the dropdown
    const categories = ['All', ...Array.from(new Set(items.map(item => item.category)))];

    // Apply all filters
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === 'All' || item.category === selectedCategory) &&
        item.rating >= selectedRating &&
        item.price <= maxPrice
    );

    return (
        <section className="py-16 bg-gray-50 dark:bg-charcoal-light">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-black text-center mb-8">Popular Near You</h2>
                
                <div className="max-w-6xl mx-auto mb-12 p-6 bg-white dark:bg-charcoal rounded-2xl shadow-lg border border-gray-200 dark:border-charcoal-light">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                        {/* Search by Name */}
                        <div className="relative">
                            <label htmlFor="search-name" className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-300">Item Name</label>
                            <SearchIcon className="absolute bottom-3.5 left-4 h-5 w-5 text-gray-400 pointer-events-none" />
                            <input
                                id="search-name"
                                type="text"
                                placeholder="e.g., Pizza, Burger..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 dark:bg-charcoal-light border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition"
                            />
                        </div>
                        
                        {/* Filter by Category */}
                        <div>
                            <label htmlFor="category-select" className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-300">Category</label>
                            <select
                                id="category-select"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-full bg-gray-100 dark:bg-charcoal-light border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition appearance-none"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Filter by Rating */}
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-300">Rating</label>
                            <div className="flex space-x-1 rounded-full bg-gray-100 dark:bg-charcoal-light p-1">
                                {[{ rating: 4, label: '4★ +' }, { rating: 3, label: '3★ +' }, { rating: 0, label: 'All' }].map(({ rating, label }) => (
                                    <button
                                        key={rating}
                                        onClick={() => setSelectedRating(rating)}
                                        className={`w-1/3 text-center font-bold transition-colors text-sm rounded-full py-2 ${
                                            selectedRating === rating
                                                ? 'bg-white dark:bg-charcoal shadow text-brand-chakra-blue'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-charcoal'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Filter by Price */}
                        <div>
                            <label htmlFor="price-range" className="block text-sm font-bold mb-2 text-gray-600 dark:text-gray-300">
                                Max Price: <span className="font-black text-brand-chakra-blue">{currencySymbol}{maxPrice}</span>
                            </label>
                            <input
                                id="price-range"
                                type="range"
                                min="0"
                                max={maxPossiblePrice}
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-charcoal rounded-lg appearance-none cursor-pointer accent-brand-chakra-blue"
                            />
                        </div>
                    </div>
                </div>


                {filteredItems.length > 0 ? (
                    <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
                        {filteredItems.map((item) => (
                            <ServiceCard key={item.id} item={item} currencySymbol={currencySymbol} onAddToCart={onAddToCart} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-white dark:bg-charcoal rounded-2xl shadow-md max-w-lg mx-auto">
                        <SearchIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                        <h3 className="text-xl font-bold text-charcoal dark:text-white">No Items Found</h3>
                        <p className="mt-2 text-md text-gray-500 dark:text-gray-400">We couldn't find any items that match your search and filter settings.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Please try adjusting your criteria.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Featured;