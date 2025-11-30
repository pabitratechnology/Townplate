import React, { useState, useEffect } from 'react';
import { Location, Pharmacy, FeaturedItem, MedicineProduct } from '../types';
import PageHeader from '../components/PageHeader';
import { PrescriptionIcon, SearchIcon, ClockIcon } from '../components/IconComponents';
import ProductCarousel from '../components/ProductCarousel';
import * as api from '../services/api';

interface MedicinesPageProps {
  location: Location;
  onAddToCart: (item: FeaturedItem) => void;
}

const PharmacyCard: React.FC<{ pharmacy: Pharmacy }> = ({ pharmacy }) => (
    <div className="group bg-white dark:bg-charcoal-light rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <img src={pharmacy.imageUrl} alt={pharmacy.name} className="w-full h-32 object-cover" />
        <div className="p-4">
            <h3 className="text-lg font-bold truncate">{pharmacy.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Delivers in {pharmacy.deliveryTime}</p>
            {pharmacy.isOpen247 && (
                <span className="mt-2 inline-block text-xs font-bold bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">Open 24/7</span>
            )}
        </div>
    </div>
);


const MedicinesPage: React.FC<MedicinesPageProps> = ({ location, onAddToCart }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter247, setFilter247] = useState(false);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [medicineProducts, setMedicineProducts] = useState<MedicineProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = `Pharmacy & Medicine Delivery in ${location.city} - TownPlate`;
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', `Order medicines, wellness products, and healthcare essentials from trusted pharmacies in ${location.city}. 24/7 delivery available.`);
        }
    }, [location.city]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [pharmaData, productData] = await Promise.all([
                    api.getPharmacies(),
                    api.getMedicineProducts()
                ]);
                setPharmacies(pharmaData);
                setMedicineProducts(productData);
            } catch (error) {
                console.error("Failed to fetch medicine data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [location]);

    const filteredPharmacies = pharmacies.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = !filter247 || p.isOpen247;
        return matchesSearch && matchesFilter;
    });

    const productsByCategory = medicineProducts.reduce((acc, product) => {
        const category = product.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {} as Record<string, MedicineProduct[]>);

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Medicines' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Pharmacy"
                subtitle={`Medicines and wellness products delivered from ${location.city}`}
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-8 space-y-12">
                {/* Upload Prescription Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-brand-saffron/50 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold mb-2">Have a Prescription?</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Upload it here and we'll handle the rest!</p>
                    <button className="inline-flex items-center px-8 py-3 text-lg font-bold rounded-full bg-brand-saffron text-white hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-md shadow-brand-saffron/20">
                        <PrescriptionIcon className="h-6 w-6 mr-3" />
                        Upload Prescription
                    </button>
                </div>
                
                {isLoading ? (
                    <div className="text-center py-10"><div className="w-12 h-12 border-4 border-brand-saffron border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-black mb-6 text-center">Shop Wellness Products</h2>
                        {Object.entries(productsByCategory).map(([category, items]) => (
                            <ProductCarousel
                                key={category}
                                title={category}
                                items={items}
                                currencySymbol={location.currencySymbol}
                                onAddToCart={onAddToCart}
                            />
                        ))}
                    </div>
                )}


                {/* Search Pharmacies Section */}
                <div>
                    <div className="relative max-w-2xl mx-auto mb-6">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for pharmacies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 dark:bg-charcoal-light border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-saffron transition"
                        />
                    </div>
                     <div className="flex justify-center">
                        <button
                            onClick={() => setFilter247(!filter247)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full transition-colors ${filter247 ? 'bg-brand-saffron text-white' : 'bg-gray-200 dark:bg-charcoal-light hover:bg-gray-300 dark:hover:bg-charcoal'}`}
                        >
                            <ClockIcon className="h-5 w-5" />
                            Open 24/7
                        </button>
                    </div>
                </div>

                {/* Pharmacies Grid */}
                 {isLoading ? (
                     <div className="text-center py-10"><div className="w-12 h-12 border-4 border-brand-saffron border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                 ) : (
                    <div>
                        <h2 className="text-2xl font-black mb-6 text-center">Pharmacies Near You</h2>
                        {filteredPharmacies.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {filteredPharmacies.map(pharmacy => (
                                    <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
                                ))}
                            </div>
                        ) : (
                             <p className="text-center text-gray-500 dark:text-gray-400 col-span-full py-10">
                                No pharmacies found matching your criteria.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicinesPage;