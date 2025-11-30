
import React, { useState, useEffect, useRef } from 'react';
import { Address } from '../types';
import * as L from 'leaflet';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: Omit<Address, 'id'> & { id?: string, lat?: number, lng?: number }) => void;
    address: Address | null;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSave, address }) => {
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        country: '',
        postalCode: '',
    });
    const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 20.2961, lng: 85.8245 });
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (address) {
                setFormData({
                    street: address.street,
                    city: address.city,
                    country: address.country,
                    postalCode: address.postalCode,
                });
                if (address.lat && address.lng) {
                    setCoords({ lat: address.lat, lng: address.lng });
                }
            } else {
                // Reset form and try to get user's current location
                setFormData({ street: '', city: '', country: '', postalCode: '' });
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
                    },
                    () => {
                        // Fallback to default if permission denied
                        setCoords({ lat: 20.2961, lng: 85.8245 });
                    }
                );
            }
        }
    }, [isOpen, address]);

    useEffect(() => {
        if (isOpen && mapContainerRef.current) {
            // Initialize map
            if (!mapRef.current) {
                mapRef.current = L.map(mapContainerRef.current).setView(coords, 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(mapRef.current);
                
                markerRef.current = L.marker(coords, { draggable: true }).addTo(mapRef.current);
                
                markerRef.current.on('dragend', (event) => {
                    const newCoords = event.target.getLatLng();
                    setCoords({ lat: newCoords.lat, lng: newCoords.lng });
                });
            } else {
                mapRef.current.setView(coords, 13);
                markerRef.current?.setLatLng(coords);
            }
        }
    }, [isOpen, coords]);


    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: address?.id, ...coords });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl w-full max-w-lg m-4 p-6 relative animate-slide-in max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} aria-label="Close address form" className="absolute top-4 right-4 text-gray-500 hover:text-charcoal dark:hover:text-white transition z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold mb-4">{address ? 'Edit Address' : 'Add New Address'}</h2>
                
                <div id="map" ref={mapContainerRef} className="h-64 w-full rounded-lg mb-4 z-0"></div>

                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-bold mb-1" htmlFor="street">Street Address</label>
                        <input id="street" name="street" type="text" value={formData.street} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1" htmlFor="city">City</label>
                        <input id="city" name="city" type="text" value={formData.city} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-bold mb-1" htmlFor="country">Country</label>
                            <input id="country" name="country" type="text" value={formData.country} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-bold mb-1" htmlFor="postalCode">Postal Code</label>
                            <input id="postalCode" name="postalCode" type="text" value={formData.postalCode} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                        </div>
                    </div>
                    <button type="submit" className="w-full mt-2 py-3 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105">
                        Save Address
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;