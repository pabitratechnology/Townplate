
import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { UserIcon, EmailIcon, BuildingStorefrontIcon, CheckIcon } from '../../components/IconComponents';
import { BusinessPartner, BusinessType, FeaturedItem } from '../../types';
import * as api from '../../services/api';

const BecomePartnerPage: React.FC = () => {
    const [businessName, setBusinessName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [businessType, setBusinessType] = useState<BusinessType>('Restaurant');
    const [isLoading, setIsLoading] = useState(false);

     useEffect(() => {
        document.title = "Partner with TownPlate | Grow Your Business";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Join TownPlate as a business partner to reach more customers, streamline orders, and grow your brand with our powerful platform.");
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!businessName || !ownerName || !contactEmail) {
            alert("Please fill out all fields.");
            return;
        }

        setIsLoading(true);
        try {
            const newPartnerData = {
                businessName,
                ownerName,
                email: contactEmail,
                businessType,
            };
            const newPartner = await api.createBusinessPartner(newPartnerData);
            
            // Automatically log the new partner in
            localStorage.setItem('townplate-current-business-user', JSON.stringify(newPartner));
            
            // Redirect to their dashboard
            window.location.hash = '#/business/dashboard';
        } catch (error) {
            console.error("Failed to create partner", error);
            alert("There was an error creating your partner account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const benefits = [
        "Reach thousands of new customers in your city.",
        "Streamline your orders with our easy-to-use dashboard.",
        "Leverage our fast and reliable delivery network.",
        "Boost your online presence and grow your brand.",
    ];
    
    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Become a Partner' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Partner with TownPlate"
                subtitle="Join our network and reach more customers than ever before."
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Info & Graphic */}
                    <div className="text-center lg:text-left">
                         <div className="inline-block p-6 bg-brand-chakra-blue/10 rounded-full mb-6">
                             <BuildingStorefrontIcon className="h-16 w-16 text-brand-chakra-blue"/>
                         </div>
                        <h2 className="text-4xl font-black mb-4">Grow Your Business with TownPlate</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Focus on what you do best - creating amazing products. We'll handle the rest, from marketing to delivery.
                        </p>
                        <ul className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full mr-3 mt-1">
                                        <CheckIcon className="w-4 h-4"/>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-200">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold text-center mb-6">Register Your Business</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2" htmlFor="business-name">Business Name</label>
                                <div className="relative">
                                    <BuildingStorefrontIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input id="business-name" type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} required placeholder="e.g., The Pizza Palace" className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2" htmlFor="owner-name">Owner's Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input id="owner-name" type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} required placeholder="e.g., John Doe" className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2" htmlFor="contact-email">Contact Email</label>
                                <div className="relative">
                                    <EmailIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input id="contact-email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required placeholder="contact@yourbusiness.com" className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2" htmlFor="business-type">Type of Business</label>
                                <select id="business-type" value={businessType} onChange={e => setBusinessType(e.target.value as BusinessType)} className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent appearance-none focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition">
                                    <option>Restaurant</option>
                                    <option>Grocery Store</option>
                                    <option>Pharmacy</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-4 py-3.5 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-md shadow-brand-chakra-blue/20 animate-pulse-light disabled:bg-gray-400"
                            >
                                {isLoading ? 'Registering...' : 'Register & Go to Dashboard'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BecomePartnerPage;
