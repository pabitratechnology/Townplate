import React, { useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { SupportIcon, ReceiptIcon, CreditCardIcon } from '../../components/IconComponents';

const HelpSupportPage: React.FC = () => {

    useEffect(() => {
        document.title = "Help & Support - TownPlate";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Get help with your TownPlate orders, payments, or account. Find answers to frequently asked questions and contact our support team.");
        }
    }, []);

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Help & Support' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Help & Support"
                subtitle="We're here to help. Find answers to your questions."
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-12 md:py-16">
                 <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                         <SupportIcon className="w-16 h-16 text-brand-chakra-blue mx-auto mb-4" />
                         <h2 className="text-3xl font-bold mb-2">How can we assist you?</h2>
                         <p className="text-lg text-gray-600 dark:text-gray-300">Select a topic below or contact our support team 24/7.</p>
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="bg-white dark:bg-charcoal-light p-6 rounded-xl shadow-md">
                            <ReceiptIcon className="w-12 h-12 text-brand-chakra-blue mx-auto mb-3" />
                            <h3 className="font-bold text-xl mb-2">My Orders</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Track, modify, or report an issue with an order.</p>
                        </div>
                         <div className="bg-white dark:bg-charcoal-light p-6 rounded-xl shadow-md">
                            <CreditCardIcon className="w-12 h-12 text-brand-chakra-blue mx-auto mb-3" />
                            <h3 className="font-bold text-xl mb-2">Payments</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage payment methods or report a billing issue.</p>
                        </div>
                         <div className="bg-white dark:bg-charcoal-light p-6 rounded-xl shadow-md">
                            <SupportIcon className="w-12 h-12 text-brand-chakra-blue mx-auto mb-3" />
                            <h3 className="font-bold text-xl mb-2">Account</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Update your profile, password, or settings.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpSupportPage;