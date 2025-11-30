
import React from 'react';
import { Category } from '../types';
import { FoodIcon, GroceryIcon, MedicineIcon, HomeServiceIcon, CourierIcon } from './IconComponents';

const categoriesData: Category[] = [
    { name: 'Food\nDelivery', href: '#/food', icon: <FoodIcon className="h-10 w-10"/>, bgColor: 'bg-red-100 dark:bg-[#4d2a2a]', shadowColor: 'shadow-red-500/20 dark:shadow-red-500/30' },
    { name: 'Grocery', href: '#/grocery', icon: <GroceryIcon className="h-10 w-10"/>, bgColor: 'bg-green-100 dark:bg-[#25422e]', shadowColor: 'shadow-green-500/20 dark:shadow-green-500/30' },
    { name: 'Medicines', href: '#/medicines', icon: <MedicineIcon className="h-10 w-10"/>, bgColor: 'bg-blue-100 dark:bg-[#2c3454]', shadowColor: 'shadow-blue-500/20 dark:shadow-blue-500/30' },
    { name: 'Home\nServices', href: '#/services', icon: <HomeServiceIcon className="h-10 w-10"/>, bgColor: 'bg-yellow-100 dark:bg-[#4d3c22]', shadowColor: 'shadow-yellow-500/20 dark:shadow-yellow-500/30' },
    { name: 'Pickup &\nDrop', href: '#/courier', icon: <CourierIcon className="h-10 w-10"/>, bgColor: 'bg-purple-100 dark:bg-[#412a4a]', shadowColor: 'shadow-purple-500/20 dark:shadow-purple-500/30' },
];

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        window.location.hash = category.href;
    };

    return (
        <a
            href={category.href}
            onClick={handleClick}
            className={`group flex flex-col items-center justify-center p-6 text-center rounded-3xl ${category.bgColor} shadow-xl ${category.shadowColor} hover:shadow-2xl hover:shadow-brand-chakra-blue/20 dark:hover:shadow-brand-chakra-blue/30 hover:-translate-y-2 transition-all duration-300 cursor-pointer`}
        >
            <div className="mb-4 text-charcoal dark:text-white">
                {category.icon}
            </div>
            <h3 className="font-bold text-lg text-charcoal dark:text-white whitespace-pre-line">{category.name}</h3>
        </a>
    );
};


const Categories: React.FC = () => {
    return (
        <section className="py-16 bg-gray-50 dark:bg-charcoal-light">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-black text-center mb-10">Endless Possibilities, One App</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 animate-fade-in opacity-0">
                    {categoriesData.map((cat, index) => (
                        <div key={cat.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s`}}>
                             <CategoryCard category={cat} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
