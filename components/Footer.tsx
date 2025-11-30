import React from 'react';
import { LogoIcon, PaperAirplaneIcon, FacebookIcon, XIcon, InstagramIcon, LinkedInIcon, BuildingStorefrontIcon, UserIcon, CourierIcon, ShieldCheckIcon } from './IconComponents';

const Footer: React.FC = () => {

    const sections = {
        "Company": [
            { label: "About Us", href: "#/about" },
            { label: "Team", href: "#/team" },
            { label: "Careers", href: "#/careers" },
            { label: "Blog", href: "#/blog" },
            { label: "Foodie Quiz", href: "#/quiz" },
            { label: "Make It Yourself", href: "#/make-this" },
        ],
        "For Partners": [
            { label: "Partner with Us", href: "#/partner/become", icon: <BuildingStorefrontIcon className="h-5 w-5" /> },
            { label: "Business Login", href: "#/business/owners", icon: <UserIcon className="h-5 w-5" /> },
            { label: "Ride with Us", href: "#/partner/delivery", icon: <CourierIcon className="h-5 w-5" /> },
            { label: "Rider Login", href: "#/partner/login", icon: <UserIcon className="h-5 w-5" /> },
            { label: "Admin Portal", href: "#/admin/login", icon: <ShieldCheckIcon className="h-5 w-5" /> },
        ],
        "Legal & Support": [
            { label: "Help & Support", href: "#/support" },
            { label: "Terms & Conditions", href: "#/terms" },
            { label: "Cookie Policy", href: "#/cookies" },
            { label: "Privacy Policy", href: "#/privacy" },
        ],
    };

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        window.location.hash = href;
    };
    
    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you for subscribing to our newsletter!");
    };


    return (
        <footer className="bg-charcoal-dark text-gray-400">
            <div className="container mx-auto px-4 pt-16 pb-8">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Links */}
                    {Object.entries(sections).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="font-bold text-white mb-4 text-lg">{title}</h3>
                            {title === 'For Partners' ? (
                                <ul className="space-y-2">
                                    {links.map(link => (
                                        <li key={link.label}>
                                            <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="flex items-center gap-3 p-3 rounded-lg bg-charcoal hover:bg-charcoal-light hover:text-brand-chakra-blue transition duration-300 group">
                                                {link.icon && <span className="text-gray-500 group-hover:text-brand-chakra-blue transition-colors">{link.icon}</span>}
                                                <span className="font-semibold">{link.label}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className="space-y-3">
                                    {links.map(link => (
                                        <li key={link.label}>
                                            <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="flex items-center gap-3 hover:text-brand-chakra-blue transition duration-300">
                                                {link.icon && <span className="text-gray-500">{link.icon}</span>}
                                                <span>{link.label}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold text-white mb-4 text-lg">Join Our Newsletter</h3>
                        <p className="mb-4 text-sm">Get the latest updates on new products and upcoming offers.</p>
                        <form onSubmit={handleNewsletterSubmit}>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    placeholder="Your email address"
                                    required
                                    className="w-full pl-4 pr-12 py-3 rounded-lg bg-charcoal-light border border-charcoal focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue text-white placeholder-gray-500"
                                />
                                <button type="submit" aria-label="Subscribe to newsletter" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-80 transition">
                                    <PaperAirplaneIcon className="h-5 w-5"/>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Middle Section: App Downloads */}
                 <div className="text-center mb-12">
                    <h3 className="font-bold text-white mb-4 text-lg">Download The App</h3>
                     <div className="flex items-center justify-center space-x-4">
                        <a href="#" className="transform hover:scale-105 transition-transform">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" alt="Download on the App Store" className="h-12"/>
                        </a>
                        <a href="#" className="transform hover:scale-105 transition-transform">
                           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" alt="Get it on Google Play" className="h-12"/>
                        </a>
                    </div>
                </div>


                {/* Bottom Section */}
                <div className="border-t border-charcoal-light pt-8 flex flex-col sm:flex-row justify-between items-center text-center">
                    <div className="mb-4 sm:mb-0">
                        <LogoIcon className="h-8 text-white mb-2 mx-auto sm:mx-0" />
                        <p className="text-sm">&copy; {new Date().getFullYear()} TownPlate, a Pabitra Technology Company. All Rights Reserved.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-charcoal-light hover:bg-brand-chakra-blue text-white transition"><FacebookIcon className="h-5 w-5" /></a>
                        <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-charcoal-light hover:bg-brand-chakra-blue text-white transition"><XIcon className="h-5 w-5" /></a>
                        <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-charcoal-light hover:bg-brand-chakra-blue text-white transition"><InstagramIcon className="h-5 w-5" /></a>
                        <a href="#" aria-label="LinkedIn" className="p-2 rounded-full bg-charcoal-light hover:bg-brand-chakra-blue text-white transition"><LinkedInIcon className="h-5 w-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;