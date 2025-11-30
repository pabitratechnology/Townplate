import React, { useRef } from 'react';
import { Order, User } from '../types';
import { LogoIcon } from './IconComponents';

interface InvoiceModalProps {
    order: Order;
    user: User;
    onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, user, onClose }) => {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const printContent = invoiceRef.current;
        if (!printContent) return;

        const newWindow = window.open('', '_blank', 'height=800,width=800');
        if (newWindow) {
            newWindow.document.write(`
                <html>
                    <head>
                        <title>Invoice #${order.id}</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            @media print {
                                .no-print { display: none !important; }
                                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                            }
                        </style>
                    </head>
                    <body class="bg-white">
                        ${printContent.innerHTML}
                    </body>
                </html>
            `);
            newWindow.document.close();
            newWindow.focus();
            setTimeout(() => {
                newWindow.print();
                newWindow.close();
            }, 500);
        }
    };
    
    const deliveryAddress = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
    const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    // These are approximations for display purposes. The final total is the source of truth.
    const taxes = subtotal * 0.1; 
    const deliveryFee = order.totalAmount - subtotal - taxes;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-gray-50 dark:bg-charcoal-dark rounded-2xl shadow-2xl w-full max-w-2xl m-4 h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-charcoal-light no-print">
                    <h2 className="text-xl font-bold text-charcoal dark:text-white">Order Invoice</h2>
                     <button onClick={onClose} aria-label="Close invoice" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-charcoal-light transition text-charcoal dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                
                <div className="flex-grow overflow-y-auto p-2 sm:p-6" >
                    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md" ref={invoiceRef}>
                        {/* Header */}
                        <div className="flex justify-between items-start pb-4 border-b">
                            <div>
                                <LogoIcon className="h-10 text-brand-saffron" />
                                <p className="text-sm text-gray-500 mt-2">Bhubaneswar, Odisha, India</p>
                            </div>
                            <div className="text-right">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">INVOICE</h1>
                                <p className="text-gray-500">#TP-{order.id}</p>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase">Billed To</h3>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                {deliveryAddress && <p className="text-sm text-gray-600">{`${deliveryAddress.street}, ${deliveryAddress.city}`}</p>}
                            </div>
                            <div className="text-right">
                                <h3 className="text-sm font-bold text-gray-500 uppercase">Date of Issue</h3>
                                <p className="font-semibold">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mt-8">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 font-bold text-gray-600 rounded-l-md">Item</th>
                                        <th className="p-2 font-bold text-gray-600 text-center">Qty</th>
                                        <th className="p-2 font-bold text-gray-600 text-right">Price</th>
                                        <th className="p-2 font-bold text-gray-600 text-right rounded-r-md">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map(item => (
                                        <tr key={item.id} className="border-b">
                                            <td className="p-2 font-semibold align-top">
                                                {item.name}
                                                {item.customizations && item.customizations.length > 0 && (
                                                    <div className="text-xs font-normal text-gray-500 pl-2">
                                                        {item.customizations.map(c => c.optionName).join(', ')}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-2 text-center align-top">{item.quantity}</td>
                                            <td className="p-2 text-right align-top">{order.currencySymbol}{item.price.toFixed(2)}</td>
                                            <td className="p-2 text-right align-top">{order.currencySymbol}{(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="mt-6 flex justify-end">
                            <div className="w-full max-w-xs space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">{order.currencySymbol}{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Fee</span>
                                    <span className="font-semibold">{order.currencySymbol}{deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Taxes</span>
                                    <span className="font-semibold">{order.currencySymbol}{taxes.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2 mt-2"></div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Grand Total</span>
                                    <span>{order.currencySymbol}{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                         <div className="mt-8 text-center text-xs text-gray-400">
                            <p>Thank you for your business!</p>
                            <p>TownPlate Inc.</p>
                        </div>
                    </div>
                </div>
                
                <footer className="p-4 bg-white dark:bg-charcoal-light border-t border-gray-200 dark:border-charcoal flex justify-end no-print">
                    <button 
                        onClick={handleDownload}
                        className="px-6 py-2.5 font-bold rounded-lg bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105"
                    >
                        Download as PDF
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default InvoiceModal;