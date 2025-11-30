
import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { EmailIcon, PasswordIcon, ExclamationCircleIcon } from '../../components/IconComponents';
import { BusinessPartner } from '../../types';
import * as api from '../../services/api';

const BusinessOwnerPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [partners, setPartners] = useState<BusinessPartner[]>([]);
    
    useEffect(() => {
        document.title = "Business Owner Login - TownPlate";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Log in to the TownPlate Business Portal to manage your store, view analytics, and grow your business.");
        }
    }, []);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const fetchedPartners = await api.getBusinessPartners();
                setPartners(fetchedPartners);
            } catch (error) {
                console.error("Failed to fetch business partners", error);
            }
        };
        fetchPartners();
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const partner = partners.find(p => p.email === email);
        
        if (partner && password === 'password123') {
            localStorage.setItem('townplate-current-business-user', JSON.stringify(partner));
            window.location.hash = '#/business/dashboard';
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'For Business' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="For Business Owners"
                subtitle="Manage your store, view analytics, and grow with TownPlate"
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-center mb-6">Business Portal Login</h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="business-email">Email</label>
                            <div className="relative">
                                <EmailIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input id="business-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your.business@example.com" className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="business-password">Password</label>
                            <div className="relative">
                                <PasswordIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input id="business-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-center">Hint: Use password `password123` for any email below.</p>
                        </div>

                        {error && (
                             <div className="flex items-center text-sm text-red-500 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        
                         <button
                            type="submit"
                            className="w-full mt-4 py-3.5 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-md shadow-brand-chakra-blue/20"
                        >
                            Login to Dashboard
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                        Not a partner yet? <a href="#/partner/become" className="font-bold text-brand-chakra-blue hover:underline">Register your business</a>.
                    </p>
                     <div className="mt-6 pt-4 border-t border-gray-200 dark:border-charcoal">
                        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 text-center">Sample Login Emails:</h4>
                        <ul className="text-xs text-center text-gray-500 space-y-1 mt-2">
                           {partners.slice(0, 3).map(p => <li key={p.id}><code>{p.email}</code></li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessOwnerPage;
