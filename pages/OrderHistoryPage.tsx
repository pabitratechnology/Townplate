
import React, { useState, useEffect } from 'react';
import { Order, CartItem, OrderStatus, User } from '../types';
import PageHeader from '../components/PageHeader';
import { ClockIcon, CourierIcon, CheckCircleIcon, SupportIcon, StarIcon, CubeIcon } from '../components/IconComponents';
import * as api from '../services/api';
import InvoiceModal from '../components/InvoiceModal';

interface OrderHistoryPageProps {
    user: User;
    onOrderAgain: (order: Order) => void;
}

const OrderItem: React.FC<{ item: CartItem, currencySymbol: string, orderStatus: OrderStatus }> = ({ item, currencySymbol, orderStatus }) => (
    <div className="flex justify-between items-start py-3">
        <div className="flex items-start">
            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4 flex-shrink-0" />
            <div>
                <p className="font-semibold">{item.name} <span className="font-normal text-sm text-gray-500 dark:text-gray-400">(&times;{item.quantity})</span></p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.variantName}</p>
                 {item.customizations && item.customizations.length > 0 && (
                    <ul className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-4 list-disc">
                        {item.customizations.map(cust => (
                            <li key={cust.optionName}>{cust.optionName}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
        <div className="text-right">
            <p className="font-semibold">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</p>
            {orderStatus === 'Delivered' && (
                <a href={`#/product/${item.productId}#reviews`} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-yellow-500 hover:text-yellow-600">
                    <StarIcon className="w-4 h-4"/>
                    Leave a Review
                </a>
            )}
        </div>
    </div>
);

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    let statusInfo: { text: string; bgColor: string; textColor: string; icon: React.ReactNode };

    switch (status) {
        case 'Out for Delivery':
            statusInfo = {
                text: 'Out for Delivery',
                bgColor: 'bg-blue-100 dark:bg-blue-900/50',
                textColor: 'text-blue-800 dark:text-blue-300',
                icon: <CourierIcon className="h-4 w-4" />,
            };
            break;
        case 'Delivered':
            statusInfo = {
                text: 'Delivered',
                bgColor: 'bg-green-100 dark:bg-green-900/50',
                textColor: 'text-green-800 dark:text-green-300',
                icon: <CheckCircleIcon className="h-4 w-4" />,
            };
            break;
        case 'Processing':
        default:
            statusInfo = {
                text: 'Processing',
                bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
                textColor: 'text-yellow-800 dark:text-yellow-300',
                icon: <ClockIcon className="h-4 w-4" />,
            };
            break;
    }

    return (
        <div className={`mt-1 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusInfo.bgColor} ${statusInfo.textColor}`}>
            {statusInfo.icon}
            <span className="ml-1.5">{statusInfo.text}</span>
        </div>
    );
};

const OrderStatusTracker: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const statuses: OrderStatus[] = ['Processing', 'Out for Delivery', 'Delivered'];
    const currentStatusIndex = statuses.indexOf(status);

    const getIcon = (stepStatus: OrderStatus) => {
        if (stepStatus === 'Processing') return <ClockIcon className="h-6 w-6" />;
        if (stepStatus === 'Out for Delivery') return <CourierIcon className="h-6 w-6" />;
        if (stepStatus === 'Delivered') return <CheckCircleIcon className="h-6 w-6" />;
        return null;
    };

    const isFullyDelivered = status === 'Delivered';

    return (
        <div className="my-6 px-2 sm:px-4">
            <div className="flex items-center">
                {statuses.map((stepStatus, index) => {
                    const isActive = index === currentStatusIndex && !isFullyDelivered;
                    const isCompleted = index < currentStatusIndex || isFullyDelivered;
                    
                    return (
                        <React.Fragment key={stepStatus}>
                            <div className="flex flex-col items-center text-center w-1/3 z-10">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                    isActive
                                    ? 'bg-brand-chakra-blue border-brand-chakra-blue text-white animate-pulse'
                                    : isCompleted
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'bg-gray-100 dark:bg-charcoal border-gray-300 dark:border-gray-600 text-gray-400'
                                }`}>
                                    {getIcon(stepStatus)}
                                </div>
                                <p className={`mt-2 text-xs font-bold transition-colors duration-300 ${
                                    isActive || isCompleted
                                    ? 'text-charcoal dark:text-white' 
                                    : 'text-gray-400'
                                }`}>{stepStatus}</p>
                            </div>

                            {index < statuses.length - 1 && (
                                <div className={`flex-1 h-1 transition-colors duration-500 ${
                                    isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
                                }`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};


const OrderCard: React.FC<{ order: Order; onViewInvoice: (order: Order) => void; onOrderAgain: (order: Order) => void; }> = ({ order, onViewInvoice, onOrderAgain }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const orderDate = new Date(order.date);
    let deliveryTimeLabel = '';
    let deliveryTimeValue = '';
    let deliveryTimeIcon = <ClockIcon className="h-8 w-8 text-brand-chakra-blue" />;

    if (order.status === 'Delivered') {
        const deliveryDate = new Date(orderDate.getTime() + 25 * 60000); // Simulate 25 mins later
        deliveryTimeLabel = 'Delivered at';
        deliveryTimeValue = deliveryDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        deliveryTimeIcon = <CheckCircleIcon className="h-8 w-8 text-green-500" />;
    } else {
        const estimatedDeliveryDate = new Date(orderDate.getTime() + 30 * 60000); // Simulate 30 mins later
        deliveryTimeLabel = 'Estimated Delivery';
        deliveryTimeValue = estimatedDeliveryDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-charcoal">
            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div>
                    <p className="font-bold text-lg text-brand-chakra-blue">Order #{order.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <div className="mt-2 sm:mt-0 text-left sm:text-right">
                    <p className="font-bold text-lg">{order.currencySymbol}{order.totalAmount.toFixed(2)}</p>
                    <StatusBadge status={order.status} />
                </div>
            </div>
            {isExpanded && (
                <div className="p-4 border-t border-gray-200 dark:border-charcoal animate-fade-in">
                    <OrderStatusTracker status={order.status} />

                    <div className="text-center my-6 p-4 bg-gray-50 dark:bg-charcoal rounded-lg flex flex-col items-center justify-center">
                        {deliveryTimeIcon}
                        <p className="mt-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{deliveryTimeLabel}</p>
                        <p className="text-3xl font-black text-brand-chakra-blue">{deliveryTimeValue}</p>
                    </div>

                    <h4 className="font-bold mb-2">Items in this order:</h4>
                    <div className="space-y-2 divide-y divide-gray-100 dark:divide-charcoal mb-4">
                        {order.items.map(item => (
                           <OrderItem key={item.id} item={item} currencySymbol={order.currencySymbol} orderStatus={order.status} />
                        ))}
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-charcoal rounded-lg text-sm">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <h5 className="font-bold flex items-center mb-1 text-gray-700 dark:text-gray-200">
                                    <SupportIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                                    Need Help?
                                </h5>
                                <div className="mt-1">
                                    <button onClick={() => window.location.hash = '#/support'} className="font-semibold text-brand-chakra-blue hover:underline">Contact Support</button>
                                    <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                                    <button onClick={() => onViewInvoice(order)} className="font-semibold text-brand-chakra-blue hover:underline">View Invoice</button>
                                </div>
                            </div>
                             <div className="flex items-center gap-2">
                                {order.status === 'Delivered' && (
                                    <a href={`#/restaurant/${order.restaurantId}#reviews`} className="px-4 py-2 text-sm font-bold rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center gap-2">
                                        <StarIcon className="w-4 h-4"/>
                                        Review Restaurant
                                    </a>
                                 )}
                                 <button
                                     onClick={() => onOrderAgain(order)}
                                     className="px-4 py-2 text-sm font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 flex items-center gap-2"
                                 >
                                     <CubeIcon className="w-4 h-4"/>
                                     Order Again
                                 </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ user, onOrderAgain }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

    useEffect(() => {
        document.title = `My Orders - TownPlate`;
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', `View and track your past and current orders on TownPlate. Access invoices and get support for your purchases.`);
        }
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user.email) return;
            setIsLoading(true);
            try {
                const userOrders = await api.getOrdersForUser(user.email);
                setOrders(userOrders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [user.email]);

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'My Profile', href: '#/profile' },
        { label: 'Order History' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Order History"
                subtitle="A record of all your past purchases with TownPlate"
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 border-4 border-brand-chakra-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 font-semibold">Fetching your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold mb-2">No Order History</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">You haven't placed any orders yet. Let's change that!</p>
                        <button 
                            onClick={() => window.location.hash = '#/'}
                            className="inline-block px-8 py-3 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {orders.map(order => (
                            <OrderCard key={order.id} order={order} onViewInvoice={setSelectedOrderForInvoice} onOrderAgain={onOrderAgain} />
                        ))}
                    </div>
                )}
            </div>
            {selectedOrderForInvoice && (
                <InvoiceModal 
                    order={selectedOrderForInvoice}
                    user={user}
                    onClose={() => setSelectedOrderForInvoice(null)}
                />
            )}
        </div>
    );
};

export default OrderHistoryPage;
