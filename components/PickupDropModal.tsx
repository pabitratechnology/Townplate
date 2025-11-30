import React, 'react';
import { CheckCircleIcon } from './IconComponents';

interface PickupDropModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceName: string;
}

type BookingStep = 'details' | 'confirming' | 'success';

const PickupDropModal: React.FC<PickupDropModalProps> = ({ isOpen, onClose, serviceName }) => {
    const [step, setStep] = React.useState<BookingStep>('details');
    const [pickupAddress, setPickupAddress] = React.useState('');
    const [dropoffAddress, setDropoffAddress] = React.useState('');
    
    React.useEffect(() => {
        if (isOpen) {
            setStep('details');
            setPickupAddress('');
            setDropoffAddress('');
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
                        <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                        <p className="text-gray-600 dark:text-gray-300">A rider will be assigned shortly.</p>
                        <button onClick={onClose} className="w-full mt-6 py-3 font-bold rounded-lg bg-brand-chakra-blue text-white hover:bg-opacity-90 transition">Done</button>
                    </div>
                );
            case 'details':
            default:
                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="pickup">Pickup Address</label>
                            <input id="pickup" type="text" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} required placeholder="Enter full pickup address" className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="dropoff">Drop-off Address</label>
                            <input id="dropoff" type="text" value={dropoffAddress} onChange={e => setDropoffAddress(e.target.value)} required placeholder="Enter full drop-off address" className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                        </div>
                        <button type="submit" className="w-full mt-4 py-3 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105">
                            Confirm Booking
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
                <h2 className="text-2xl font-bold mb-4">Book: {serviceName}</h2>
                {renderContent()}
            </div>
        </div>
    );
};

export default PickupDropModal;