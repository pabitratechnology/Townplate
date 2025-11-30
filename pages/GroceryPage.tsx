import React, { useState, useEffect } from 'react';
import { Location, FeaturedItem } from '../types';
import PageHeader from '../components/PageHeader';
import { SearchIcon } from '../components/IconComponents';
import * as api from '../services/api';

interface GroceryPageProps {
  location: Location;
  onAddToCart: (item: FeaturedItem) => void;
}

// A dedicated product card for the grocery grid view to ensure good responsiveness and layout.
const ProductGridCard: React.FC<{ item: FeaturedItem; currencySymbol: string; onAddToCart: (item: FeaturedItem) => void; }> = ({ item, currencySymbol, onAddToCart }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = `#/product/${item.id}`;
    };

    return (
        <a href={`#/product/${item.id}`} onClick={handleClick} className="group bg-white dark:bg-charcoal-light rounded-xl overflow-hidden shadow-lg hover:shadow-2xl dark:hover:shadow-brand-saffron/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
            <div className="relative w-full aspect-[4/3] bg-gray-50 dark:bg-charcoal p-2 flex items-center justify-center">
                <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <div className="p-3 flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 h-4">{item.unit || ''}</p>
                    <h3 className="font-bold text-sm h-10 leading-tight my-1">{item.name}</h3>
                </div>
                <div className="mt-2 flex justify-between items-center">
                    <span className="font-extrabold text-md">{currencySymbol}{item.price.toFixed(2)}</span>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(item); }}
                        className="px-4 py-1.5 text-xs font-bold rounded-lg border-2 border-brand-saffron/20 text-brand-saffron bg-brand-saffron/10 hover:bg-brand-saffron hover:text-white transition"
                        aria-label={`Add ${item.name} to cart`}
                    >
                        ADD
                    </button>
                </div>
            </div>
        </a>
    );
};

const GroceryPage: React.FC<GroceryPageProps> = ({ location, onAddToCart }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [products, setProducts] = useState<FeaturedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = `Grocery Delivery in ${location.city} - TownPlate`;
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', `Get your daily groceries and essentials delivered fast in ${location.city}. Order milk, bread, eggs, fruits, and vegetables online.`);
        }
    }, [location.city]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const categoryFromUrl = params.get('category');
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        } else {
            // Reset to 'All' if no category in URL on hash change
            setSelectedCategory('All');
        }
    }, [window.location.hash]);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const groceryProducts = await api.getGroceryProducts();
                setProducts(groceryProducts);
            } catch (error) {
                console.error("Failed to fetch grocery products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [location]);

    // Get unique categories from all grocery products for the filter dropdown.
    const categories = ['All', ...Array.from(new Set(products.map(item => item.category)))];

    // Filter products based on search term and selected category.
    const filteredProducts = products.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === 'All' || item.category === selectedCategory)
    );
    
    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Grocery' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Grocery Delivery"
                subtitle={`Fresh essentials delivered fast in ${location.city}`}
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-8">
                {/* Search and Filter Bar */}
                <div className="mb-8 p-4 bg-white dark:bg-charcoal-light rounded-xl shadow-md border border-gray-200 dark:border-charcoal">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div className="md:col-span-3">
                            <label htmlFor="grocery-search" className="sr-only">Search Products</label>
                            <div className="relative">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="grocery-search"
                                    type="text"
                                    placeholder="Search for milk, bread, eggs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-saffron transition"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                             <label htmlFor="grocery-category" className="sr-only">Select Category</label>
                             <select
                                id="grocery-category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-full bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-saffron transition appearance-none text-center md:text-left"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                     <div className="text-center py-10">
                        <div className="w-12 h-12 border-4 border-brand-saffron border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 font-semibold">Loading Groceries...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                        {filteredProducts.map(item => (
                            <ProductGridCard key={item.id} item={item} currencySymbol={location.currencySymbol} onAddToCart={onAddToCart} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-600 dark:text-gray-300">No products found.</p>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroceryPage;