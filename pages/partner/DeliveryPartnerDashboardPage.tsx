import React, { useState, useEffect, useCallback } from 'react';
import { DeliveryOrder, DeliveryPartner, DeliveryOrderStatus, Location } from '../../types';
import { ClockIcon, CourierIcon, CheckCircleIcon, LogoutIcon, MapPinIcon } from '../../components/IconComponents';
import * as api from '../../services/api';

const OrderStatusBadge: React.FC<{ status: DeliveryOrderStatus }> = ({ status }) => {
    let styles = '';
    let icon: React.ReactNode;
    switch (status) {
        case 'Accepted':
            styles = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            icon = <ClockIcon className="h-4 w-4" />;
            break;
        case 'Picked Up':
            styles = 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            icon = <CourierIcon className="h-4 w-4" />;
            break;
        case 'Delivered':
            styles = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            icon = <CheckCircleIcon className="h-4 w-4" />;
            break;
    }
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${styles}`}>
            {icon}
            {status}
        </span>
    );
};


const DeliveryPartnerDashboardPage: React.FC = () => {
    const [partner, setPartner] = useState<DeliveryPartner | null>(null);
    const [currencySymbol, setCurrencySymbol] = useState<string>('₹');
    const [isOnline, setIsOnline] = useState(false);
    
    const [newOrderRequest, setNewOrderRequest] = useState<DeliveryOrder | null>(null);
    const [currentTask, setCurrentTask] = useState<DeliveryOrder | null>(null);
    const [completedOrders, setCompletedOrders] = useState<DeliveryOrder[]>([]);

    const [requestTimer, setRequestTimer] = useState(100);

    // Initial data loading from localStorage
    useEffect(() => {
        try {
            const storedPartner = localStorage.getItem('townplate-delivery-partner');
            if (!storedPartner) {
                window.location.hash = '#/partner/login';
                return;
            }
            setPartner(JSON.parse(storedPartner));

            const storedLocation = localStorage.getItem('townplate-location');
            if (storedLocation) setCurrencySymbol(JSON.parse(storedLocation).currencySymbol);
        } catch (e) {
            console.error("Error loading data", e);
            window.location.hash = '#/partner/login';
        }
    }, []);

    // Simulate new order requests when online
    useEffect(() => {
        let interval: number;
        if (isOnline && !newOrderRequest && !currentTask) {
            interval = window.setInterval(() => {
                const sampleOrders: DeliveryOrder[] = [
                    { id: Date.now(), customerName: 'Alice Johnson', pickupAddress: 'Pizza Palace, Infocity', dropoffAddress: '123 Oak St, Patia', status: 'Accepted', earnings: 55.50 },
                    { id: Date.now(), customerName: 'Bob Williams', pickupAddress: 'Green Grocers, Saheed Nagar', dropoffAddress: '456 Pine Ave, Nayapalli', status: 'Accepted', earnings: 47.75 },
                    { id: Date.now(), customerName: 'Charlie Brown', pickupAddress: 'Burger Barn, Khandagiri', dropoffAddress: '789 Maple Rd, Baramunda', status: 'Accepted', earnings: 60.00 },
                ];
                setNewOrderRequest(sampleOrders[Math.floor(Math.random() * sampleOrders.length)]);
            }, 8000); // New order every 8 seconds
        }
        return () => clearInterval(interval);
    }, [isOnline, newOrderRequest, currentTask]);

    // Handle countdown timer for new requests
    useEffect(() => {
        let timer: number;
        if (newOrderRequest) {
            setRequestTimer(100); // Reset timer
            timer = window.setInterval(() => {
                setRequestTimer(prev => {
                    if (prev <= 0) {
                        setNewOrderRequest(null); // Reject on timeout
                        return 100;
                    }
                    return prev - 2; // Decrease by 2 for a 5-second countdown
                });
            }, 100);
        }
        return () => clearInterval(timer);
    }, [newOrderRequest]);

    const handleLogout = () => {
        localStorage.removeItem('townplate-delivery-partner');
        window.location.hash = '#/partner/login';
    };

    const handleAcceptOrder = () => {
        if (newOrderRequest) {
            setCurrentTask(newOrderRequest);
            setNewOrderRequest(null);
        }
    };
    
    const handleRejectOrder = () => {
        setNewOrderRequest(null);
    };

    const handleUpdateTaskStatus = () => {
        if (!currentTask) return;
        
        let nextStatus: DeliveryOrderStatus | null = null;
        if (currentTask.status === 'Accepted') nextStatus = 'Picked Up';
        else if (currentTask.status === 'Picked Up') nextStatus = 'Delivered';

        if (nextStatus) {
            const updatedTask = { ...currentTask, status: nextStatus };
            setCurrentTask(updatedTask);
            
            if (nextStatus === 'Delivered' && partner) {
                // Move to completed and update earnings
                setCompletedOrders(prev => [updatedTask, ...prev]);
                
                const updatedPartner = { ...partner, totalEarnings: partner.totalEarnings + updatedTask.earnings };
                setPartner(updatedPartner);
                localStorage.setItem('townplate-delivery-partner', JSON.stringify(updatedPartner));
                
                setCurrentTask(null);
            }
        }
    };

    if (!partner) {
        return <div className="h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-brand-chakra-blue border-t-transparent rounded-full animate-spin"></div></div>;
    }
    
    const todaysEarnings = completedOrders.reduce((acc, order) => acc + order.earnings, 0);

    return (
        <div className="animate-fade-in bg-gray-50 dark:bg-charcoal min-h-screen">
            <header className="bg-white dark:bg-charcoal-light shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">Rider Dashboard</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {partner.name}!</p>
                    </div>
                     <div className="flex items-center gap-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={isOnline} onChange={() => setIsOnline(!isOnline)} className="sr-only peer" />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                            <span className="ml-3 text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
                        </label>
                         <button onClick={handleLogout} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-charcoal"><LogoutIcon className="h-6 w-6" /></button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Order Request Popup */}
                {newOrderRequest && (
                    <div className="fixed inset-x-4 bottom-4 z-20 bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl p-6 animate-fade-in-up">
                        <h2 className="font-bold text-lg text-center">New Delivery Request!</h2>
                        <div className="relative w-full bg-gray-200 dark:bg-charcoal rounded-full h-1 my-3 overflow-hidden">
                           <div className="bg-brand-chakra-blue h-1 rounded-full" style={{ width: `${requestTimer}%`, transition: 'width 0.1s linear' }}></div>
                        </div>
                        <div className="text-sm space-y-2 my-4">
                             <div className="flex items-start gap-2"><MapPinIcon className="w-4 h-4 mt-0.5 text-yellow-500" /><div><p className="font-bold text-gray-500 dark:text-gray-400 text-xs">PICKUP</p><p>{newOrderRequest.pickupAddress}</p></div></div>
                             <div className="flex items-start gap-2"><MapPinIcon className="w-4 h-4 mt-0.5 text-green-500" /><div><p className="font-bold text-gray-500 dark:text-gray-400 text-xs">DROPOFF</p><p>{newOrderRequest.dropoffAddress}</p></div></div>
                        </div>
                        <div className="text-center font-bold text-lg mb-4">Estimated Earnings: <span className="text-green-500">{currencySymbol}{newOrderRequest.earnings.toFixed(2)}</span></div>
                        <div className="flex gap-3">
                            <button onClick={handleRejectOrder} className="w-1/2 py-3 font-bold rounded-lg bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">Reject</button>
                            <button onClick={handleAcceptOrder} className="w-1/2 py-3 font-bold rounded-lg bg-green-500 text-white">Accept</button>
                        </div>
                    </div>
                )}
                
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-charcoal-light p-6 rounded-2xl shadow-lg"><h3 className="font-bold text-gray-500 dark:text-gray-400">TODAY'S EARNINGS</h3><p className="text-4xl font-black text-brand-chakra-blue mt-2">{currencySymbol}{todaysEarnings.toFixed(2)}</p></div>
                    <div className="bg-white dark:bg-charcoal-light p-6 rounded-2xl shadow-lg"><h3 className="font-bold text-gray-500 dark:text-gray-400">TOTAL EARNINGS</h3><p className="text-4xl font-black mt-2">{currencySymbol}{partner.totalEarnings.toFixed(2)}</p></div>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-4">Your Status</h2>
                    {currentTask ? (
                        <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl overflow-hidden">
                             <div className="p-6">
                                <div className="flex justify-between items-start"><h3 className="font-bold text-2xl text-brand-chakra-blue">Current Delivery #{currentTask.id}</h3><OrderStatusBadge status={currentTask.status} /></div>
                                <div className="mt-6 space-y-4 text-sm">
                                    <div className="flex items-start gap-3"><MapPinIcon className="w-5 h-5 mt-0.5 text-yellow-500" /><div><p className="font-bold text-gray-500 dark:text-gray-400">PICKUP</p><p className="font-semibold text-lg">{currentTask.pickupAddress}</p></div></div>
                                    <div className="flex items-start gap-3"><MapPinIcon className="w-5 h-5 mt-0.5 text-green-500" /><div><p className="font-bold text-gray-500 dark:text-gray-400">DROPOFF</p><p className="font-semibold text-lg">{currentTask.dropoffAddress}</p></div></div>
                                </div>
                            </div>
                            <div className="h-48 bg-gray-200 dark:bg-charcoal flex items-center justify-center text-gray-400 font-semibold"><MapPinIcon className="w-8 h-8 mr-2"/>Map Placeholder</div>
                            <div className="bg-gray-50 dark:bg-charcoal p-4"><button onClick={handleUpdateTaskStatus} className="w-full px-8 py-3.5 font-bold rounded-lg bg-brand-chakra-blue text-white hover:bg-opacity-90 transition transform hover:scale-105">{currentTask.status === 'Accepted' ? 'Confirm Pickup' : 'Complete Delivery'}</button></div>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white dark:bg-charcoal-light rounded-2xl shadow-lg">
                            {isOnline ? (
                                <>
                                    <h3 className="text-2xl font-bold">Waiting for new orders...</h3>
                                    <p className="text-gray-500 mt-2">You're online and ready to go!</p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-bold">You are Offline</h3>
                                    <p className="text-gray-500 mt-2">Toggle the switch in the header to go online and start receiving orders.</p>
                                </>
                            )}
                        </div>
                    )}
                </section>

                <section className="mt-12">
                     <h2 className="text-xl font-bold mb-4">Today's Completed Orders ({completedOrders.length})</h2>
                     <div className="space-y-3">
                         {completedOrders.length > 0 ? completedOrders.map(order => (
                             <div key={order.id} className="bg-white dark:bg-charcoal-light rounded-lg shadow-sm p-3 flex justify-between items-center opacity-80 hover:opacity-100 transition">
                                <div><h3 className="font-semibold">Order #{order.id}</h3><p className="text-xs text-gray-500 dark:text-gray-400">Delivered to {order.customerName}</p></div>
                                <OrderStatusBadge status={order.status} />
                                <p className="font-semibold text-green-600 dark:text-green-400">+{currencySymbol}{order.earnings.toFixed(2)}</p>
                             </div>
                         )) : ( <p className="text-center text-gray-500 py-8">No completed orders yet for today.</p> )}
                     </div>
                </section>
            </main>
        </div>
    );
};

export default DeliveryPartnerDashboardPage;