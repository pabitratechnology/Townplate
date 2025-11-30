import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import PageHeader from '../components/PageHeader';
import { SparklesIcon } from '../components/IconComponents';

const MakeThisPage: React.FC = () => {
    const [dishName, setDishName] = useState('');
    const [recipeHtml, setRecipeHtml] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = "AI Recipe Generator - Make It Yourself - TownPlate";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Don't know what to cook? Enter any dish and our AI will generate a simple, easy-to-follow recipe for you instantly.");
        }
    }, []);

    const handleGenerateRecipe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dishName.trim()) {
            setError('Please enter a dish name.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setRecipeHtml(null);

        try {
            // FIX: Using process.env.API_KEY as per guidelines.
            const apiKey = process.env.API_KEY || '';
            if (!apiKey) {
                throw new Error("API key not found.");
            }
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `
                Generate a simple, easy-to-follow recipe for "${dishName}".
                Please format the response using only the following HTML tags:
                - <h1> for the main dish title.
                - <p> for a short description.
                - <h2> for the "Ingredients" and "Instructions" headings.
                - <ul> and <li> for the list of ingredients.
                - <ol> and <li> for the numbered list of instructions.
                Do not include any other HTML, like <html>, <body>, or <style> tags.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            setRecipeHtml(response.text);

        } catch (err) {
            console.error("Gemini API Error:", err);
            setError("Sorry, we couldn't generate a recipe right now. Please check your API key or try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Make It Yourself' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Make It Yourself"
                subtitle="Enter any dish and our AI will generate a recipe for you!"
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleGenerateRecipe} className="mb-8">
                         <div className="relative flex items-center shadow-lg rounded-full">
                            <input
                                type="text"
                                value={dishName}
                                onChange={(e) => setDishName(e.target.value)}
                                placeholder="e.g., 'Odia Dalma' or 'Spaghetti Carbonara'"
                                className="w-full text-lg pl-6 pr-40 py-4 rounded-full border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-brand-chakra-blue/50 bg-white dark:bg-charcoal-light text-charcoal dark:text-white transition-all duration-300 placeholder:text-gray-500"
                                disabled={isLoading}
                            />
                            <button 
                                type="submit" 
                                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center px-6 py-3 bg-brand-chakra-blue text-white rounded-full font-bold hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg shadow-brand-chakra-blue/30 disabled:bg-gray-400 disabled:scale-100"
                                disabled={isLoading}
                            >
                                <SparklesIcon className="h-5 w-5 mr-2" />
                                Generate
                            </button>
                        </div>
                    </form>

                    <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-xl p-8 min-h-[300px] flex items-center justify-center">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 border-4 border-brand-chakra-blue border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 font-bold">Generating your recipe...</p>
                            </div>
                        )}
                        {error && <p className="text-red-500 font-semibold">{error}</p>}
                        {!isLoading && !error && !recipeHtml && (
                            <p className="text-gray-500 dark:text-gray-400 text-center">Your generated recipe will appear here.</p>
                        )}
                        {recipeHtml && (
                             <div 
                                className="prose dark:prose-invert max-w-none text-left w-full" 
                                dangerouslySetInnerHTML={{ __html: recipeHtml }} 
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MakeThisPage;