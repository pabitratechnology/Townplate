
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { User } from '../types';
import { UserIcon, EmailIcon, PasswordIcon, GoogleIcon } from './IconComponents';

interface AuthModalProps {
    onClose: () => void;
    onAuthSuccess: () => void;
}

type AuthMode = 'login' | 'signup';

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuthSuccess }) => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (mode === 'signup') {
                if (!name.trim()) {
                    setError("Please enter your full name.");
                    setIsLoading(false);
                    return;
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
                onAuthSuccess();
            } else { // Login mode
                await signInWithEmailAndPassword(auth, email, password);
                onAuthSuccess();
            }
        } catch (err) {
            const error = err as { code: string };
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('This email address is already taken.');
                    break;
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.');
                    break;
                case 'auth/weak-password':
                    setError('Password must be at least 6 characters long.');
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    setError('Invalid email or password. Please try again.');
                    break;
                default:
                    setError('An unexpected error occurred. Please try again.');
                    console.error("Firebase Auth Error: ", error);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGoogleSignIn = async () => {
        setError(null);
        setIsLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            onAuthSuccess();
        } catch (err) {
            console.error("Google Sign-In Error:", err);
            setError("Could not sign in with Google. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = (newMode: AuthMode) => {
        setMode(newMode);
        setError(null);
        setName('');
        setEmail('');
        setPassword('');
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl w-full max-w-sm m-4 p-8 relative animate-slide-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} aria-label="Close authentication" className="absolute top-4 right-4 text-gray-500 hover:text-charcoal dark:hover:text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <h2 className="text-2xl font-bold mb-2 text-center">{mode === 'login' ? 'Welcome Back!' : 'Create an Account'}</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    {mode === 'login' ? 'Login to continue your journey.' : 'Get started in just a few clicks.'}
                </p>

                <div className="flex bg-gray-100 dark:bg-charcoal p-1 rounded-full mb-6">
                    <button
                        onClick={() => switchMode('login')}
                        className={`w-1/2 py-2 text-center font-bold transition-all text-sm rounded-full ${mode === 'login' ? 'bg-white dark:bg-charcoal-light shadow' : 'text-gray-500'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => switchMode('signup')}
                        className={`w-1/2 py-2 text-center font-bold transition-all text-sm rounded-full ${mode === 'signup' ? 'bg-white dark:bg-charcoal-light shadow' : 'text-gray-500'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Full Name"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue"
                            />
                        </div>
                    )}
                     <div className="relative">
                        <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email Address"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue"
                        />
                    </div>
                     <div className="relative">
                        <PasswordIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            placeholder="Password"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500 text-center animate-fade-in">{error}</p>}

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 py-3 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-md shadow-brand-chakra-blue/20 disabled:bg-gray-400 disabled:scale-100 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (mode === 'login' ? 'Log In' : 'Create Account')}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-200 dark:border-charcoal"></div>
                    <span className="mx-4 text-xs font-bold text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-200 dark:border-charcoal"></div>
                </div>

                <button 
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg bg-white dark:bg-charcoal-light border border-gray-200 dark:border-charcoal hover:bg-gray-50 dark:hover:bg-charcoal transition font-semibold disabled:opacity-50"
                >
                    <GoogleIcon className="w-5 h-5 mr-3" />
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default AuthModal;