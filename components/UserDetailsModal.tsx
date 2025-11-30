import React from 'react';
import { User } from '../types';
import { LocationIcon, CreditCardIcon } from './IconComponents';

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl w-full max-w-lg m-4 p-6 relative animate-slide-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} aria-label="Close user details" className="absolute top-4 right-4 text-gray-500 hover:text-charcoal dark:hover:text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <div className="flex items-center space-x-4 mb-6">
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name.replace(' ','+')}&background=random`} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                    <div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                        <span className={`mt-2 inline-block px-2 py-1 text-xs font-bold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                            {user.status}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm uppercase">User Information</h3>
                        <div className="mt-2 bg-gray-50 dark:bg-charcoal p-3 rounded-lg text-sm space-y-2">
                           <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
                           <p><strong>Registered:</strong> {new Date(user.registeredDate).toLocaleString()}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm uppercase flex items-center gap-2"><LocationIcon className="w-4 h-4" /> Addresses ({user.addresses?.length || 0})</h3>
                         <div className="mt-2 space-y-2">
                            {user.addresses && user.addresses.length > 0 ? user.addresses.map(addr => (
                                <div key={addr.id} className="p-3 bg-gray-50 dark:bg-charcoal rounded-lg text-sm">
                                    <p className="font-semibold">{addr.street}</p>
                                    <p>{`${addr.city}, ${addr.country} - ${addr.postalCode}`}</p>
                                    {addr.isDefault && <span className="text-xs font-bold text-green-600">Default</span>}
                                </div>
                            )) : <p className="text-sm text-gray-500 p-3 bg-gray-50 dark:bg-charcoal rounded-lg">No addresses saved.</p>}
                        </div>
                    </div>
                    
                     <div>
                        <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm uppercase flex items-center gap-2"><CreditCardIcon className="w-4 h-4" /> Payment Methods ({user.paymentMethods?.length || 0})</h3>
                        <div className="mt-2 space-y-2">
                           {user.paymentMethods && user.paymentMethods.length > 0 ? user.paymentMethods.map(card => (
                                <div key={card.id} className="p-3 bg-gray-50 dark:bg-charcoal rounded-lg text-sm">
                                    <p className="font-semibold">{card.brand} ending in {card.last4}</p>
                                    <p>Expires: {card.expiry}</p>
                                    {card.isDefault && <span className="text-xs font-bold text-green-600">Default</span>}
                                </div>
                            )) : <p className="text-sm text-gray-500 p-3 bg-gray-50 dark:bg-charcoal rounded-lg">No payment methods saved.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;
