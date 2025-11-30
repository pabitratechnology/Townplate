import React, { useState, useEffect } from 'react';
import { User, CreditCard } from '../types';
import PageHeader from '../components/PageHeader';
import PaymentMethodModal from '../components/PaymentMethodModal';
import { PlusIcon, TrashIcon, CheckCircleIcon, CardBrandIcon, CreditCardIcon } from '../components/IconComponents';

interface PaymentMethodsPageProps {
    user: User;
    onUpdateUser: (updatedUser: User) => void;
}

const PaymentMethodsPage: React.FC<PaymentMethodsPageProps> = ({ user, onUpdateUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        document.title = "Manage Payment Methods - TownPlate";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Securely add, remove, and manage your credit and debit cards for a faster checkout experience on TownPlate.");
        }
    }, []);

    const handleSaveCard = (cardData: Omit<CreditCard, 'id' | 'isDefault'>) => {
        const currentCards = user.paymentMethods || [];
        const newCard: CreditCard = {
            ...cardData,
            id: `card_${Date.now()}`,
            isDefault: currentCards.length === 0, // Make first card default
        };
        onUpdateUser({ ...user, paymentMethods: [...currentCards, newCard] });
        setIsModalOpen(false);
    };

    const handleRemoveCard = (cardId: string) => {
        if (window.confirm('Are you sure you want to remove this card?')) {
            const updatedCards = user.paymentMethods?.filter(c => c.id !== cardId) || [];
            
            const wasDefault = user.paymentMethods?.find(c => c.id === cardId)?.isDefault;

            // If deleting the default card, make another one default if possible
            if (wasDefault && updatedCards.length > 0) {
                updatedCards[0].isDefault = true;
            }
            onUpdateUser({ ...user, paymentMethods: updatedCards });
        }
    };

    const handleSetDefault = (cardId: string) => {
        const updatedCards = user.paymentMethods?.map(c => ({
            ...c,
            isDefault: c.id === cardId,
        })) || [];
        onUpdateUser({ ...user, paymentMethods: updatedCards });
    };

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'My Profile', href: '#/profile' },
        { label: 'Payment Methods' }
    ];

    return (
        <div className="animate-fade-in bg-gray-50 dark:bg-charcoal-light min-h-screen">
            <PageHeader
                title="Payment Methods"
                subtitle="Manage your saved cards for faster checkout"
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Your Saved Cards</h2>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition">
                            <PlusIcon className="w-4 h-4" /> Add Card
                        </button>
                    </div>

                    <div className="space-y-4">
                        {(user.paymentMethods && user.paymentMethods.length > 0) ? user.paymentMethods.map(card => (
                            <div key={card.id} className="bg-white dark:bg-charcoal-light p-4 rounded-xl shadow-md flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <CardBrandIcon brand={card.brand} className="w-10 h-10 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold">{card.brand} ending in {card.last4}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Expires {card.expiry}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {card.isDefault ? (
                                        <span className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400"><CheckCircleIcon className="w-5 h-5"/> Default</span>
                                    ) : (
                                        <button onClick={() => handleSetDefault(card.id)} className="text-sm font-semibold text-brand-chakra-blue hover:underline">Set Default</button>
                                    )}
                                    <button onClick={() => handleRemoveCard(card.id)} className="p-2 text-gray-500 hover:text-red-500 transition"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 bg-white dark:bg-charcoal-light rounded-xl shadow-md border-2 border-dashed border-gray-300 dark:border-charcoal">
                                <CreditCardIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="font-bold text-lg">No Saved Cards</h3>
                                <p className="text-gray-500 dark:text-gray-400">Add a card for a faster checkout next time.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PaymentMethodModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCard}
            />
        </div>
    );
};

export default PaymentMethodsPage;