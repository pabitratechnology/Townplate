

import React, { useState, useEffect, useMemo } from 'react';
import { BusinessPartner, Order, FeaturedItem, OrderStatus } from '../../types';
import * as api from '../../services/api';
import { LogoutIcon, PlusIcon, PencilIcon, TrashIcon, DotsVerticalIcon, PhotographIcon, ChartBarIcon, ReceiptIcon } from '../../components/IconComponents';
import NotificationToast from '../../components/NotificationToast';

// A simple modal component defined within the file to avoid creating new files.
const MenuEditModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Partial<FeaturedItem>, imageFile: File | null) => void;
    itemToEdit: FeaturedItem | null;
}> = ({ isOpen, onClose, onSave, itemToEdit }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setName(itemToEdit?.name || '');
            setPrice(itemToEdit?.price?.toString() || '');
            setCategory(itemToEdit?.category || '');
            setDescription(itemToEdit?.description || '');
            setPreviewUrl(itemToEdit?.imageUrl || null);
            setImageFile(null); // Reset file input
        }
    }, [isOpen, itemToEdit]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: itemToEdit?.id, name, price: parseFloat(price) || 0, category, description }, imageFile);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl w-full max-w-lg m-4 p-6" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">{itemToEdit ? 'Edit Menu Item' : 'Add New Item'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="md:col-span-1">
                            <label className="block text-sm font-bold mb-1">Image</label>
                            <div className="w-full aspect-square bg-gray-100 dark:bg-charcoal rounded-lg flex items-center justify-center overflow-hidden relative group">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover"/>
                                ) : (
                                    <PhotographIcon className="w-12 h-12 text-gray-400"/>
                                )}
                                <label htmlFor="image-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    Change
                                </label>
                                <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1" htmlFor="item-name">Item Name</label>
                                <input id="item-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-bold mb-1" htmlFor="item-price">Price</label>
                                    <input id="item-price" type="number" value={price} onChange={e => setPrice(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-bold mb-1" htmlFor="item-category">Category</label>
                                    <input id="item-category" type="text" value={category} onChange={e => setCategory(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1" htmlFor="item-description">Description</label>
                        <textarea id="item-description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 font-bold rounded-lg bg-gray-200 dark:bg-charcoal hover:bg-gray-300 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2 font-bold rounded-lg bg-brand-chakra-blue text-white hover:bg-opacity-90 transition">Save Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BusinessDashboardPage: React.FC = () => {
    const [partner, setPartner] = useState<BusinessPartner | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [menu, setMenu] = useState<FeaturedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('analytics');
    
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [editingMenuItem, setEditingMenuItem] = useState<FeaturedItem | null>(null);
    
    const [notification, setNotification] = useState<{ id: number, message: string } | null>(null);

    useEffect(() => {
        const storedPartner = localStorage.getItem('townplate-current-business-user');
        if (storedPartner) {
            const partnerData: BusinessPartner = JSON.parse(storedPartner);
            setPartner(partnerData);
            fetchData(partnerData.id);
        } else {
            window.location.hash = '#/business/owners';
        }
        
        // Listen for new order notifications
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'new_order_for_business' && event.newValue) {
                const newOrderNotification = JSON.parse(event.newValue);
                const currentPartner = JSON.parse(localStorage.getItem('townplate-current-business-user') || '{}');
                
                if (newOrderNotification.restaurantId === currentPartner.id) {
                    // This order is for me!
                    setNotification({ id: newOrderNotification.orderId, message: `New order #${newOrderNotification.orderId} received!` });
                    new Audio("https://cdn.jsdelivr.net/gh/k-f-s/TownPlate-App/src/assets/notification.mp3").play(); // Play sound
                    fetchData(currentPartner.id); // Refresh data
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);

    }, []);

    const fetchData = async (partnerId: number) => {
        setIsLoading(true);
        try {
            const [ordersData, menuData] = await Promise.all([
                api.getOrdersForBusiness(partnerId),
                api.getMenuForRestaurant(partnerId)
            ]);
            setOrders(ordersData);
            setMenu(Array.isArray(menuData) ? menuData : []);
        } catch (error) {
            console.error("Failed to load business data:", error);
        }
        setIsLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('townplate-current-business-user');
        window.location.hash = '#/business/owners';
    };

    const handleOpenMenuModal = (item: FeaturedItem | null) => {
        setEditingMenuItem(item);
        setIsMenuModalOpen(true);
    };

    const handleSaveMenuItem = async (itemData: Partial<FeaturedItem>, imageFile: File | null) => {
        if (!partner) return;
        let finalImageUrl = itemData.id ? menu.find(i => i.id === itemData.id)?.imageUrl : `https://picsum.photos/400/300?random=${Date.now()}`;

        if (imageFile) {
            finalImageUrl = await api.uploadImage(imageFile);
        }

        let updatedMenu: FeaturedItem[];
        if (itemData.id) { // Editing
            updatedMenu = menu.map(item => item.id === itemData.id ? { ...item, ...itemData, imageUrl: finalImageUrl } as FeaturedItem : item);
        } else { // Adding
            const newItem: FeaturedItem = {
                id: Date.now(),
                name: itemData.name || 'New Item',
                price: itemData.price || 0,
                category: itemData.category || 'Uncategorized',
                description: itemData.description || '',
                rating: 0,
                deliveryTime: '25-30 min',
                imageUrl: finalImageUrl,
                availability: 'In Stock',
            };
            updatedMenu = [...menu, newItem];
        }
        
        await api.updateMenuForRestaurant(partner.id, updatedMenu);
        setMenu(updatedMenu);
        setIsMenuModalOpen(false);
    };
    
    const handleDeleteMenuItem = async (itemId: number) => {
        if (partner && window.confirm("Are you sure you want to delete this item?")) {
            const updatedMenu = menu.filter(item => item.id !== itemId);
            await api.updateMenuForRestaurant(partner.id, updatedMenu);
            setMenu(updatedMenu);
        }
    };
    
    const handleToggleAvailability = async (itemId: number) => {
        if (!partner) return;
        const updatedMenu = menu.map(item => {
            if (item.id === itemId) {
                // FIX: Explicitly type newAvailability to maintain type safety.
                const newAvailability: 'In Stock' | 'Out of Stock' = item.availability === 'In Stock' ? 'Out of Stock' : 'In Stock';
                return { ...item, availability: newAvailability };
            }
            return item;
        });
        await api.updateMenuForRestaurant(partner.id, updatedMenu);
        setMenu(updatedMenu);
    };

    const menuByCategory = useMemo(() => {
        const grouped: Record<string, FeaturedItem[]> = {};
        menu.forEach(item => {
            const category = item.category || 'Uncategorized';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(item);
        });
        return grouped;
    }, [menu]);
    
    if (!partner || isLoading) {
        return <div className="h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-brand-chakra-blue border-t-transparent rounded-full animate-spin"></div></div>;
    }

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = orders.filter(o => o.status === 'Processing').length;

    const renderContent = () => {
        switch (activeTab) {
            case 'analytics': return (
                <div className="space-y-6">
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-charcoal p-6 rounded-2xl shadow-lg"><h3 className="font-bold text-gray-500">TOTAL REVENUE</h3><p className="text-4xl font-black text-brand-chakra-blue mt-2">{orders[0]?.currencySymbol || '₹'}{totalRevenue.toFixed(2)}</p></div>
                        <div className="bg-white dark:bg-charcoal p-6 rounded-2xl shadow-lg"><h3 className="font-bold text-gray-500">TOTAL ORDERS</h3><p className="text-4xl font-black mt-2">{orders.length}</p></div>
                        <div className="bg-white dark:bg-charcoal p-6 rounded-2xl shadow-lg"><h3 className="font-bold text-gray-500">PENDING ORDERS</h3><p className="text-4xl font-black text-yellow-500 mt-2">{pendingOrders}</p></div>
                    </section>
                    <section className="bg-white dark:bg-charcoal rounded-2xl shadow-lg overflow-hidden">
                        <h2 className="text-xl font-bold p-4 border-b dark:border-charcoal-light">Recent Orders</h2>
                        <div className="overflow-x-auto">
                           <table className="w-full text-sm text-left min-w-[600px]">
                               <thead className="bg-gray-50 dark:bg-charcoal-light text-xs uppercase"><tr><th className="px-6 py-3">Order ID</th><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th></tr></thead>
                               <tbody>
                                   {orders.slice(0, 5).map(order => (
                                        <tr key={order.id} className="border-b dark:border-charcoal-light">
                                            <td className="px-6 py-4 font-bold">#{order.id}</td><td className="px-6 py-4">{order.customerName}</td><td className="px-6 py-4 font-semibold">{order.currencySymbol}{order.totalAmount.toFixed(2)}</td><td className="px-6 py-4">{order.status}</td>
                                        </tr>
                                   ))}
                               </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            );
            case 'menu': return (
                 <section className="bg-white dark:bg-charcoal rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-4 flex justify-between items-center border-b dark:border-charcoal-light">
                        <h2 className="text-xl font-bold">Menu Management</h2>
                        <button onClick={() => handleOpenMenuModal(null)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"><PlusIcon className="w-4 h-4"/> Add Item</button>
                    </div>
                     <div className="p-4 space-y-6">
                        {Object.entries(menuByCategory).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="font-bold text-lg mb-2 text-gray-600 dark:text-gray-300">{category}</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left min-w-[600px]">
                                        <thead className="bg-gray-50 dark:bg-charcoal-light text-xs uppercase"><tr><th className="px-4 py-2 w-2/5">Item Name</th><th className="px-4 py-2 w-1/5">Price</th><th className="px-4 py-2 w-1/5">Availability</th><th className="px-4 py-2 w-1/5 text-right">Actions</th></tr></thead>
                                        <tbody>
                                            {/* FIX: Cast `items` to FeaturedItem[] as Object.entries returns `[string, unknown][]` in stricter TS configs, causing a type error on `.map`. */}
                                            {(items as FeaturedItem[]).map(item => (
                                                <tr key={item.id} className="border-b dark:border-charcoal-light">
                                                    <td className="px-4 py-2 font-semibold truncate">{item.name}</td>
                                                    <td className="px-4 py-2">{orders[0]?.currencySymbol || '₹'}{item.price.toFixed(2)}</td>
                                                    <td className="px-4 py-2">
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                          <input type="checkbox" checked={item.availability === 'In Stock'} onChange={() => handleToggleAvailability(item.id)} className="sr-only peer" />
                                                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                                        </label>
                                                    </td>
                                                    <td className="px-4 py-2 text-right"><div className="flex justify-end gap-2">
                                                        <button onClick={() => handleOpenMenuModal(item)} className="p-2 text-gray-500 hover:text-green-600"><PencilIcon className="w-5 h-5"/></button>
                                                        <button onClick={() => handleDeleteMenuItem(item.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                                                    </div></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            );
            default: return null;
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-charcoal min-h-screen">
            <header className="bg-white dark:bg-charcoal shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">{partner.businessName}</h1>
                        <p className="text-gray-500 dark:text-gray-400">Business Dashboard</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition">
                        <LogoutIcon className="h-5 w-5" /> Logout
                    </button>
                </div>
                <nav className="container mx-auto px-4 flex border-b dark:border-charcoal-light">
                    <button onClick={() => setActiveTab('analytics')} className={`px-4 py-3 font-semibold border-b-2 ${activeTab==='analytics' ? 'border-brand-chakra-blue text-brand-chakra-blue' : 'border-transparent text-gray-500'}`}>Analytics</button>
                    <button onClick={() => setActiveTab('menu')} className={`px-4 py-3 font-semibold border-b-2 ${activeTab==='menu' ? 'border-brand-chakra-blue text-brand-chakra-blue' : 'border-transparent text-gray-500'}`}>Menu</button>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-8">
                {renderContent()}
            </main>
            <MenuEditModal isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)} onSave={handleSaveMenuItem} itemToEdit={editingMenuItem} />
            {notification && (
                <NotificationToast
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default BusinessDashboardPage;
