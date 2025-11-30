import React from 'react';
import { HomeService } from '../types';
import { WrenchIcon, BoltIcon, PaintBrushIcon, SparklesIcon } from '../components/IconComponents';

export const homeServices: HomeService[] = [
    { 
        id: 501, 
        name: "Plumbing", 
        description: "Expert solutions for all your plumbing needs.", 
        icon: React.createElement(WrenchIcon, { className: "h-10 w-10" }) 
    },
    { 
        id: 502, 
        name: "Electrical", 
        description: "Safe and certified electrical services.", 
        icon: React.createElement(BoltIcon, { className: "h-10 w-10" }) 
    },
    { 
        id: 503, 
        name: "Painting", 
        description: "Professional home and office painting.", 
        icon: React.createElement(PaintBrushIcon, { className: "h-10 w-10" }) 
    },
    { 
        id: 504, 
        name: "Home Cleaning", 
        description: "Deep cleaning services for a spotless home.", 
        icon: React.createElement(SparklesIcon, { className: "h-10 w-10" }) 
    },
    { 
        id: 505, 
        name: "Appliance Repair", 
        description: "Fixing all major home appliances.", 
        icon: React.createElement(WrenchIcon, { className: "h-10 w-10" }) 
    },
    { 
        id: 506, 
        name: "Pest Control", 
        description: "Effective pest control for a safe environment.", 
        icon: React.createElement(SparklesIcon, { className: "h-10 w-10" })
    },
];