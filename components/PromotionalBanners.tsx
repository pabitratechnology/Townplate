
import React, { useState, useEffect } from 'react';

const banners = [
    { id: 1, title: "50% OFF First Food Order", subtitle: "Use Code: NEWPLATE", bgImage: "bg-gradient-3" },
    { id: 2, title: "Groceries in a Flash", subtitle: "Free Delivery on Orders Above ₹500", bgImage: "bg-gradient-2" },
    { id: 3, title: "Your Health, Delivered", subtitle: "24/7 Pharmacy at Your Fingertips", bgImage: "bg-gradient-1" },
];

const PromotionalBanners: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <div className={`absolute inset-0 ${banner.bgImage} bg-cover`}></div>
                            <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                            <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-12 text-white">
                                <h2 className="text-3xl md:text-4xl font-black mb-2 drop-shadow-lg">{banner.title}</h2>
                                <p className="text-lg md:text-xl drop-shadow-md">{banner.subtitle}</p>
                            </div>
                        </div>
                    ))}
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                aria-label={`Go to slide ${index + 1}`}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-white/50'} transition-all`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromotionalBanners;