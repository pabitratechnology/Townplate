import React from 'react';
import { FeaturedItem, ProductVariant } from '../types';
import { StarIcon } from './IconComponents';

interface ProductCarouselProps {
    title: string;
    items: FeaturedItem[];
    currencySymbol: string;
    onAddToCart: (item: FeaturedItem, variant?: ProductVariant, quantity?: number) => void;
}

const ProductCard: React.FC<{ item: FeaturedItem; currencySymbol: string; onAddToCart: (item: FeaturedItem) => void; }> = ({ item, currencySymbol, onAddToCart }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = `#/product/${item.id}`;
    };

    return (
        <a href={`#/product/${item.id}`} onClick={handleClick} className="flex-shrink-0 w-44 sm:w-48 bg-white dark:bg-charcoal-light rounded-xl border border-gray-200 dark:border-charcoal p-3 flex flex-col text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-full h-28 sm:h-32 mb-2 flex items-center justify-center">
                <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain"/>
            </div>
            <div className="flex-grow flex flex-col justify-between">
                <div>
                    <h4 className="font-bold text-sm h-10 leading-tight">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                            <StarIcon className="h-4 w-4 text-yellow-400" />
                            <span className="text-xs font-bold">{item.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-gray-400">({item.reviewCount || 0})</span>
                    </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                    <span className="font-extrabold">{currencySymbol}{item.price.toFixed(2)}</span>
                    <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(item); }}
                        className="px-5 py-1.5 text-sm font-bold rounded-lg border-2 border-brand-saffron/20 text-brand-saffron bg-brand-saffron/10 hover:bg-brand-saffron hover:text-white transition"
                        aria-label={`Add ${item.name} to cart`}
                    >
                        ADD
                    </button>
                </div>
            </div>
        </a>
    );
};

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, items, currencySymbol, onAddToCart }) => {
    if (items.length === 0) return null;
    
    const categoryLink = `#/grocery?category=${encodeURIComponent(title)}`;

    return (
        <section className="py-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black">{title}</h3>
                <a href={categoryLink} onClick={(e) => { e.preventDefault(); window.location.hash = categoryLink; }} className="text-sm font-bold text-brand-saffron hover:underline">see all</a>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {items.map(item => (
                    <ProductCard key={item.id} item={item} currencySymbol={currencySymbol} onAddToCart={onAddToCart} />
                ))}
            </div>
        </section>
    );
};

export default ProductCarousel;
