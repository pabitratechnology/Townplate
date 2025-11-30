import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import PageHeader from '../components/PageHeader';
import { StarIcon, CheckCircleIcon } from '../components/IconComponents';

const quizQuestions = [
    {
        question: "It's Friday night. What's your ideal dinner?",
        options: [
            "A gourmet, multi-course meal from a top-rated restaurant.",
            "Comfort food! A cheesy pizza or a big bowl of pasta.",
            "Something quick, healthy, and easy, like a salad or a wrap.",
            "An adventurous new cuisine I've never tried before."
        ]
    },
    {
        question: "When you go grocery shopping, you primarily buy:",
        options: [
            "Fresh, organic produce and artisanal ingredients.",
            "The essentials, plus some guilty-pleasure snacks.",
            "Meal-prep staples: chicken breast, rice, and lots of veggies.",
            "Whatever looks interesting and is on sale."
        ]
    },
    {
        question: "Your go-to drink with a meal is:",
        options: [
            "A perfectly paired wine or craft beer.",
            "A classic soda or a milkshake.",
            "Water or unsweetened iced tea.",
            "An exotic fruit juice or a unique imported beverage."
        ]
    },
    {
        question: "How do you feel about cooking?",
        options: [
            "It's a passion. I love experimenting with complex recipes.",
            "I enjoy it, but I stick to simple, familiar dishes.",
            "It's a necessity. I prefer quick and efficient meals.",
            "I'd rather order in and try something new."
        ]
    },
    {
        question: "What's your dessert philosophy?",
        options: [
            "A sophisticated, dark chocolate creation or a cheese platter.",
            "Something decadent and classic, like a brownie sundae.",
            "A piece of fruit or a small bowl of yogurt.",
            "Whatever the most popular local sweet is."
        ]
    }
];

type QuizState = 'start' | 'playing' | 'loading' | 'result';

interface Result {
    title: string;
    description: string;
}

const QuizPage: React.FC = () => {
    const [quizState, setQuizState] = useState<QuizState>('start');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [result, setResult] = useState<Result | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Foodie Persona Quiz - TownPlate";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Take our fun and quick AI-powered quiz to discover your unique foodie persona. What does your plate say about you?");
        }
    }, []);

    const handleStartQuiz = () => {
        setQuizState('playing');
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setResult(null);
        setError(null);
    };

    const handleAnswerSelect = (answer: string) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            fetchResults(newAnswers);
        }
    };

    const fetchResults = async (finalAnswers: string[]) => {
        setQuizState('loading');
        setError(null);
        try {
            // FIX: Using process.env.API_KEY as per guidelines.
            const apiKey = process.env.API_KEY || '';
            if (!apiKey) {
                throw new Error("API key not found.");
            }
            const ai = new GoogleGenAI({ apiKey });
            
            const formattedAnswers = finalAnswers.map((answer, index) => 
                `Question ${index + 1}: "${quizQuestions[index].question}"\nAnswer: "${answer}"`
            ).join('\n\n');

            const prompt = `
                Based on the following quiz answers, create a fun, positive, and insightful foodie persona for a user.

                Quiz Answers:
                ${formattedAnswers}

                Your response should be in two parts:
                1. A catchy, descriptive title for the persona. The title must start with "You are the". For example: "You are the Culinary Explorer" or "You are the Comfort Food Connoisseur".
                2. A short, engaging, one-paragraph description of this foodie persona, explaining their tastes and habits based on their answers.

                Please format the response with the title on the first line, followed by a newline, and then the description paragraph. Do not add any other text, formatting, or markdown.
                
                Example:
                You are the Gourmet Guru
                You have a refined palate and appreciate the finer things in life. For you, food is an art form, a multi-sensory experience to be savored. From artisanal ingredients to perfectly paired wines, you seek out culinary excellence and aren't afraid to experiment with complex flavors to create a masterpiece in your own kitchen.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const text = response.text.trim();
            const lines = text.split('\n');
            const title = lines[0] || "Your Foodie Persona";
            const description = lines.slice(1).join('\n').trim() || "We've analyzed your results!";

            setResult({ title, description });
            setQuizState('result');

        } catch (e) {
            console.error("Gemini API call failed", e);
            setError("Oops! We couldn't generate your persona. Please check your API key or try again later.");
            setQuizState('result'); // Still go to result screen to show error
        }
    };
    
    const renderContent = () => {
        switch (quizState) {
            case 'start':
                return (
                    <div className="text-center">
                        <StarIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold mb-2">Discover Your Foodie Persona!</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">Answer 5 quick questions to find out what kind of foodie you are.</p>
                        <button
                            onClick={handleStartQuiz}
                            className="px-8 py-3 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-md shadow-brand-chakra-blue/20"
                        >
                            Start Quiz
                        </button>
                    </div>
                );

            case 'playing':
                const question = quizQuestions[currentQuestionIndex];
                return (
                    <div className="animate-fade-in">
                        <p className="font-bold text-center text-brand-chakra-blue mb-2">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
                        <h2 className="text-2xl font-bold text-center mb-6">{question.question}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(option)}
                                    className="w-full text-left p-4 rounded-lg bg-gray-100 dark:bg-charcoal-light hover:bg-brand-chakra-blue/10 dark:hover:bg-brand-chakra-blue/20 border-2 border-transparent hover:border-brand-chakra-blue transition-all"
                                >
                                    <span className="font-semibold">{option}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            
            case 'loading':
                 return (
                    <div className="flex flex-col items-center justify-center text-center h-64">
                        <div className="w-16 h-16 border-4 border-brand-chakra-blue border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg font-bold">Crafting your persona...</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Analyzing your delicious choices.</p>
                    </div>
                );
            
            case 'result':
                return (
                     <div className="text-center animate-fade-in">
                        {error ? (
                            <>
                                <h2 className="text-2xl font-bold mb-4 text-red-500">An Error Occurred</h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-8">{error}</p>
                            </>
                        ) : result && (
                            <>
                                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                                <h2 className="text-3xl font-black text-brand-chakra-blue mb-4">{result.title}</h2>
                                <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">{result.description}</p>
                            </>
                        )}
                        <button
                            onClick={handleStartQuiz}
                            className="mt-8 px-8 py-3 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition-transform transform hover:scale-105"
                        >
                            Retake Quiz
                        </button>
                    </div>
                );
        }
    };

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Foodie Quiz' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Foodie Quiz"
                subtitle="What does your plate say about you?"
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto bg-white dark:bg-charcoal rounded-2xl shadow-xl p-8">
                   {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;