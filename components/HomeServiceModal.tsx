
import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from './IconComponents';

interface HomeServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceName: string;
}

type BookingStep = 'details' | 'confirming' | 'success';

const HomeServiceModal: React.FC<HomeServiceModalProps> = ({ isOpen, onClose, serviceName }) => {
    const [step, setStep] = useState<BookingStep>('details');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStep('details');
            setName('');
            setPhone('');
            setDate('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('confirming');
        setTimeout(() => {
            setStep('success');
        }, 2000);
    };
    
    const today = new Date().toISOString().split("T")[0];

    const renderContent = () => {
        switch (step) {
            case 'confirming':
                return (
                    <div className="text-center py-10">
                        <div className="w-12 h-12 border-4 border-brand-chakra-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 font-semibold">Confirming your booking...</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center py-10">
                        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold">Service Booked!</h2>
                        <p className="text-gray-600 dark:text-gray-300">A professional will contact you shortly to confirm the details.</p>
                        <button onClick={onClose} className="w-full mt-6 py-3 font-bold rounded-lg bg-brand-chakra-blue text-white hover:bg-opacity-90 transition">Done</button>
                    </div>
                );
            case 'details':
            default:
                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="service-name">Full Name</label>
                            <input id="service-name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Enter your full name" className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                        </div>
                         <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="service-phone">Phone Number</label>
                            <input id="service-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="Enter your contact number" className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="service-date">Preferred Date</label>
                            <input id="service-date" type="date" value={date} min={today} onChange={e => setDate(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                        </div>
                        <button type="submit" className="w-full mt-4 py-3 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105">
                            Book Service
                        </button>
                    </form>
                );
        }
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
                <button onClick={onClose} aria-label="Close booking form" className="absolute top-4 right-4 text-gray-500 hover:text-charcoal dark:hover:text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold mb-4">Book Service: {serviceName}</h2>
                {renderContent()}
            </div>
        </div>
    );
};

export default HomeServiceModal;