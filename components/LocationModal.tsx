import React, { useState } from 'react';
import { Location } from '../types';
import { SearchIcon, ExclamationCircleIcon } from './IconComponents';
import { GoogleGenAI, Type } from '@google/genai';


interface LocationGroup {
    title: string;
    locations: Location[];
}

const odishaLocations: Location[] = [
    // Prioritized cities
    { city: 'Bhubaneswar', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Cuttack', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Rourkela', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Sambalpur', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Puri', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Khordha', country: 'India', currency: 'INR', currencySymbol: '₹' },
    // All 30 districts (alphabetical, excluding duplicates from above)
    { city: 'Angul', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Balangir', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Balasore', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Bargarh', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Bhadrak', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Boudh', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Deogarh', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Dhenkanal', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Gajapati', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Ganjam', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Jagatsinghpur', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Jajpur', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Jharsuguda', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Kalahandi', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Kandhamal', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Kendrapara', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Keonjhar', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Koraput', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Malkangiri', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Mayurbhanj', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Nabarangpur', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Nayagarh', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Nuapada', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Rayagada', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Subarnapur', country: 'India', currency: 'INR', currencySymbol: '₹' },
    { city: 'Sundargarh', country: 'India', currency: 'INR', currencySymbol: '₹' },
];


interface LocationModalProps {
    onSelectLocation: (location: Location) => void;
    onClose: () => void;
    currentLocation: Location;
}

const LocationModal: React.FC<LocationModalProps> = ({ onSelectLocation, onClose, currentLocation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleValidateAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setErrorMessage('Please enter an address.');
            setValidationStatus('error');
            return;
        }

        setValidationStatus('validating');
        setErrorMessage('');

        try {
            // FIX: Using process.env.API_KEY as per guidelines.
            const apiKey = process.env.API_KEY || '';
            if (!apiKey) {
                throw new Error("API key not found.");
            }
            const ai = new GoogleGenAI({ apiKey });
            
            const prompt = `
                You are an address verification expert. A user has provided an address string.
                Your task is to validate this address and extract the city and country.
                The address provided is: "${searchQuery}"
                If the address is valid and you can clearly identify a city and country, respond with a JSON object.
                If the address seems invalid or ambiguous, respond with a JSON object indicating it's invalid.
                Infer the country if only a major city is provided (e.g., "London" -> "United Kingdom").
                Respond ONLY with a JSON object following this schema:
                {
                  "isValid": boolean,
                  "city": string,
                  "country": string,
                  "reason": string
                }
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            isValid: { type: Type.BOOLEAN },
                            city: { type: Type.STRING },
                            country: { type: Type.STRING },
                            reason: { type: Type.STRING },
                        },
                        required: ['isValid', 'city', 'country', 'reason'],
                    },
                },
            });

            const validationResult = JSON.parse(response.text);

            if (validationResult.isValid && validationResult.city && validationResult.country) {
                // Find currency info from our predefined locations list, with a fallback
                const matchedLocation = odishaLocations.find(l => l.country.toLowerCase() === validationResult.country.toLowerCase());
                const currency = matchedLocation?.currency || 'INR';
                const currencySymbol = matchedLocation?.currencySymbol || '₹';
                
                const newLocation: Location = { 
                    city: validationResult.city, 
                    country: validationResult.country, 
                    currency, 
                    currencySymbol 
                };
                onSelectLocation(newLocation);
            } else {
                setErrorMessage(validationResult.reason || 'Could not validate the address. Please try again.');
                setValidationStatus('error');
            }
        } catch (error) {
            console.error("Gemini address validation error:", error);
            setErrorMessage("An error occurred while verifying the address. Please check your API key or connection.");
            setValidationStatus('error');
        }
    };


    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl w-full max-w-md m-4 p-6 relative animate-slide-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} aria-label="Close location selection" className="absolute top-4 right-4 text-gray-500 hover:text-charcoal dark:hover:text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">Enter Your Delivery Address</h2>
                
                <form onSubmit={handleValidateAddress} className="space-y-3">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (validationStatus === 'error') setValidationStatus('idle');
                            }}
                            placeholder="Enter your street, city, country..."
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition"
                        />
                    </div>
                     <button
                        type="submit"
                        disabled={validationStatus === 'validating'}
                        className="w-full flex items-center justify-center py-3 text-md font-bold rounded-lg bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100"
                    >
                        {validationStatus === 'validating' ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Verifying with AI...
                            </>
                        ) : (
                           'Verify Address'
                        )}
                    </button>
                    {validationStatus === 'error' && (
                        <div className="flex items-center text-sm text-red-500 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-200 dark:border-charcoal"></div>
                    <span className="mx-4 text-xs font-bold text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-200 dark:border-charcoal"></div>
                </div>
                 <h3 className="font-bold text-gray-500 dark:text-gray-400 px-2 text-sm uppercase mb-2">Select Your Location in Odisha</h3>

                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                    {odishaLocations.map((loc) => (
                        <button
                            key={`${loc.city}-${loc.country}`}
                            onClick={() => onSelectLocation(loc)}
                            className={`w-full text-left p-3 rounded-lg transition-colors text-md ${
                                currentLocation.city === loc.city
                                    ? 'bg-brand-chakra-blue/10 text-brand-chakra-blue dark:bg-brand-chakra-blue/20 font-bold'
                                    : 'hover:bg-gray-100 dark:hover:bg-charcoal'
                            }`}
                        >
                            {loc.city}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LocationModal;