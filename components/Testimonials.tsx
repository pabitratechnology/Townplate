

import React from 'react';
import { Testimonial } from '../types';

const testimonialsData: Testimonial[] = [
    { id: 1, text: "TownPlate is a lifesaver! Super fast delivery and the app is so smooth. I use it for everything from food to my weekly groceries.", author: "Sarah J.", role: "Busy Professional", avatarUrl: "https://picsum.photos/100/100?random=20" },
    { id: 2, text: "The variety of services is incredible. I got my AC repaired and ordered dinner from the same app. Mind-blowing convenience!", author: "Mike R.", role: "Homeowner", avatarUrl: "https://picsum.photos/100/100?random=21" },
    { id: 3, text: "As a restaurant owner, partnering with TownPlate was the best decision. Their vendor panel is easy to use and has boosted my online orders.", author: "Chen W.", role: "Restaurant Owner", avatarUrl: "https://picsum.photos/100/100?random=22" },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <div className="bg-white dark:bg-charcoal-light p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-charcoal-light transform hover:scale-105 transition-transform duration-300">
        <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.text}"</p>
        <div className="flex items-center">
            <img src={testimonial.avatarUrl} alt={testimonial.author} className="w-12 h-12 rounded-full mr-4"/>
            <div>
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-sm text-brand-chakra-blue font-semibold">{testimonial.role}</p>
            </div>
        </div>
    </div>
);

const Testimonials: React.FC = () => {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-black text-center mb-12">What Our Users Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonialsData.map(testimonial => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;