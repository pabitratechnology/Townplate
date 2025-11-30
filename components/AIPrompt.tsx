import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { AIFoodSuggestion } from '../types';
import { SparklesIcon } from './IconComponents';

const AIPrompt: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [suggestions, setSuggestions] = useState<AIFoodSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setSuggestions([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const modelResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a helpful AI food recommender for an app called TownPlate. A user wants suggestions based on their craving: "${prompt}". Suggest 3 dishes. For each dish, provide a "name" and a short, enticing "description".`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                description: { type: Type.STRING }
                            },
                            required: ["name", "description"]
                        }
                    }
                }
            });
            
            const parsedSuggestions = JSON.parse(modelResponse.text);
            setSuggestions(parsedSuggestions);

        } catch (err) {
            console.error("Gemini API Error:", err);
            setError("Oops! Couldn't get suggestions. Please try a different prompt.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchClick = (dishName: string) => {
        window.location.hash = `#/search?q=${encodeURIComponent(dishName)}`;
    };

    return (
        <section className="py-16 bg-gray-50 dark:bg-charcoal-light">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <SparklesIcon className="w-12 h-12 text-brand-chakra-blue mx-auto mb-4"/>
                    <h2 className="text-3xl font-black mb-2">Don't know what to eat?</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Tell us what you're craving, and our AI will suggest something delicious!</p>
                    
                    <form onSubmit={handleGenerate} className="relative">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'something cheesy', 'spicy noodles', 'a healthy lunch'..."
                            className="w-full text-lg pl-6 pr-32 py-4 rounded-full border-2 border-gray-200 dark:border-charcoal focus:outline-none focus:ring-4 focus:ring-brand-chakra-blue/50 bg-white dark:bg-charcoal text-charcoal dark:text-white transition-all duration-300 placeholder:text-gray-500"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-md shadow-brand-chakra-blue/30 disabled:bg-gray-400"
                        >
                            Suggest
                        </button>
                    </form>

                    <div className="mt-8 min-h-[150px] flex items-center justify-center">
                        {isLoading && <div className="w-12 h-12 border-4 border-brand-chakra-blue border-t-transparent rounded-full animate-spin"></div>}
                        {error && <p className="text-red-500 font-semibold">{error}</p>}
                        
                        {!isLoading && suggestions.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full animate-fade-in">
                                {suggestions.map((s, i) => (
                                    <div key={i} className="bg-white dark:bg-charcoal p-4 rounded-xl shadow-lg text-left flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-lg">{s.name}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{s.description}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleSearchClick(s.name)}
                                            className="mt-3 w-full text-sm font-bold text-brand-chakra-blue hover:underline"
                                        >
                                            Find this dish &rarr;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIPrompt;