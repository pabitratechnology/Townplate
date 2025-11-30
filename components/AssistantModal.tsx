import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { PaperAirplaneIcon, SparklesIcon } from './IconComponents';

interface AssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AssistantModal: React.FC<AssistantModalProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Initialize chat session
            try {
                // FIX: Using process.env.API_KEY as per guidelines.
                const apiKey = process.env.API_KEY || '';
                if (!apiKey) {
                    throw new Error("API key not found.");
                }
                const ai = new GoogleGenAI({ apiKey });
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: "You are a friendly and helpful assistant for TownPlate, a food and essentials delivery app. Help users discover food, understand the app's features, or answer general questions concisely. Keep your answers brief and to the point.",
                    },
                });
                setMessages([{ sender: 'ai', text: "Hello! I'm your TownPlate assistant. Ask me anything, like 'What's a good spicy dish?' or 'How do I see my past orders?'" }]);
            } catch (error) {
                console.error("Failed to initialize Gemini:", error);
                setMessages([{ sender: 'ai', text: "Sorry, the assistant is currently unavailable. Please ensure the API key is configured correctly." }]);
            }
        } else {
            // Reset on close
            setMessages([]);
            setInput('');
            setIsLoading(false);
            chatRef.current = null;
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading || !chatRef.current) return;

        const newMessages: Message[] = [...messages, { sender: 'user', text: trimmedInput }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatRef.current.sendMessage({ message: trimmedInput });
            const aiResponse = response.text;
            setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
        } catch (error) {
            console.error("Gemini send message error:", error);
            setMessages([...newMessages, { sender: 'ai', text: "I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl w-full max-w-lg m-4 h-[70vh] flex flex-col relative animate-slide-in"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-charcoal">
                    <h2 className="text-xl font-bold flex items-center gap-2"><SparklesIcon className="w-6 h-6 text-brand-chakra-blue"/> AI Assistant</h2>
                    <button onClick={onClose} aria-label="Close assistant" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-charcoal-dark transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-brand-chakra-blue/20 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-brand-chakra-blue"/></div>}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'ai' ? 'bg-gray-100 dark:bg-charcoal' : 'bg-brand-chakra-blue text-white'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-2.5">
                             <div className="w-8 h-8 rounded-full bg-brand-chakra-blue/20 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-brand-chakra-blue"/></div>
                             <div className="max-w-xs p-3 rounded-2xl bg-gray-100 dark:bg-charcoal">
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-charcoal">
                     <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="w-full pl-4 pr-12 py-3 rounded-full bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue"
                            disabled={isLoading}
                        />
                        <button type="submit" aria-label="Send message" disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-80 transition disabled:bg-gray-400">
                            <PaperAirplaneIcon className="h-5 w-5"/>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssistantModal;