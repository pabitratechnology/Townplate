
import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { EmailIcon, PasswordIcon, ExclamationCircleIcon } from '../../components/IconComponents';

const AdminLoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    useEffect(() => {
        document.title = "Admin Login - TownPlate";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Access the TownPlate administrator dashboard to manage the platform.");
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (email === 'admin@townplate.com' && password === 'admin123') {
            localStorage.setItem('townplate-is-admin-logged-in', 'true');
            window.location.hash = '#/admin/dashboard';
        } else {
            setError('Invalid administrator credentials.');
        }
    };
    
    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Admin Login' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Administrator Access"
                subtitle="TownPlate Internal Management Portal"
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-sm mx-auto bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="admin-email">Admin User</label>
                            <div className="relative">
                                <EmailIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input id="admin-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@townplate.com" className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="admin-password">Password</label>
                            <div className="relative">
                                <PasswordIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input id="admin-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition" />
                            </div>
                             <p className="text-xs text-gray-500 mt-1 text-center">Hint: Use password `admin123`.</p>
                        </div>
                         {error && (
                             <div className="flex items-center text-sm text-red-500 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                         <button
                            type="submit"
                            className="w-full mt-4 py-3.5 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-md shadow-brand-chakra-blue/20"
                        >
                            Secure Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
