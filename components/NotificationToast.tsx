
import React, { useEffect } from 'react';
import { CheckCircleIcon } from './IconComponents';

interface NotificationToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, onClose, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div 
            className="fixed top-5 right-5 z-[100] w-full max-w-sm p-4 bg-white dark:bg-charcoal-light rounded-xl shadow-2xl border border-gray-200 dark:border-charcoal flex items-center animate-fade-in-up"
            role="alert"
        >
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 rounded-full">
                <CheckCircleIcon className="w-6 h-6"/>
            </div>
            <div className="ml-3 flex-grow">
                <p className="font-bold text-charcoal dark:text-white">New Order!</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
            </div>
            <button onClick={onClose} className="ml-2 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-charcoal transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
        </div>
    );
};

export default NotificationToast;
