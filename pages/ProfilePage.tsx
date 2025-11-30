
import React, { useState, useEffect, useRef } from 'react';
import { User, Address } from '../types';
import PageHeader from '../components/PageHeader';
import AddressModal from '../components/AddressModal';
import { ReceiptIcon, LocationIcon, CreditCardIcon, SupportIcon, LogoutIcon, EditIcon, PlusIcon, TrashIcon } from '../components/IconComponents';
import * as L from 'leaflet';

interface ProfilePageProps {
    user: User;
    onLogout: () => void;
    onUpdateUser: (updatedUser: User) => void;
}

const ProfileOption: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    href?: string;
    onClick?: () => void;
}> = ({ icon, title, subtitle, href, onClick }) => {
    const content = (
        <div className="flex items-center space-x-4 p-4">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand-chakra-blue/10 text-brand-chakra-blue rounded-full">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
             <div className="flex-grow text-right">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    );

    const commonClasses = "block bg-white dark:bg-charcoal-light rounded-2xl shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-charcoal transition-all";

    if (href) {
        return (
            <a href={href} onClick={(e) => {e.preventDefault(); window.location.hash=href}} className={commonClasses}>
                {content}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={`w-full text-left ${commonClasses}`}>
            {content}
        </button>
    );
};

const AddressCard: React.FC<{ address: Address; onEdit: () => void; onDelete: () => void; }> = ({ address, onEdit, onDelete }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mapRef.current && address.lat && address.lng) {
            const map = L.map(mapRef.current, {
                center: [address.lat, address.lng],
                zoom: 15,
                dragging: false,
                touchZoom: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                boxZoom: false,
                keyboard: false,
                zoomControl: false,
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            L.marker([address.lat, address.lng]).addTo(map);

            return () => map.remove();
        }
    }, [address]);

    return (
        <div className="p-3 bg-gray-50 dark:bg-charcoal rounded-lg flex items-start justify-between gap-4">
            {address.lat && address.lng && (
                <div ref={mapRef} className="w-24 h-24 rounded-md flex-shrink-0"></div>
            )}
            <div className="flex-grow">
                <p className="font-semibold">{address.street}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{address.city}, {address.country} - {address.postalCode}</p>
            </div>
            <div className="flex flex-col items-center gap-2 flex-shrink-0 ml-2">
                <button onClick={onEdit} className="p-1.5 text-gray-500 hover:text-brand-chakra-blue"><EditIcon className="w-5 h-5"/></button>
                <button onClick={onDelete} className="p-1.5 text-gray-500 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
            </div>
        </div>
    );
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, onUpdateUser }) => {
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    useEffect(() => {
        document.title = `My Profile - ${user.name} - TownPlate`;
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', `Manage your TownPlate profile. View your order history, saved addresses, and payment methods.`);
        }
    }, [user.name]);

    const handleAddAddressClick = () => {
        setEditingAddress(null);
        setIsAddressModalOpen(true);
    };

    const handleEditAddressClick = (address: Address) => {
        setEditingAddress(address);
        setIsAddressModalOpen(true);
    };

    const handleDeleteAddress = (addressId: string) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            const updatedAddresses = user.addresses?.filter(a => a.id !== addressId) || [];
            onUpdateUser({ ...user, addresses: updatedAddresses });
        }
    };

    const handleSaveAddress = (addressToSave: Omit<Address, 'id'> & { id?: string }) => {
        const currentAddresses = user.addresses || [];
        let updatedAddresses: Address[];

        if (addressToSave.id) { // Existing address
            updatedAddresses = currentAddresses.map(a => a.id === addressToSave.id ? { ...a, ...addressToSave } : a);
        } else { // New address
            const newAddress: Address = {
                ...addressToSave,
                id: `addr_${Date.now()}`
            };
            updatedAddresses = [...currentAddresses, newAddress];
        }
        onUpdateUser({ ...user, addresses: updatedAddresses });
        setIsAddressModalOpen(false);
    };

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'My Profile' }
    ];

    return (
        <div className="animate-fade-in bg-gray-50 dark:bg-charcoal-light min-h-screen">
            <PageHeader
                title="My Profile"
                subtitle="Manage your account details and preferences"
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* User Info Card */}
                    <div className="relative p-8 bg-white dark:bg-charcoal-light rounded-2xl shadow-lg flex flex-col sm:flex-row items-center text-center sm:text-left gap-6">
                        <img 
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name.replace(' ','+')}&background=random&size=128`} 
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-charcoal-light shadow-md"
                        />
                        <div className="flex-grow">
                            <h2 className="text-3xl font-bold">{user.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                            {user.phone && <p className="text-gray-500 dark:text-gray-400">{user.phone}</p>}
                        </div>
                        <a 
                            href="#/profile/edit"
                            onClick={(e) => {e.preventDefault(); window.location.hash="#/profile/edit"}} 
                            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-full bg-brand-chakra-blue/10 text-brand-chakra-blue hover:bg-brand-chakra-blue hover:text-white transition"
                        >
                            <EditIcon className="w-4 h-4" />
                            Edit
                        </a>
                    </div>
                    
                    {/* Saved Addresses Section */}
                    <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-md p-6">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Saved Addresses</h3>
                            <button onClick={handleAddAddressClick} className="flex items-center gap-1 text-sm font-bold text-brand-chakra-blue hover:underline">
                                <PlusIcon className="w-4 h-4"/> Add New
                            </button>
                        </div>
                        <div className="space-y-3">
                            {(user.addresses && user.addresses.length > 0) ? user.addresses.map(addr => (
                                <AddressCard 
                                    key={addr.id}
                                    address={addr}
                                    onEdit={() => handleEditAddressClick(addr)}
                                    onDelete={() => handleDeleteAddress(addr.id)}
                                />
                            )) : (
                                <p className="text-center text-gray-500 py-4">No saved addresses yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Navigation Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ProfileOption
                            href="#/orders"
                            icon={<ReceiptIcon className="w-6 h-6" />}
                            title="My Orders"
                            subtitle="View your order history"
                        />
                         <ProfileOption
                            href="#/profile/payments"
                            icon={<CreditCardIcon className="w-6 h-6" />}
                            title="Payment Methods"
                            subtitle="Manage your saved cards"
                        />
                         <ProfileOption
                            href="#/support"
                            icon={<SupportIcon className="w-6 h-6" />}
                            title="Help & Support"
                            subtitle="Get help with your account"
                        />
                         <ProfileOption
                            onClick={onLogout}
                            icon={<LogoutIcon className="w-6 h-6" />}
                            title="Logout"
                            subtitle="Sign out of your account"
                        />
                    </div>
                </div>
            </div>
             {isAddressModalOpen && (
                <AddressModal 
                    isOpen={isAddressModalOpen}
                    onClose={() => setIsAddressModalOpen(false)}
                    onSave={handleSaveAddress}
                    address={editingAddress}
                />
            )}
        </div>
    );
};

export default ProfilePage;