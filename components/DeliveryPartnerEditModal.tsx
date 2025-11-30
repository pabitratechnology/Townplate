import React, { useState, useEffect } from 'react';
import { DeliveryPartner } from '../types';

interface DeliveryPartnerEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (partner: Partial<DeliveryPartner>) => void;
    partnerToEdit: DeliveryPartner | null;
}

const DeliveryPartnerEditModal: React.FC<DeliveryPartnerEditModalProps> = ({ isOpen, onClose, onSave, partnerToEdit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [vehicleType, setVehicleType] = useState<DeliveryPartner['vehicleType']>('Motorcycle');
    const isEditMode = !!partnerToEdit;

    useEffect(() => {
        if (isOpen) {
            setName(partnerToEdit?.name || '');
            setEmail(partnerToEdit?.email || '');
            setPhone(partnerToEdit?.phone || '');
            setVehicleType(partnerToEdit?.vehicleType || 'Motorcycle');
        }
    }, [isOpen, partnerToEdit]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, email, phone, vehicleType });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl w-full max-w-md m-4 p-6" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Delivery Partner' : 'Create Delivery Partner'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1" htmlFor="dp-name">Full Name</label>
                        <input id="dp-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1" htmlFor="dp-email">Email Address</label>
                        <input id="dp-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isEditMode} className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border disabled:opacity-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1" htmlFor="dp-phone">Phone Number</label>
                        <input id="dp-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1" htmlFor="dp-vehicle">Vehicle Type</label>
                        <select id="dp-vehicle" value={vehicleType} onChange={e => setVehicleType(e.target.value as DeliveryPartner['vehicleType'])} className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border appearance-none focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue">
                            <option>Motorcycle</option>
                            <option>Bicycle</option>
                            <option>Car</option>
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

export default DeliveryPartnerEditModal;