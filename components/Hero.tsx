

import React, { useState } from 'react';
import { SearchIcon } from './IconComponents';
import { Location } from '../types';

interface HeroProps {
    location: Location;
    onSearch: (term: string) => void;
}

const Hero: React.FC<HeroProps> = ({ location, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    return (
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 z-0"
                poster="https://picsum.photos/1920/1080?blur=5&random=99"
            >
                 {/* Video by Taryn Elliott from Pexels */}
                <source src="https://videos.pexels.com/video-files/853870/853870-hd_1920_1080_25fps.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-charcoal/60"></div>
            <div className="container mx-auto px-4 relative z-10">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 animate-fade-in-up opacity-0 drop-shadow-lg">
                    Everything You Need, <span className="text-brand-saffron">Instantly.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
                    Your city's finest restaurants, groceries, and services, delivered at the speed of now.
                </p>
                <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s' }}>
                    <div className="relative flex items-center shadow-2xl rounded-full">
                        <input
                            type="text"
                            placeholder="Find anything in seconds..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-lg pl-6 pr-40 py-4 rounded-full border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-brand-chakra-blue/50 bg-white/90 dark:bg-charcoal/80 text-charcoal dark:text-white transition-all duration-300 placeholder:text-gray-500"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center px-8 py-3 bg-brand-chakra-blue text-white rounded-full font-bold hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg shadow-brand-chakra-blue/30 animate-pulse-light">
                            <SearchIcon className="h-5 w-5 mr-2" />
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Hero;