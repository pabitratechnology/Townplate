
import React from 'react';

const AppDownload: React.FC = () => {
    return (
        <section className="bg-brand-chakra-blue text-white">
            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
                    <div className="mb-8 md:mb-0">
                        <h2 className="text-4xl font-black mb-2">Get the TownPlate App</h2>
                        <p className="text-lg opacity-85">Experience the future of delivery. Order, track, and enjoy on the go.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a href="#" className="transform hover:scale-105 transition-transform">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" alt="Download on the App Store" className="h-12"/>
                        </a>
                        <a href="#" className="transform hover:scale-105 transition-transform">
                           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" alt="Get it on Google Play" className="h-12"/>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppDownload;