import React from 'react';
import { BoltIcon, BuildingStorefrontIcon, CubeIcon } from './IconComponents';

const features = [
    {
        icon: <BoltIcon className="h-8 w-8 text-white" />,
        title: "Blazing Fast Delivery",
        description: "Get your orders delivered at lightning speed, right when you need them.",
        bgColor: "bg-brand-chakra-blue"
    },
    {
        icon: <BuildingStorefrontIcon className="h-8 w-8 text-white" />,
        title: "Local Favorites",
        description: "Support your community by ordering from the best local stores and restaurants.",
        bgColor: "bg-brand-saffron"
    },
    {
        icon: <CubeIcon className="h-8 w-8 text-white" />,
        title: "All-In-One App",
        description: "From food and groceries to home services, find everything you need in one place.",
        bgColor: "bg-brand-green"
    }
];

const WhyChooseUs: React.FC = () => {
    return (
        <section className="py-16 bg-white dark:bg-charcoal">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-black text-center mb-10">Why TownPlate?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                         <div key={feature.title} className="bg-gray-50 dark:bg-charcoal-light p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.15}s`}}>
                            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${feature.bgColor} shadow-lg`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;