


import React, { useState, useRef, useEffect } from 'react';
import { AppTheme, Location, User } from '../types';
import { LogoIcon, SunIcon, MoonIcon, LocationIcon, SearchIcon, CartIcon, UserIcon, LogoutIcon, ReceiptIcon } from './IconComponents';

interface HeaderProps {
  theme: AppTheme;
  toggleTheme: () => void;
  location: Location;
  onLocationClick: () => void;
  cartItemCount: number;
  onCartClick: () => void;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onSearch: (term: string) => void;
}

const UserProfile: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
        e.preventDefault();
        setIsOpen(false);
        if (window.location.hash === hash) {
            window.scrollTo(0, 0);
        } else {
            window.location.hash = hash;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-charcoal-light transition">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name.replace(' ','+')}&background=random`} alt="User avatar" className="h-7 w-7 rounded-full object-cover" />
                <span className="hidden sm:inline text-sm font-bold">Hello, {user.name.split(' ')[0]}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-charcoal-light rounded-lg shadow-xl py-1 animate-fade-in z-10">
                    <a
                        href="#/profile"
                        onClick={(e) => handleLinkClick(e, '#/profile')}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-charcoal"
                    >
                        <UserIcon className="h-5 w-5 mr-2" />
                        My Profile
                    </a>
                     <a
                        href="#/orders"
                        onClick={(e) => handleLinkClick(e, '#/orders')}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-charcoal"
                    >
                        <ReceiptIcon className="h-5 w-5 mr-2" />
                        Order History
                    </a>
                    <button
                        onClick={() => {
                            onLogout();
                            setIsOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-charcoal"
                    >
                        <LogoutIcon className="h-5 w-5 mr-2" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, location, onLocationClick, cartItemCount, onCartClick, currentUser, onLoginClick, onLogout, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const targetHash = '#/';
      if (window.location.hash === targetHash || window.location.hash === '') {
          window.scrollTo(0, 0);
      } else {
          window.location.hash = targetHash;
      }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(searchQuery);
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-charcoal/80 backdrop-blur-lg shadow-sm dark:shadow-charcoal-light">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <a href="#/" onClick={handleLogoClick} aria-label="Back to homepage">
            <LogoIcon className="h-8 text-brand-saffron" />
          </a>
          <div 
            onClick={onLocationClick}
            className="hidden md:flex items-center border-l border-gray-200 dark:border-gray-700 pl-4 cursor-pointer group"
          >
            <LocationIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-colors group-hover:text-brand-chakra-blue dark:group-hover:text-brand-chakra-blue" />
            <div className="ml-2">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 transition-colors group-hover:text-brand-chakra-blue dark:group-hover:text-brand-chakra-blue">Your Location</span>
              <p className="text-sm font-bold transition-colors group-hover:text-brand-chakra-blue dark:group-hover:text-brand-chakra-blue">
                {location ? `${location.city}, ${location.country}` : 'Select Location'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-grow max-w-xl items-center relative">
            <SearchIcon className="absolute left-4 h-5 w-5 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search restaurants, groceries, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-full bg-gray-100 dark:bg-charcoal-light border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition placeholder:text-gray-600 dark:placeholder:text-gray-400"
            />
        </form>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button onClick={onCartClick} className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-charcoal-light transition">
            <CartIcon className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-brand-saffron text-white text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                {cartItemCount}
              </span>
            )}
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-charcoal-light transition">
            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6 text-yellow-300" />}
          </button>
          {currentUser ? (
              <UserProfile user={currentUser} onLogout={onLogout} />
          ) : (
            <button 
                onClick={onLoginClick}
                className="px-5 py-2.5 text-sm font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-md shadow-brand-chakra-blue/20"
            >
                Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;