
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import PromotionalBanners from '../components/PromotionalBanners';
import Testimonials from '../components/Testimonials';
import ProductCarousel from '../components/ProductCarousel';
import WhyChooseUs from '../components/WhyChooseUs';
import AIPrompt from '../components/AIPrompt';
import Events from '../components/Events';
import { Location, FeaturedItem } from '../types';
import * as api from '../services/api';


interface HomePageProps {
    location: Location;
    onAddToCart: (item: FeaturedItem) => void;
    onSearch: (term: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ location, onAddToCart, onSearch }) => {
    const [productsByCategory, setProductsByCategory] = useState<Record<string, FeaturedItem[]>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = `TownPlate | Food, Grocery & More in ${location.city}`;
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', `Order food, groceries, and daily essentials online in ${location.city} from the best local stores. Fast delivery, great offers, all on TownPlate.`);
        }
    }, [location.city]);


    useEffect(() => {
        const fetchGroceryData = async () => {
            setIsLoading(true);
            try {
                const groceryProducts = await api.getGroceryProducts();
                const groupedProducts = groceryProducts.reduce((acc, product) => {
                    const category = product.category;
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(product);
                    return acc;
                }, {} as Record<string, FeaturedItem[]>);
                setProductsByCategory(groupedProducts);
            } catch (error) {
                console.error("Failed to fetch grocery products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGroceryData();
    }, [location]);


    return (
        <>
            <Hero location={location} onSearch={onSearch} />
            <Categories />
            <Events />
            <WhyChooseUs />
            <PromotionalBanners />
            <AIPrompt />
            
            <div className="container mx-auto px-4 py-8">
                 {isLoading ? (
                    <div className="text-center py-10">
                        <div className="w-12 h-12 border-4 border-brand-saffron border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 font-semibold">Loading fresh products...</p>
                    </div>
                ) : (
                    Object.entries(productsByCategory).map(([category, items]) => (
                         <ProductCarousel
                            key={category}
                            title={category}
                            items={items}
                            currencySymbol={location.currencySymbol}
                            onAddToCart={onAddToCart}
                        />
                    ))
                )}
            </div>

            <Testimonials />
        </>
    );
};

export default HomePage;