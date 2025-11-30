import React, { useState, useEffect } from 'react';
import { CreditCard } from '../types';
import { CreditCardIcon, UserIcon, CardBrandIcon } from './IconComponents';

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (card: Omit<CreditCard, 'id' | 'isDefault'>) => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [error, setError] = useState('');
    const [cardBrand, setCardBrand] = useState<CreditCard['brand']>('Other');

    useEffect(() => {
        if (!isOpen) {
            // Reset form on close
            setName('');
            setNumber('');
            setExpiry('');
            setCvc('');
            setError('');
            setCardBrand('Other');
        }
    }, [isOpen]);
    
    if (!isOpen) return null;
    
    const getCardBrand = (num: string): CreditCard['brand'] => {
        const cleanedNum = num.replace(/\s/g, '');
        if (/^4/.test(cleanedNum)) return 'Visa';
        if (/^5[1-5]/.test(cleanedNum)) return 'Mastercard';
        if (/^3[47]/.test(cleanedNum)) return 'American Express';
        return 'Other';
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        setNumber(value.replace(/(.{4})/g, '$1 ').trim());
        setCardBrand(getCardBrand(value));
    };

     const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^\d]/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        setExpiry(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (number.replace(/\s/g, '').length < 15) {
            setError('Please enter a valid card number.');
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            setError('Please use MM/YY format for expiry.');
            return;
        }
        if (cvc.length < 3) {
            setError('Please enter a valid CVC.');
            return;
        }
        
        const cardData = {
            brand: cardBrand,
            last4: number.slice(-4),
            expiry: expiry,
        };
        onSave(cardData);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl w-full max-w-md m-4 p-6 relative animate-slide-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} aria-label="Close form" className="absolute top-4 right-4 text-gray-500 hover:text-charcoal dark:hover:text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-4">Add New Card</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-bold mb-1" htmlFor="card-name">Cardholder Name</label>
                        <div className="relative">
                             <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input id="card-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1" htmlFor="card-number">Card Number</label>
                        <div className="relative">
                            <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input id="card-number" type="text" value={number} onChange={handleNumberChange} placeholder="0000 0000 0000 0000" maxLength={19} required className="w-full pl-10 pr-12 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue"/>
                            <CardBrandIcon brand={cardBrand} className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-bold mb-1" htmlFor="card-expiry">Expiry Date</label>
                            <input id="card-expiry" type="text" value={expiry} onChange={handleExpiryChange} placeholder="MM/YY" maxLength={5} required className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue"/>
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-bold mb-1" htmlFor="card-cvc">CVC</label>
                            <input id="card-cvc" type="text" value={cvc} onChange={e => setCvc(e.target.value.replace(/[^\d]/g, ''))} placeholder="123" maxLength={4} required className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue"/>
                        </div>
                    </div>
                    {error && <p className="text-sm text-center text-red-500">{error}</p>}
                    <button type="submit" className="w-full mt-2 py-3 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105">
                        Save Card
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentMethodModal;