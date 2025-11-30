

import React, { useState, useEffect, useMemo } from 'react';
import { BusinessPartner, Order, User, OrderStatus, BusinessType, DeliveryPartner } from '../../types';
import { LogoutIcon, ChartBarIcon, ReceiptIcon, BuildingStorefrontIcon, UserIcon as UsersIcon, DownloadIcon, PlusIcon, PencilIcon, TrashIcon, FilterIcon, CourierIcon, ArrowUpIcon, ArrowDownIcon, SearchIcon } from '../../components/IconComponents';
import * as api from '../../services/api';
import UserDetailsModal from '../../components/UserDetailsModal';
import UserEditModal from '../../components/UserEditModal';
import PartnerEditModal from '../../components/PartnerEditModal';
import DeliveryPartnerEditModal from '../../components/DeliveryPartnerEditModal';


type AdminTab = 'analytics' | 'users' | 'partners' | 'deliveryPartners' | 'orders';
type TimeRange = '7d' | '30d' | 'all';

const AdvancedStatCard: React.FC<{ title: string; value: string; trend: string; trendDirection: 'up' | 'down' | 'neutral'; icon: React.ReactNode; }> = ({ title, value, trend, trendDirection, icon }) => (
    <div className="bg-white dark:bg-charcoal p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-chakra-blue/10 text-brand-chakra-blue">
                {icon}
            </div>
            <div className={`flex items-center text-sm font-bold ${trendDirection === 'up' ? 'text-green-500' : trendDirection === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                {trendDirection === 'up' && <ArrowUpIcon className="w-4 h-4" />}
                {trendDirection === 'down' && <ArrowDownIcon className="w-4 h-4" />}
                <span>{trend}</span>
            </div>
        </div>
        <div className="mt-4">
            <p className="text-3xl font-black text-gray-800 dark:text-gray-200">{value}</p>
            <p className="font-semibold text-gray-500 dark:text-gray-400 uppercase text-sm">{title}</p>
        </div>
    </div>
);


const RevenueChart: React.FC<{ data: { date: string; revenue: number }[], currencySymbol: string }> = ({ data, currencySymbol }) => {
    const PADDING = 40;
    const VIEW_WIDTH = 500;
    const VIEW_HEIGHT = 250;

    const maxRevenue = Math.max(...data.map(d => d.revenue), 0);
    const yMax = maxRevenue > 0 ? Math.ceil(maxRevenue / 100) * 100 : 100;

    const points = data.length > 1 ? data.map((point, i) => {
        const x = PADDING + (i / (data.length - 1)) * (VIEW_WIDTH - 2 * PADDING);
        const y = VIEW_HEIGHT - PADDING - (point.revenue / yMax) * (VIEW_HEIGHT - 2 * PADDING);
        return `${x},${y}`;
    }).join(' ') : '';
    
    const xLabels = data.length > 1 ? [data[0], data[Math.floor(data.length / 2)], data[data.length - 1]] : data;

    return (
        <div className="bg-white dark:bg-charcoal p-6 rounded-2xl shadow-lg h-full">
            <h3 className="font-bold text-lg mb-4">Revenue Over Time</h3>
             {data.length > 0 ? (
                <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="w-full h-full">
                    {/* Y-axis labels and grid lines */}
                    {[0, 0.5, 1].map(tick => (
                        <g key={tick}>
                            <text x={PADDING - 8} y={VIEW_HEIGHT - PADDING - tick * (VIEW_HEIGHT - 2 * PADDING)} textAnchor="end" dy="0.3em" className="text-xs fill-current text-gray-400">{currencySymbol}{(yMax * tick).toLocaleString()}</text>
                            <line x1={PADDING} x2={VIEW_WIDTH - PADDING} y1={VIEW_HEIGHT - PADDING - tick * (VIEW_HEIGHT - 2 * PADDING)} y2={VIEW_HEIGHT - PADDING - tick * (VIEW_HEIGHT - 2 * PADDING)} className="stroke-current text-gray-100 dark:text-charcoal-light" strokeWidth="1"/>
                        </g>
                    ))}

                    {/* X-axis labels */}
                    {xLabels.map((point, i) => {
                        const x = data.length > 1
                            ? PADDING + (data.findIndex(d => d.date === point.date) / (data.length - 1)) * (VIEW_WIDTH - 2 * PADDING)
                            : PADDING + (VIEW_WIDTH - 2 * PADDING) / 2;
                        return <text key={i} x={x} y={VIEW_HEIGHT - PADDING + 15} textAnchor="middle" className="text-xs fill-current text-gray-400">{new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</text>
                    })}
                    
                    {/* Gradient for area */}
                    <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0033A0" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="#0033A0" stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                    
                    {/* Area path */}
                    {data.length > 1 && <path d={`M${points.split(' ')[0]} L${points} L${VIEW_WIDTH - PADDING},${VIEW_HEIGHT - PADDING} L${PADDING},${VIEW_HEIGHT - PADDING} Z`} fill="url(#revenueGradient)" />}
                    
                    {/* Line path */}
                    {data.length > 1 && <polyline points={points} fill="none" className="stroke-current text-brand-chakra-blue" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>}
                </svg>
             ) : (
                <div className="flex items-center justify-center h-full text-gray-400">No revenue data for this period.</div>
             )}
        </div>
    );
};

const OrderStatusPieChart: React.FC<{ data: Record<OrderStatus, number> }> = ({ data }) => {
    const total = Object.values(data).reduce((a: number, b: number) => a + b, 0);
    if (total === 0) return <div className="bg-white dark:bg-charcoal p-6 rounded-2xl shadow-lg h-full flex items-center justify-center"><p className="text-gray-400">No order data</p></div>;

    const statuses: { key: OrderStatus, color: string }[] = [
        { key: 'Delivered', color: 'text-green-500' },
        { key: 'Out for Delivery', color: 'text-blue-500' },
        { key: 'Processing', color: 'text-yellow-500' },
    ];

    let accumulated_percent = 0;
    const segments = statuses.map(status => {
        const percent = ((data[status.key] || 0) / total) * 100;
        const segment = { ...status, percent, offset: 25 - accumulated_percent };
        accumulated_percent += percent;
        return segment;
    });

    return (
        <div className="bg-white dark:bg-charcoal p-6 rounded-2xl shadow-lg h-full">
            <h3 className="font-bold text-lg mb-4">Order Status</h3>
            <div className="flex items-center justify-center gap-8">
                <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="transform -rotate-90">
                        <circle cx="18" cy="18" r="15.915" className="stroke-current text-gray-200 dark:text-charcoal-light" fill="transparent" strokeWidth="4"/>
                        {segments.map(s => (
                            <circle key={s.key} cx="18" cy="18" r="15.915" className={`stroke-current ${s.color}`} fill="transparent" strokeWidth="4" strokeDasharray={`${s.percent} ${100 - s.percent}`} strokeDashoffset={s.offset}/>
                        ))}
                    </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-gray-800 dark:text-gray-200">{total}</span>
                        <span className="text-xs text-gray-500">Orders</span>
                    </div>
                </div>
                <ul className="space-y-2 text-sm">
                    {statuses.map(s => (
                         <li key={s.key} className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${s.color.replace('text-','bg-')}`}></span>
                            <span className="font-semibold">{s.key}</span>
                            <span className="ml-auto text-gray-500 dark:text-gray-400">{data[s.key] || 0}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const RecentActivity: React.FC<{ orders: Order[] }> = ({ orders }) => (
    <div className="bg-white dark:bg-charcoal p-6 rounded-2xl shadow-lg h-full">
        <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
        <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex justify-between items-center text-sm">
                    <div>
                        <p className="font-semibold">{order.customerName}</p>
                        <p className="text-xs text-gray-400">#{order.id}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold">{order.currencySymbol}{order.totalAmount.toFixed(2)}</p>
                        <p className={`text-xs font-bold ${order.status === 'Delivered' ? 'text-green-500' : 'text-yellow-500'}`}>{order.status}</p>
                    </div>
                </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-center text-gray-400 py-8">No recent orders.</p>}
        </div>
    </div>
);

const calculateTrend = (current: number, previous: number): { trend: string; direction: 'up' | 'down' | 'neutral' } => {
    if (previous === 0) {
        return current > 0 ? { trend: `+${current}`, direction: 'up' } : { trend: '0', direction: 'neutral' };
    }
    if (current === previous) {
        return { trend: '0%', direction: 'neutral' };
    }
    const percentageChange = ((current - previous) / previous) * 100;
    const direction = percentageChange > 0 ? 'up' : 'down';
    const trend = `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`;
    return { trend, direction };
};

const AdminDashboardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
    const [partners, setPartners] = useState<BusinessPartner[]>([]);
    const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
    const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
    const [isPartnerEditModalOpen, setIsPartnerEditModalOpen] = useState(false);
    const [isDeliveryPartnerEditModalOpen, setIsDeliveryPartnerEditModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editingPartner, setEditingPartner] = useState<BusinessPartner | null>(null);
    const [editingDeliveryPartner, setEditingDeliveryPartner] = useState<DeliveryPartner | null>(null);
    
    const [timeRange, setTimeRange] = useState<TimeRange>('30d');
    const [userStatusFilter, setUserStatusFilter] = useState('All');
    const [partnerTypeFilter, setPartnerTypeFilter] = useState<BusinessType | 'All'>('All');
    const [partnerStatusFilter, setPartnerStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
    const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'All'>('All');
    const [deliveryPartnerSearch, setDeliveryPartnerSearch] = useState('');

    useEffect(() => {
        const isAdmin = localStorage.getItem('townplate-is-admin-logged-in');
        if (!isAdmin) {
            window.location.hash = '#/admin/login';
            return;
        }
        
        loadData();
    }, []);
    
    const loadData = async () => {
        setIsLoading(true);
        try {
            const [partnerData, orderData, userData, deliveryPartnerData] = await Promise.all([
                api.getBusinessPartners(),
                api.getAllOrders(),
                api.getAllUsers(),
                api.getAllDeliveryPartners()
            ]);
            setPartners(partnerData);
            setOrders(orderData);
            setUsers(userData);
            setDeliveryPartners(deliveryPartnerData);
        } catch (error) {
            console.error("Failed to load admin data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('townplate-is-admin-logged-in');
        window.location.hash = '#/admin/login';
    };
    
    const handleSaveUser = async (userData: Partial<User>) => {
        try {
            if (editingUser) { await api.updateUser(editingUser.email, userData); } 
            else { await api.createUser(userData); }
            await loadData();
        } catch (error) { alert(`Error: ${error}`); }
        setIsUserEditModalOpen(false);
    };

    const handleDeleteUser = async (email: string) => {
        if (window.confirm("Delete this user permanently?")) {
            try { await api.deleteUser(email); await loadData(); } 
            catch (error) { alert("Failed to delete user."); }
        }
    };
    
    const handleSavePartner = async (partnerData: Partial<BusinessPartner>) => {
        try {
            if (editingPartner) { await api.updatePartner(editingPartner.id, partnerData); } 
            else { await api.createBusinessPartner(partnerData); }
            await loadData();
        } catch (error) { alert(`Error: ${error}`); }
        setIsPartnerEditModalOpen(false);
    };
    
    const handleDeletePartner = async (id: number) => {
        if (window.confirm("Delete this partner?")) {
            try { await api.deletePartner(id); await loadData(); } 
            catch (error) { alert("Failed to delete partner."); }
        }
    };
    
    const handleSaveDeliveryPartner = async (partnerData: Partial<DeliveryPartner>) => {
        try {
            if (editingDeliveryPartner) { await api.updateDeliveryPartner(editingDeliveryPartner.id, partnerData); } 
            else { await api.createDeliveryPartner(partnerData); }
            await loadData();
        } catch (error) { alert(`Error: ${error}`); }
        setIsDeliveryPartnerEditModalOpen(false);
    };

    const handleDeleteDeliveryPartner = async (id: number) => {
        if (window.confirm("Delete this delivery partner?")) {
            try { await api.deleteDeliveryPartner(id); await loadData(); } 
            catch (error) { alert("Failed to delete delivery partner."); }
        }
    };

    const handleUpdateOrderStatus = async (id: number, status: OrderStatus) => {
        try {
            await api.updateOrderStatusAdmin(id, status);
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        } catch (error) { alert("Failed to update order status."); await loadData(); }
    };
    
     const handleDeleteOrder = async (id: number) => {
        if (window.confirm("Delete this order?")) {
            try { await api.deleteOrder(id); await loadData(); } 
            catch (error) { alert("Failed to delete order."); }
        }
    };
    
    const handleOpenUserCreate = () => { setEditingUser(null); setIsUserEditModalOpen(true); };
    const handleOpenUserEdit = (user: User) => { setEditingUser(user); setIsUserEditModalOpen(true); };
    const handleOpenPartnerCreate = () => { setEditingPartner(null); setIsPartnerEditModalOpen(true); };
    const handleOpenPartnerEdit = (partner: BusinessPartner) => { setEditingPartner(partner); setIsPartnerEditModalOpen(true); };
    const handleOpenDeliveryPartnerCreate = () => { setEditingDeliveryPartner(null); setIsDeliveryPartnerEditModalOpen(true); };
    const handleOpenDeliveryPartnerEdit = (partner: DeliveryPartner) => { setEditingDeliveryPartner(partner); setIsDeliveryPartnerEditModalOpen(true); };
    
    const handleViewUserDetails = (user: User) => { setSelectedUser(user); setIsUserDetailsModalOpen(true); };
    
    const handleUpdateUserStatus = async (email: string, status: 'active' | 'suspended') => {
        if (window.confirm(`Are you sure you want to ${status === 'active' ? 'reactivate' : 'suspend'} this user?`)) {
            try { await api.updateUserStatus(email, status); await loadData(); } 
            catch (error) { alert('Failed to update user status.'); }
        }
    };

    const handleUpdateDeliveryPartnerStatus = async (id: number, status: 'Active' | 'Inactive') => {
         if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this partner?`)) {
            try { await api.updateDeliveryPartnerStatus(id, status); await loadData(); } 
            catch (error) { alert('Failed to update partner status.'); }
        }
    };

    const downloadCSV = <T extends object>(data: T[], filename: string) => {
        if (data.length === 0) {
            alert("No data to download.");
            return;
        }
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                let cell = (row as any)[header];
                if (typeof cell === 'object' && cell !== null) {
                    cell = JSON.stringify(cell);
                }
                const stringCell = String(cell).replace(/"/g, '""');
                return `"${stringCell}"`;
            }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredUsers = useMemo(() => users.filter(u => userStatusFilter === 'All' || u.status === userStatusFilter), [users, userStatusFilter]);
    const filteredPartners = useMemo(() => partners.filter(p => (partnerTypeFilter === 'All' || p.businessType === partnerTypeFilter) && (partnerStatusFilter === 'All' || p.status === partnerStatusFilter)), [partners, partnerTypeFilter, partnerStatusFilter]);
    const filteredOrders = useMemo(() => orders.filter(o => orderStatusFilter === 'All' || o.status === orderStatusFilter), [orders, orderStatusFilter]);
    const filteredDeliveryPartners = useMemo(() => deliveryPartners.filter(p => p.name.toLowerCase().includes(deliveryPartnerSearch.toLowerCase()) || p.email.toLowerCase().includes(deliveryPartnerSearch.toLowerCase())), [deliveryPartners, deliveryPartnerSearch]);

    const analyticsData = useMemo(() => {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : (orders.length > 0 ? (new Date().getTime() - new Date(orders[orders.length - 1].date).getTime()) / (1000 * 3600 * 24) : 0);
        
        const now = new Date();
        const currentPeriodEnd = new Date(now);
        const currentPeriodStart = new Date(now);
        currentPeriodStart.setDate(currentPeriodStart.getDate() - days);

        const previousPeriodEnd = new Date(currentPeriodStart);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        const previousPeriodStart = new Date(previousPeriodEnd);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - days);

        const currentOrders = timeRange === 'all' ? orders : orders.filter(o => new Date(o.date) >= currentPeriodStart && new Date(o.date) <= currentPeriodEnd);
        const previousOrders = timeRange === 'all' ? [] : orders.filter(o => new Date(o.date) >= previousPeriodStart && new Date(o.date) <= previousPeriodEnd);
        
        // FIX: Ensure totalAmount is treated as a number during arithmetic operations to prevent type errors. Cast to Number and provide a fallback.
        const totalRevenue = currentOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
        const prevTotalRevenue = previousOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
        const revenueTrend = calculateTrend(totalRevenue, prevTotalRevenue);
        
        const ordersTrend = calculateTrend(currentOrders.length, previousOrders.length);
        
        const revenueByDate: Record<string, number> = {};
        currentOrders.forEach(o => {
            const date = new Date(o.date).toISOString().split('T')[0];
            // FIX: Ensure totalAmount is a number before adding to prevent type errors with malformed data.
            revenueByDate[date] = (revenueByDate[date] || 0) + Number(o.totalAmount || 0);
        });
        const revenueChartData = Object.entries(revenueByDate).map(([date, revenue]) => ({ date, revenue })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const orderStatusCounts = currentOrders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {} as Record<OrderStatus, number>);
        
        return { totalRevenue, totalOrders: currentOrders.length, newUsers: users.length, revenueChartData, orderStatusCounts, revenueTrend, ordersTrend };
    }, [orders, users, timeRange]);
    

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-brand-chakra-blue border-t-transparent rounded-full animate-spin"></div></div>;
    }
    
    const renderContent = () => {
        switch(activeTab) {
            case 'analytics':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Analytics Overview</h2>
                            <select value={timeRange} onChange={e => setTimeRange(e.target.value as TimeRange)} className="px-3 py-2 rounded-lg bg-white dark:bg-charcoal-light border dark:border-charcoal-light font-semibold">
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="all">All Time</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                             <AdvancedStatCard title="Total Revenue" value={`${orders[0]?.currencySymbol || '₹'}${analyticsData.totalRevenue.toFixed(2)}`} trend={analyticsData.revenueTrend.trend} trendDirection={analyticsData.revenueTrend.direction} icon={<ChartBarIcon className="w-6 h-6"/>} />
                             <AdvancedStatCard title="Total Orders" value={analyticsData.totalOrders.toLocaleString()} trend={analyticsData.ordersTrend.trend} trendDirection={analyticsData.ordersTrend.direction} icon={<ReceiptIcon className="w-6 h-6"/>} />
                             <AdvancedStatCard title="Active Users" value={analyticsData.newUsers.toLocaleString()} trend="0%" trendDirection="neutral" icon={<UsersIcon className="w-6 h-6"/>} />
                             <AdvancedStatCard title="Business Partners" value={partners.length.toLocaleString()} trend="0" trendDirection="neutral" icon={<BuildingStorefrontIcon className="w-6 h-6"/>} />
                        </div>
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2"><RevenueChart data={analyticsData.revenueChartData} currencySymbol={orders[0]?.currencySymbol || '₹'}/></div>
                            <div><OrderStatusPieChart data={analyticsData.orderStatusCounts} /></div>
                        </div>
                        <RecentActivity orders={orders} />
                    </div>
                );
            case 'users':
                return (
                    <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-4 flex justify-between items-center border-b dark:border-charcoal-light">
                            <h2 className="text-xl font-bold">Manage Users</h2>
                            <div className="flex items-center gap-2">
                                <select value={userStatusFilter} onChange={e => setUserStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-charcoal border dark:border-charcoal font-semibold text-sm">
                                    <option value="All">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                                <button onClick={handleOpenUserCreate} className="flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"><PlusIcon className="w-4 h-4"/> Add User</button>
                                <button onClick={() => downloadCSV(filteredUsers, 'users.csv')} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-charcoal-dark rounded-lg"><DownloadIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-charcoal text-xs uppercase"><tr><th className="px-6 py-3">User</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Registered On</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="border-b dark:border-charcoal-light">
                                            <td className="px-6 py-4 font-semibold">{user.name}<br/><span className="font-normal text-xs text-gray-400">{user.email}</span></td>
                                            <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span></td>
                                            <td className="px-6 py-4">{new Date(user.registeredDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2">
                                                <button onClick={() => handleViewUserDetails(user)} className="font-semibold text-blue-600 hover:underline">View</button>
                                                <button onClick={() => handleOpenUserEdit(user)} className="font-semibold text-green-600 hover:underline">Edit</button>
                                                <button onClick={() => handleUpdateUserStatus(user.email, user.status === 'active' ? 'suspended' : 'active')} className={`font-semibold ${user.status === 'active' ? 'text-yellow-600' : 'text-green-600'}`}>{user.status === 'active' ? 'Suspend' : 'Activate'}</button>
                                                <button onClick={() => handleDeleteUser(user.email)} className="font-semibold text-red-600 hover:underline">Delete</button>
                                            </div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'partners':
                 return (
                    <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-4 flex justify-between items-center border-b dark:border-charcoal-light">
                            <h2 className="text-xl font-bold">Business Partners</h2>
                            <div className="flex items-center gap-2">
                                <select value={partnerTypeFilter} onChange={e => setPartnerTypeFilter(e.target.value as BusinessType | 'All')} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-charcoal border dark:border-charcoal font-semibold text-sm">
                                    <option value="All">All Types</option><option>Restaurant</option><option>Grocery Store</option><option>Pharmacy</option>
                                </select>
                                <select value={partnerStatusFilter} onChange={e => setPartnerStatusFilter(e.target.value as 'All' | 'Active' | 'Inactive')} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-charcoal border dark:border-charcoal font-semibold text-sm">
                                    <option value="All">All Statuses</option><option>Active</option><option>Inactive</option>
                                </select>
                                <button onClick={handleOpenPartnerCreate} className="flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"><PlusIcon className="w-4 h-4"/> Add Partner</button>
                                <button onClick={() => downloadCSV(filteredPartners, 'partners.csv')} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-charcoal-dark rounded-lg"><DownloadIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-charcoal text-xs uppercase"><tr><th className="px-6 py-3">Partner Name</th><th className="px-6 py-3">Type</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Member Since</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                                <tbody>
                                    {filteredPartners.map(p => (
                                        <tr key={p.id} className="border-b dark:border-charcoal-light">
                                            <td className="px-6 py-4 font-semibold">{p.businessName}</td>
                                            <td className="px-6 py-4">{p.businessType}</td>
                                            <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${p.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{p.status}</span></td>
                                            <td className="px-6 py-4">{new Date(p.memberSince).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2">
                                                <button onClick={() => handleOpenPartnerEdit(p)} className="font-semibold text-green-600 hover:underline">Edit</button>
                                                <button onClick={() => handleDeletePartner(p.id)} className="font-semibold text-red-600 hover:underline">Delete</button>
                                            </div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'deliveryPartners':
                return (
                    <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-4 flex justify-between items-center border-b dark:border-charcoal-light">
                            <h2 className="text-xl font-bold">Delivery Partners</h2>
                            <div className="flex items-center gap-2">
                                <div className="relative"><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input type="text" value={deliveryPartnerSearch} onChange={e => setDeliveryPartnerSearch(e.target.value)} placeholder="Search partners..." className="pl-9 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-charcoal border dark:border-charcoal font-semibold text-sm w-48"/></div>
                                <button onClick={handleOpenDeliveryPartnerCreate} className="flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"><PlusIcon className="w-4 h-4"/> Add Rider</button>
                                <button onClick={() => downloadCSV(filteredDeliveryPartners, 'delivery_partners.csv')} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-charcoal-dark rounded-lg"><DownloadIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-charcoal text-xs uppercase"><tr><th className="px-6 py-3">Partner</th><th className="px-6 py-3">Vehicle</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Total Earnings</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                                <tbody>
                                    {filteredDeliveryPartners.map(p => (
                                        <tr key={p.id} className="border-b dark:border-charcoal-light">
                                            <td className="px-6 py-4 font-semibold">{p.name}</td><td className="px-6 py-4">{p.vehicleType}</td>
                                            <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${p.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{p.status}</span></td>
                                            <td className="px-6 py-4 font-semibold text-green-600">{orders[0]?.currencySymbol || '₹'}{p.totalEarnings.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2">
                                                <button onClick={() => handleOpenDeliveryPartnerEdit(p)} className="font-semibold text-green-600 hover:underline">Edit</button>
                                                <button onClick={() => handleUpdateDeliveryPartnerStatus(p.id, p.status === 'Active' ? 'Inactive' : 'Active')} className={`font-semibold ${p.status === 'Active' ? 'text-yellow-600' : 'text-green-600'}`}>{p.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                                                <button onClick={() => handleDeleteDeliveryPartner(p.id)} className="font-semibold text-red-600 hover:underline">Delete</button>
                                            </div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-4 flex justify-between items-center border-b dark:border-charcoal-light">
                             <h2 className="text-xl font-bold">All Orders</h2>
                             <div className="flex items-center gap-2">
                                <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value as OrderStatus | 'All')} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-charcoal border dark:border-charcoal font-semibold text-sm">
                                    <option value="All">All Statuses</option><option>Processing</option><option>Out for Delivery</option><option>Delivered</option>
                                </select>
                                <button onClick={() => downloadCSV(filteredOrders, 'orders.csv')} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-charcoal-dark rounded-lg"><DownloadIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                         <div className="overflow-x-auto">
                           <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-charcoal text-xs uppercase"><tr><th className="px-6 py-3">Order ID</th><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Restaurant</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                                <tbody>
                                    {filteredOrders.map(o => (
                                        <tr key={o.id} className="border-b dark:border-charcoal-light">
                                            <td className="px-6 py-4 font-bold">#{o.id}</td>
                                            <td className="px-6 py-4">{o.customerName}</td>
                                            <td className="px-6 py-4">{partners.find(p => p.id === o.restaurantId)?.businessName || 'N/A'}</td>
                                            <td className="px-6 py-4 font-semibold">{o.currencySymbol}{o.totalAmount.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <select value={o.status} onChange={e => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)} className={`text-xs font-bold rounded-full border-none appearance-none p-1 pr-6 ${o.status === 'Delivered' ? 'bg-green-100 text-green-800' : o.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    <option>Processing</option><option>Out for Delivery</option><option>Delivered</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-right"><button onClick={() => handleDeleteOrder(o.id)} className="font-semibold text-red-600 hover:underline">Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
        }
    };
    
    const NavButton: React.FC<{ tab: AdminTab; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
        <button onClick={() => setActiveTab(tab)} className={`flex items-center gap-3 px-4 py-2 font-semibold rounded-lg transition-colors ${activeTab === tab ? 'bg-brand-chakra-blue/10 text-brand-chakra-blue' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal'}`}>{icon}{label}</button>
    );
    
    return (
        <div className="bg-gray-100 dark:bg-charcoal min-h-screen">
             <header className="bg-white dark:bg-charcoal-light shadow-md sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div><h1 className="text-2xl font-bold">Admin Panel</h1><p className="text-gray-500 dark:text-gray-400">TownPlate Management</p></div>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 transition"><LogoutIcon className="h-5 h-5"/> Logout</button>
                </div>
            </header>
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="lg:w-64 flex-shrink-0">
                        <nav className="p-4 bg-white dark:bg-charcoal-light rounded-2xl shadow-lg space-y-2">
                           <NavButton tab="analytics" icon={<ChartBarIcon className="w-5 h-5"/>} label="Analytics"/>
                           <NavButton tab="users" icon={<UsersIcon className="w-5 h-5"/>} label="Users"/>
                           <NavButton tab="partners" icon={<BuildingStorefrontIcon className="w-5 h-5"/>} label="Partners"/>
                           <NavButton tab="deliveryPartners" icon={<CourierIcon className="w-5 h-5"/>} label="Delivery"/>
                           <NavButton tab="orders" icon={<ReceiptIcon className="w-5 h-5"/>} label="Orders"/>
                        </nav>
                    </aside>
                    <main className="flex-grow">
                        {renderContent()}
                    </main>
                </div>
            </div>
            {isUserDetailsModalOpen && <UserDetailsModal isOpen={isUserDetailsModalOpen} onClose={() => setIsUserDetailsModalOpen(false)} user={selectedUser}/>}
            {isUserEditModalOpen && <UserEditModal isOpen={isUserEditModalOpen} onClose={() => setIsUserEditModalOpen(false)} onSave={handleSaveUser} userToEdit={editingUser}/>}
            {isPartnerEditModalOpen && <PartnerEditModal isOpen={isPartnerEditModalOpen} onClose={() => setIsPartnerEditModalOpen(false)} onSave={handleSavePartner} partnerToEdit={editingPartner}/>}
            {isDeliveryPartnerEditModalOpen && <DeliveryPartnerEditModal isOpen={isDeliveryPartnerEditModalOpen} onClose={() => setIsDeliveryPartnerEditModalOpen(false)} onSave={handleSaveDeliveryPartner} partnerToEdit={editingDeliveryPartner}/>}
        </div>
    );
};

export default AdminDashboardPage;