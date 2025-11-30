import React from 'react';
import { CartItem } from '../types';
import { TrashIcon, PlusIcon, MinusIcon } from './IconComponents';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currencySymbol: string;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, currencySymbol, onRemoveItem, onUpdateQuantity, onCheckout }) => {
  if (!isOpen) {
    return null;
  }

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleStartShopping = () => {
    onClose();
    window.location.hash = '#/';
  };

  return (
    <div 
      className="fixed inset-0 z-[60] animate-fade-in-backdrop"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-charcoal shadow-2xl flex flex-col animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-charcoal-light">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-charcoal-light transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
             <p className="text-lg text-gray-500 dark:text-gray-400">Your cart is empty.</p>
             <button
                onClick={handleStartShopping}
                className="mt-4 px-6 py-2.5 text-sm font-bold rounded-full bg-brand-saffron text-white hover:bg-opacity-90 transition-transform transform hover:scale-105"
             >
                Start Shopping
             </button>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4">
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-start space-x-4">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.variantName}</p>
                    {item.customizations && item.customizations.length > 0 && (
                        <ul className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-4 list-disc">
                            {item.customizations.map(cust => (
                                <li key={cust.optionName}>{cust.optionName}</li>
                            ))}
                        </ul>
                    )}
                    <p className="text-sm text-brand-saffron font-semibold mt-1">{currencySymbol}{item.price.toFixed(2)}</p>
                  </div>
                   <div className="flex flex-col items-end">
                     <div className="flex items-center">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-200 dark:bg-charcoal-light hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                            <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-bold">{item.quantity}</span>
                         <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-200 dark:bg-charcoal-light hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    </div>
                     <button onClick={() => onRemoveItem(item.id)} aria-label={`Remove ${item.name}`} className="text-gray-500 hover:text-red-500 transition mt-4">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {items.length > 0 && (
          <footer className="p-4 border-t border-gray-200 dark:border-charcoal-light space-y-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Subtotal</span>
              <span>{currencySymbol}{subtotal.toFixed(2)}</span>
            </div>
            <button 
                onClick={onCheckout}
                className="w-full py-3.5 text-lg font-bold rounded-full bg-brand-saffron text-white hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-md shadow-brand-saffron/20"
            >
              Checkout
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;