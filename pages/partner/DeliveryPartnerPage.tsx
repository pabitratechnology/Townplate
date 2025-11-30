
import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { UserIcon, EmailIcon, CourierIcon, CheckIcon } from '../../components/IconComponents';
import { DeliveryPartner } from '../../types';
import * as api from '../../services/api';

const DeliveryPartnerPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [vehicle, setVehicle] = useState('Motorcycle');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        document.title = "Ride with TownPlate | Delivery Partner Jobs";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Join TownPlate as a delivery partner. Be your own boss, set your own hours, and earn competitive pay delivering food, groceries, and more.");
        }
    }, []);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) {
            alert('Please fill in your name and email.');
            return;
        }
        setIsLoading(true);

        const newPartnerData: Partial<DeliveryPartner> = {
            name,
            email,
            phone,
            vehicleType: vehicle as DeliveryPartner['vehicleType'],
        };

        try {
            const createdPartner = await api.createDeliveryPartner(newPartnerData);
            // Set the current partner for the dashboard session
            localStorage.setItem('townplate-delivery-partner', JSON.stringify(createdPartner));
            // The dashboard will create sample orders if none exist
            localStorage.removeItem('townplate-delivery-orders');
            window.location.hash = '#/partner/dashboard';
        } catch (error) {
            console.error("Sign up failed:", error);
            alert(`Sign up failed: ${error}`);
            setIsLoading(false);
        }
    };
    
    const benefits = [
        "Be your own boss and set your own hours.",
        "Get competitive earnings for every delivery you make.",
        "Keep 100% of your tips from customers.",
        "Explore your city while you earn.",
    ];
    
    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Ride with Us' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Ride with TownPlate"
                subtitle="Be your own boss. Earn flexibly on your own schedule."
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-12 md:py-16">
                 <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Info & Graphic */}
                    <div className="text-center lg:text-left">
                         <div className="inline-block p-6 bg-brand-chakra-blue/10 rounded-full mb-6">
                             <CourierIcon className="h-16 w-16 text-brand-chakra-blue"/>
                         </div>
                        <h2 className="text-4xl font-black mb-4">Earn On Your Schedule</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                           Join our fleet of delivery partners and enjoy the freedom to earn money on your terms.
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
                         <h2 className="text-2xl font-bold text-center mb-6">Become a Delivery Partner</h2>
                        <form onSubmit={handleSignUp} className="space-y-6">
                             <div>
                                <label className="block text-sm font-bold mb-2" htmlFor="rider-name">Full Name</label>
                                 <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input id="rider-name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g., Jane Smith" className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2" htmlFor="rider-email">Email Address</label>
                                 <div className="relative">
                                    <EmailIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input id="rider-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition" />
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-bold mb-2" htmlFor="rider-phone">Phone Number</label>
                                <input id="rider-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition" />
                            </div>
                             <div>
                                <label className="block text-sm font-bold mb-2" htmlFor="vehicle-type">Vehicle Type</label>
                                <select id="vehicle-type" value={vehicle} onChange={e => setVehicle(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent appearance-none focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition">
                                    <option>Motorcycle</option>
                                    <option>Car</option>
                                    <option>Bicycle</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-4 py-3.5 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-md shadow-brand-chakra-blue/20 animate-pulse-light disabled:bg-gray-400 disabled:animate-none"
                            >
                                {isLoading ? 'Signing Up...' : 'Sign Up to Ride'}
                            </button>
                        </form>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                            Already a partner? <a href="#/partner/login" className="font-bold text-brand-chakra-blue hover:underline">Log in to your dashboard</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryPartnerPage;
