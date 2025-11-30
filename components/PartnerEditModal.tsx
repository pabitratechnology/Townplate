import React, { useState, useEffect } from 'react';
import { BusinessPartner, BusinessType } from '../types';

interface PartnerEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (partner: Partial<BusinessPartner>) => void;
    partnerToEdit: BusinessPartner | null;
}

const PartnerEditModal: React.FC<PartnerEditModalProps> = ({ isOpen, onClose, onSave, partnerToEdit }) => {
    const [businessName, setBusinessName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [email, setEmail] = useState('');
    const [businessType, setBusinessType] = useState<BusinessType>('Restaurant');
    const isEditMode = !!partnerToEdit;

    useEffect(() => {
        if (isOpen) {
            setBusinessName(partnerToEdit?.businessName || '');
            setOwnerName(partnerToEdit?.ownerName || '');
            setEmail(partnerToEdit?.email || '');
            setBusinessType(partnerToEdit?.businessType || 'Restaurant');
        }
    }, [isOpen, partnerToEdit]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ businessName, ownerName, email, businessType });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl w-full max-w-md m-4 p-6" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Partner' : 'Create New Partner'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1" htmlFor="businessName">Business Name</label>
                        <input id="businessName" type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1" htmlFor="ownerName">Owner's Name</label>
                        <input id="ownerName" type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                    </div>
                     <div>
                        <label className="block text-sm font-bold mb-1" htmlFor="partner-email">Email Address</label>
                        <input id="partner-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isEditMode} className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border disabled:opacity-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1" htmlFor="businessType">Business Type</label>
                        <select id="businessType" value={businessType} onChange={e => setBusinessType(e.target.value as BusinessType)} className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border appearance-none focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue">
                            <option>Restaurant</option>
                            <option>Grocery Store</option>
                            <option>Pharmacy</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 font-bold rounded-lg bg-gray-200 dark:bg-charcoal hover:bg-gray-300 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2 font-bold rounded-lg bg-brand-chakra-blue text-white hover:bg-opacity-90 transition">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PartnerEditModal;