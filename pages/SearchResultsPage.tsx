import React, { useState, useEffect, useMemo } from 'react';
import { Location, FeaturedItem, Restaurant } from '../types';
import PageHeader from '../components/PageHeader';
import { StarIcon, ClockIcon, TrashIcon, SearchIcon } from '../components/IconComponents';
import * as api from '../services/api';

interface SearchResultsPageProps {
  location: Location;
  onAddToCart: (item: FeaturedItem) => void;
}

const ProductCard: React.FC<{ item: FeaturedItem, currencySymbol: string, onAddToCart: (item: FeaturedItem) => void }> = ({ item, currencySymbol, onAddToCart }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = `#/product/${item.id}`;
    };

    return (
        <a href={`#/product/${item.id}`} onClick={handleClick} className="group bg-white dark:bg-charcoal-light rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
            <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover" />
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-bold truncate">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.category}</p>
                <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-xs font-bold">{item.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-gray-400">({item.reviewCount || 0} reviews)</span>
                </div>
                <div className="flex-grow"></div>
                <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-lg">{currencySymbol}{item.price.toFixed(2)}</span>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(item); }} className="px-4 py-2 text-sm font-bold rounded-full bg-brand-chakra-blue/10 text-brand-chakra-blue border-2 border-transparent hover:bg-brand-chakra-blue hover:text-white transition">
                        ADD TO CART
                    </button>
                </div>
            </div>
        </a>
    );
};


const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ location, onAddToCart }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<FeaturedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        try {
            const searches = JSON.parse(localStorage.getItem('townplate-recent-searches') || '[]');
            setRecentSearches(searches);
        } catch(e) {
            setRecentSearches([]);
        }

        const handleSearch = async () => {
            const params = new URLSearchParams(window.location.hash.split('?')[1]);
            const q = params.get('q') || '';
            setQuery(q);

            if (q) {
                document.title = `Search results for "${q}" - TownPlate`;
                const descriptionTag = document.getElementById('page-description');
                if (descriptionTag) {
                    descriptionTag.setAttribute('content', `Find restaurants, groceries, and services matching "${q}" in ${location.city}.`);
                }

                setIsLoading(true);
                const allProducts = await api.getAllProducts();
                const filtered = allProducts.filter(p => 
                    p.name.toLowerCase().includes(q.toLowerCase()) ||
                    p.category.toLowerCase().includes(q.toLowerCase()) ||
                    (p.description && p.description.toLowerCase().includes(q.toLowerCase()))
                );
                setResults(filtered);
                setIsLoading(false);
            } else {
                setResults([]);
                setIsLoading(false);
            }
        };

        handleSearch();
        const handleHashChange = () => {
             // A small delay to ensure URL is updated, especially on back/forward
            setTimeout(handleSearch, 50);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [location.city]); // Removed window.location.hash dependency to avoid re-triggering

    const handleClearRecents = () => {
        localStorage.removeItem('townplate-recent-searches');
        setRecentSearches([]);
    };

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: `Search for "${query}"` }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title={`Search Results for "${query}"`}
                subtitle={isLoading ? 'Searching...' : `${results.length} items found in ${location.city}`}
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-8">
                {isLoading && <div className="text-center"><div className="w-12 h-12 border-4 border-brand-chakra-blue border-t-transparent rounded-full animate-spin mx-auto"></div></div>}
                {!isLoading && results.length > 0 && (
                    <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
                        {results.map(item => (
                            <ProductCard key={`${item.id}-${query}`} item={item} currencySymbol={location.currencySymbol} onAddToCart={onAddToCart} />
                        ))}
                    </div>
                )}
                {!isLoading && results.length === 0 && (
                    <div className="text-center py-16 px-6 bg-white dark:bg-charcoal-light rounded-2xl shadow-md max-w-lg mx-auto">
                        <SearchIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                        <h2 className="text-2xl font-bold">No Results Found</h2>
                        <p className="text-gray-500 mt-2">We couldn't find anything for "{query}". Try checking your spelling or using different keywords.</p>

                         {recentSearches.length > 0 && (
                            <div className="mt-8">
                                <div className="flex justify-between items-center mb-2">
                                     <h3 className="font-bold text-gray-600 dark:text-gray-300">Recent Searches</h3>
                                     <button onClick={handleClearRecents} className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"><TrashIcon className="w-4 h-4"/> Clear</button>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {recentSearches.map(term => (
                                        <a key={term} href={`#/search?q=${encodeURIComponent(term)}`} className="px-3 py-1 bg-gray-200 dark:bg-charcoal rounded-full text-sm hover:bg-brand-chakra-blue hover:text-white transition">
                                            {term}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;