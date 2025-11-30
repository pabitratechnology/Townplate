import React, { useState, useEffect } from 'react';
import { CreditCardIcon, CheckCircleIcon, UpiIcon, WalletIcon, CashIcon } from './IconComponents';
import { User } from '../types';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentSuccess: () => void;
    totalAmount: number;
    currencySymbol: string;
    currentUser: User | null;
}

type PaymentStep = 'form' | 'processing' | 'success';
type PaymentMethod = 'card' | 'cod' | 'upi' | 'wallet';

const Spinner: React.FC = () => (
    <div className="w-16 h-16 border-4 border-brand-chakra-blue border-t-transparent rounded-full animate-spin"></div>
);

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess, totalAmount, currencySymbol, currentUser }) => {
    const [step, setStep] = useState<PaymentStep>('form');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvc: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep('form');
                setPaymentMethod('card');
                setCardDetails({ name: '', number: '', expiry: '', cvc: '' });
                setError('');
            }, 300);
        }
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const validateCardForm = () => {
        if (!cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
            setError('All card fields are required.');
            return false;
        }
        if (cardDetails.number.replace(/\s/g, '').length !== 16) {
            setError('Please enter a valid 16-digit card number.');
            return false;
        }
        setError('');
        return true;
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (paymentMethod === 'card') {
            if (validateCardForm()) {
                setStep('processing');
                setTimeout(() => {
                    onPaymentSuccess();
                    setStep('success');
                }, 2500);
            }
        } else {
            // Handle COD, UPI, and Wallet with a simulated success
            setStep('processing');
            setTimeout(() => {
                onPaymentSuccess();
                setStep('success');
            }, 1500);
        }
    };
    
    if (!isOpen) return null;

    let deliveryFee = 0;
    switch (currencySymbol) {
        case '₹':
            deliveryFee = totalAmount > 300 ? totalAmount * 0.05 : 40;
            break;
        case '£':
            deliveryFee = totalAmount > 15 ? totalAmount * 0.05 : 2.5;
            break;
        case '¥':
            deliveryFee = totalAmount > 2000 ? totalAmount * 0.05 : 300;
            break;
        case '$':
        default:
            deliveryFee = totalAmount > 20 ? totalAmount * 0.05 : 3;
            break;
    }

    const taxes = totalAmount * 0.1;
    const finalTotal = totalAmount + deliveryFee + taxes;

    const renderPaymentContent = () => {
        switch (paymentMethod) {
            case 'card':
                return (
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="name">Cardholder Name</label>
                            <input id="name" name="name" type="text" value={cardDetails.name} onChange={handleInputChange} placeholder="John Doe" className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="number">Card Number</label>
                            <div className="relative">
                                <CreditCardIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input id="number" name="number" type="text" value={cardDetails.number} onChange={handleInputChange} placeholder="0000 0000 0000 0000" maxLength={19} className="w-full pl-12 pr-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-bold mb-1" htmlFor="expiry">Expiry</label>
                                <input id="expiry" name="expiry" type="text" value={cardDetails.expiry} onChange={handleInputChange} placeholder="MM/YY" maxLength={5} className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-bold mb-1" htmlFor="cvc">CVC</label>
                                <input id="cvc" name="cvc" type="text" value={cardDetails.cvc} onChange={handleInputChange} placeholder="123" maxLength={3} className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                            </div>
                        </div>
                    </div>
                );
            case 'cod':
                 return <div className="text-center p-4 bg-gray-100 dark:bg-charcoal rounded-lg animate-fade-in"><p className="text-sm">You'll pay with cash upon delivery. Please have the exact amount ready.</p></div>;
            case 'upi':
                return (
                    <div className="text-center p-4 bg-gray-100 dark:bg-charcoal rounded-lg animate-fade-in space-y-2">
                        <p className="text-sm font-semibold">Scan QR or use the UPI ID in your payment app.</p>
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=townplate@okhdfcbank" alt="Sample QR Code" className="w-32 h-32 mx-auto my-2 rounded-lg" />
                        <p className="font-bold text-lg bg-white dark:bg-charcoal-dark py-2 rounded-md">townplate@okhdfcbank</p>
                        <p className="text-xs text-gray-500">(This is for demonstration. Clicking 'Confirm' will complete the order.)</p>
                    </div>
                );
            case 'wallet':
                return (
                     <div className="text-center p-4 bg-gray-100 dark:bg-charcoal rounded-lg animate-fade-in">
                        <p className="text-sm">You will be redirected to your wallet provider to complete the payment.</p>
                        <p className="text-xs text-gray-500 mt-2">(This is a mock step. Clicking "Pay" will complete the order.)</p>
                    </div>
                );
            default:
                return null;
        }
    };
    
    const PaymentOption: React.FC<{ method: PaymentMethod; icon: React.ReactNode; label: string; }> = ({ method, icon, label }) => (
        <button
            type="button"
            onClick={() => setPaymentMethod(method)}
            className={`flex-1 p-3 rounded-lg flex flex-col items-center justify-center transition-all border-2 ${paymentMethod === method ? 'border-brand-chakra-blue bg-brand-chakra-blue/10' : 'border-transparent bg-gray-100 dark:bg-charcoal hover:bg-gray-200 dark:hover:bg-charcoal-dark'}`}
        >
            {icon}
            <span className="text-xs font-bold mt-1.5">{label}</span>
        </button>
    );

    const defaultAddress = currentUser?.addresses?.find(a => a.isDefault) || currentUser?.addresses?.[0];
    const addressString = defaultAddress 
        ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.country} - ${defaultAddress.postalCode}`
        : 'No address specified';

    const getButtonText = () => {
        switch (paymentMethod) {
            case 'cod':
                return 'Place Order';
            case 'upi':
                return 'Confirm & Place Order';
            case 'wallet':
                return `Pay with Wallet`;
            case 'card':
            default:
                return `Pay ${currencySymbol}${finalTotal.toFixed(2)}`;
        }
    };


    const renderContent = () => {
        switch (step) {
            case 'processing':
                return (
                    <div className="flex flex-col items-center justify-center text-center h-96">
                        <Spinner />
                        <p className="mt-4 text-lg font-bold">Placing your order...</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Please do not close this window.</p>
                    </div>
                );
            case 'success':
                return (
                     <div className="flex flex-col items-center justify-center text-center h-96">
                        <CheckCircleIcon className="w-20 h-20 text-green-500" />
                        <h2 className="mt-4 text-2xl font-bold">Order Placed Successfully!</h2>
                        <p className="text-gray-600 dark:text-gray-300">You will be redirected to your orders page.</p>
                    </div>
                );
            case 'form':
            default:
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-center">Confirm Your Order</h2>

                        <div className="bg-gray-50 dark:bg-charcoal rounded-lg p-3 mb-4">
                            <h3 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Delivering To</h3>
                            <div className="flex items-start">
                                <div className="w-24 h-16 rounded-md bg-gray-300 dark:bg-charcoal-dark mr-3 flex items-center justify-center">
                                    <img src="https://www.google.com/maps/d/thumbnail?mid=1_EyllR3d3zn09249-s27u-x2dGY&hl=en" alt="Map preview" className="w-full h-full object-cover rounded-md opacity-70" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm leading-tight">{addressString}</p>
                                </div>
                                <button onClick={() => alert("Address management is available in your profile page.")} className="text-xs font-bold text-brand-chakra-blue hover:underline ml-2">Change</button>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-charcoal rounded-lg p-3 mb-4 space-y-1.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                                <span>{currencySymbol}{totalAmount.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300">Delivery Fee</span>
                                <span>{currencySymbol}{deliveryFee.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300">Taxes & Charges</span>
                                <span>{currencySymbol}{taxes.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-300 dark:border-charcoal-light my-1 !mt-2 !mb-1"></div>
                             <div className="flex justify-between font-bold text-lg">
                                <span>To Pay</span>
                                <span>{currencySymbol}{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div>
                                <h3 className="text-sm font-bold mb-2">Choose Payment Method</h3>
                                <div className="flex gap-2">
                                    <PaymentOption method="card" label="Card" icon={<CreditCardIcon className="w-6 h-6"/>} />
                                    <PaymentOption method="cod" label="Cash" icon={<CashIcon className="w-6 h-6"/>} />
                                    <PaymentOption method="upi" label="UPI" icon={<UpiIcon className="w-6 h-6"/>} />
                                    <PaymentOption method="wallet" label="Wallets" icon={<WalletIcon className="w-6 h-6"/>} />
                                </div>
                            </div>
                            
                            <div className="min-h-[220px]">
                                {renderPaymentContent()}
                            </div>

                            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                            
                            <button 
                                type="submit"
                                className="w-full mt-2 py-3.5 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-md shadow-brand-chakra-blue/20 disabled:bg-gray-400 disabled:scale-100 disabled:shadow-none"
                            >
                                {getButtonText()}
                            </button>
                        </form>
                    </>
                );
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl w-full max-w-md m-4 p-6 relative animate-slide-in max-h-[95vh] overflow-y-auto scrollbar-hide"
                onClick={(e) => e.stopPropagation()}
            >
                {step === 'form' && (
                    <button onClick={onClose} aria-label="Close payment" className="absolute top-4 right-4 text-gray-500 hover:text-charcoal dark:hover:text-white transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
                {renderContent()}
            </div>
        </div>
    );
};

export default PaymentModal;