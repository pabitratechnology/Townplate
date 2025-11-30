import React, { useEffect } from 'react';
import PageHeader from '../../components/PageHeader';

const jobOpenings = [
    { title: 'Senior Frontend Engineer', location: 'Remote', department: 'Engineering' },
    { title: 'Product Manager - Logistics', location: 'New York, USA', department: 'Product' },
    { title: 'Digital Marketing Specialist', location: 'Bhubaneswar, India', department: 'Marketing' },
    { title: 'Operations Manager', location: 'London, UK', department: 'Operations' },
];

const CareersPage: React.FC = () => {

    useEffect(() => {
        document.title = "Careers - Join TownPlate";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Explore job openings at TownPlate. Join our mission to build the future of urban convenience and hyperlocal delivery.");
        }
    }, []);

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Careers' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Careers at TownPlate"
                subtitle="Join our team and help us build the future of urban convenience."
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold mb-2">Current Openings</h2>
                         <p className="text-lg text-gray-600 dark:text-gray-300">We're looking for talented individuals to join our mission.</p>
                    </div>
                    <div className="space-y-6">
                        {jobOpenings.map((job) => (
                            <div key={job.title} className="bg-white dark:bg-charcoal-light rounded-xl shadow-md p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                               <div>
                                    <h3 className="text-xl font-bold text-brand-chakra-blue">{job.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300">{job.department} &middot; {job.location}</p>
                               </div>
                                <a href="#" className="mt-4 sm:mt-0 px-6 py-2 font-bold rounded-full bg-brand-chakra-blue/10 text-brand-chakra-blue hover:bg-brand-chakra-blue hover:text-white transition">
                                    Apply Now
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareersPage;