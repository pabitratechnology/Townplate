import React from 'react';
import { groceryCategoriesData } from '../data/groceryCategoriesData';

const GroceryCategoryGrid: React.FC = () => {
    return (
        <section className="mb-12 animate-fade-in">
             <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-x-2 gap-y-4">
                {groceryCategoriesData.map((category) => (
                    <a key={category.name} href={category.href} className="group flex flex-col items-center text-center p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-charcoal transition-colors">
                        <div className="w-full aspect-square bg-slate-50 dark:bg-charcoal-light rounded-xl overflow-hidden flex items-center justify-center p-2 shadow-inner-sm">
                            <img src={category.imageUrl} alt={category.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                        </div>
                        <p className="mt-2 text-xs sm:text-sm font-semibold text-charcoal dark:text-gray-300 whitespace-pre-line leading-tight">{category.name}</p>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default GroceryCategoryGrid;
