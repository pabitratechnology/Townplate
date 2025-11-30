

import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { HomeServiceIcon, GroceryIcon, ReceiptIcon, UserIcon } from './IconComponents';

interface MobileBottomNavProps {
    currentUser: User | null;
    onLoginClick: () => void;
}

const NavItem: React.FC<{ href: string; label: string; icon: React.ReactNode; isActive: boolean }> = ({ href, label, icon, isActive }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (window.location.hash !== href) {
            window.location.hash = href;
        }
    };

    return (
        <a 
            href={href} 
            onClick={handleClick}
            className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? 'text-brand-chakra-blue' : 'text-gray-600 dark:text-gray-400'}`}
        >
            {icon}
            <span className="text-xs font-bold mt-1">{label}</span>
        </a>
    );
};

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentUser, onLoginClick }) => {
    const [activeRoute, setActiveRoute] = useState(window.location.hash || '#/');

    useEffect(() => {
        const handleHashChange = () => {
            setActiveRoute(window.location.hash || '#/');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    const handleProfileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (currentUser) {
            window.location.hash = '#/profile';
        } else {
            onLoginClick();
        }
    }

    const navItems = [
        { href: '#/', label: 'Home', icon: <HomeServiceIcon className="h-6 w-6" /> },
        { href: '#/food', label: 'Stores', icon: <GroceryIcon className="h-6 w-6" /> },
        { href: '#/orders', label: 'Orders', icon: <ReceiptIcon className="h-6 w-6" /> },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-charcoal/80 backdrop-blur-lg border-t border-gray-200 dark:border-charcoal-light flex justify-around items-center z-40">
            {navItems.map(item => (
                 <NavItem 
                    key={item.href}
                    {...item}
                    isActive={activeRoute === item.href || (item.href === '#/' && activeRoute === '')}
                 />
            ))}
             <a 
                href="#/profile" 
                onClick={handleProfileClick}
                className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${(activeRoute === '#/profile') ? 'text-brand-chakra-blue' : 'text-gray-600 dark:text-gray-400'}`}
            >
                <UserIcon className="h-6 w-6" />
                <span className="text-xs font-bold mt-1">Profile</span>
            </a>
        </div>
    );
};

export default MobileBottomNav;