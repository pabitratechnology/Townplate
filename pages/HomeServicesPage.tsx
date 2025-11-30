
import React, { useState, useEffect } from 'react';
import { Location, HomeService } from '../types';
import PageHeader from '../components/PageHeader';
import { homeServices } from '../data/homeServicesData';
import { SearchIcon } from '../components/IconComponents';
import HomeServiceModal from '../components/HomeServiceModal';

interface HomeServicesPageProps {
  location: Location;
}

const ServiceCard: React.FC<{ service: HomeService; onBook: () => void; }> = ({ service, onBook }) => (
    <div className="group bg-white dark:bg-charcoal-light rounded-2xl p-6 shadow-lg hover:shadow-2xl dark:hover:shadow-brand-chakra-blue/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
        <div className="mb-4 text-brand-chakra-blue">
            {service.icon}
        </div>
        <h3 className="text-lg font-bold mb-2">{service.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">{service.description}</p>
        <button 
            onClick={onBook}
            className="mt-4 w-full px-4 py-2 text-sm font-bold rounded-full bg-brand-chakra-blue/10 text-brand-chakra-blue border-2 border-transparent hover:bg-brand-chakra-blue hover:text-white transition"
        >
            Book Now
        </button>
    </div>
);


const HomeServicesPage: React.FC<HomeServicesPageProps> = ({ location }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<HomeService | null>(null);

    useEffect(() => {
        document.title = `Home Services in ${location.city} - TownPlate`;
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', `Book reliable home services in ${location.city} like plumbing, electrical, cleaning, and appliance repair through TownPlate.`);
        }
    }, [location.city]);
    
    const handleBookClick = (service: HomeService) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const filteredServices = homeServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Home Services' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Home Services"
                subtitle={`Reliable professionals at your doorstep in ${location.city}`}
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-8">
                 <div className="relative max-w-2xl mx-auto mb-8">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for services like 'Plumbing', 'Cleaning'..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 dark:bg-charcoal-light border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue transition"
                    />
                </div>
                
                {filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredServices.map(service => (
                            <ServiceCard key={service.id} service={service} onBook={() => handleBookClick(service)} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                        No services found for "{searchTerm}".
                    </p>
                )}
            </div>
            
            {selectedService && (
                <HomeServiceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    serviceName={selectedService.name}
                />
            )}
        </div>
    );
};

export default HomeServicesPage;