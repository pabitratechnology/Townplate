import React from 'react';

const events = [
    {
        title: "Biryani & Kebab Fest",
        subtitle: "This Weekend Only!",
        bg: "bg-gradient-to-tr from-yellow-500 to-red-600",
        link: "#/search?q=biryani"
    },
    {
        title: "Monsoon Grocery Sale",
        subtitle: "Up to 30% Off Staples",
        bg: "bg-gradient-to-tr from-green-500 to-blue-600",
        link: "#/grocery"
    },
];

const Events: React.FC = () => (
    <section className="py-16">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-black text-center mb-10">Events & Festivals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {events.map(event => (
                    <a 
                        key={event.title} 
                        href={event.link} 
                        onClick={(e) => { e.preventDefault(); window.location.hash = event.link; }} 
                        className={`group relative p-8 rounded-2xl text-white overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 ${event.bg}`}
                    >
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black">{event.title}</h3>
                            <p className="mt-1 opacity-90">{event.subtitle}</p>
                            <span className="mt-4 inline-block font-bold group-hover:underline">Explore Now &rarr;</span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    </section>
);

export default Events;
