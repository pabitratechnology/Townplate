import React, { useEffect } from 'react';
import PageHeader from '../../components/PageHeader';

const teamMembers = [
    { name: 'Alice Johnson', role: 'Founder & CEO', imageUrl: 'https://picsum.photos/200/200?random=1' },
    { name: 'Bob Williams', role: 'Chief Technology Officer', imageUrl: 'https://picsum.photos/200/200?random=2' },
    { name: 'Charlie Brown', role: 'Head of Operations', imageUrl: 'https://picsum.photos/200/200?random=3' },
    { name: 'Diana Miller', role: 'Head of Marketing', imageUrl: 'https://picsum.photos/200/200?random=4' },
    { name: 'Ethan Davis', role: 'Lead Product Designer', imageUrl: 'https://picsum.photos/200/200?random=5' },
    { name: 'Fiona Garcia', role: 'Head of Partnerships', imageUrl: 'https://picsum.photos/200/200?random=6' },
];

const TeamPage: React.FC = () => {
    
    useEffect(() => {
        document.title = "Our Team - TownPlate";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Meet the passionate and dedicated team behind TownPlate, driving the future of hyperlocal delivery and services.");
        }
    }, []);

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Our Team' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Our Team"
                subtitle="The passionate minds driving the TownPlate revolution."
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member) => (
                        <div key={member.name} className="text-center bg-white dark:bg-charcoal-light rounded-2xl shadow-lg p-6 transform hover:-translate-y-2 transition-transform duration-300">
                            <img 
                                src={member.imageUrl} 
                                alt={member.name}
                                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-brand-chakra-blue/20"
                            />
                            <h3 className="text-xl font-bold">{member.name}</h3>
                            <p className="text-brand-chakra-blue">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamPage;