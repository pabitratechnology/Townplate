import React, { useState, useEffect } from 'react';
import { Location, VehicleOption } from '../types';
import PageHeader from '../components/PageHeader';
import PickupDropModal from '../components/PickupDropModal'; // Import the new modal
import { 
    PackageIcon, CourierIcon, BikeIcon, AutoIcon, CarIcon, 
    MapPinIcon, CheckCircleIcon, StarIcon 
} from '../components/IconComponents';

const courierServices = [
    { id: 1, name: "Two Wheeler", description: "For documents, food, and small packages up to 5kg.", icon: <CourierIcon className="h-10 w-10" /> },
    { id: 2, name: "Three Wheeler", description: "For medium-sized boxes and grocery bags up to 50kg.", icon: <PackageIcon className="h-10 w-10" /> },
    { id: 3, name: "Mini Truck", description: "For large items, electronics, or small house shifting.", icon: <CourierIcon className="h-10 w-10" /> },
];

const vehicleOptions: VehicleOption[] = [
    { id: 'bike', name: 'Bike', description: 'Quick & affordable', capacity: '1 Person', icon: BikeIcon, baseFare: 20, perKmFare: 5 },
    { id: 'auto', name: 'Auto', description: 'For short distances', capacity: '3 People', icon: AutoIcon, baseFare: 40, perKmFare: 8 },
    { id: 'car', name: 'Car', description: 'Comfortable & spacious', capacity: '4 People', icon: CarIcon, baseFare: 60, perKmFare: 12 },
];

type BookingStep = 'ROUTE_SELECTION' | 'FINDING_DRIVER' | 'DRIVER_ASSIGNED' | 'TRIP_IN_PROGRESS' | 'TRIP_ENDED';
const RIDE_ESTIMATED_DISTANCE = Math.random() * (25 - 3) + 3;

const PickupDropPage: React.FC<{ location: Location }> = ({ location }) => {
    const [activeTab, setActiveTab] = useState<'ride' | 'package'>('ride');
    
    // State for ride booking flow
    const [step, setStep] = useState<BookingStep>('ROUTE_SELECTION');
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption>(vehicleOptions[0]);
    const [rating, setRating] = useState(0);
    
    // State for courier booking modal
    const [isCourierModalOpen, setIsCourierModalOpen] = useState(false);
    const [selectedCourierService, setSelectedCourierService] = useState('');
    
    const handleOpenCourierModal = (serviceName: string) => {
        setSelectedCourierService(serviceName);
        setIsCourierModalOpen(true);
    };

    useEffect(() => {
        document.title = `${activeTab === 'ride' ? 'Book a Ride' : 'Pickup & Drop'} in ${location.city} - TownPlate`;
    }, [location, activeTab]);

    useEffect(() => {
        if (activeTab === 'ride') {
            handleResetRide();
        }
    }, [activeTab]);

    const handleRequestRide = (e: React.FormEvent) => {
        e.preventDefault();
        if (pickup && dropoff) {
            setStep('FINDING_DRIVER');
            setTimeout(() => {
                setStep('DRIVER_ASSIGNED');
            }, 4000);
        }
    };
    
    const handleStartTrip = () => {
        setStep('TRIP_IN_PROGRESS');
         setTimeout(() => {
            setStep('TRIP_ENDED');
        }, 10000);
    }

    const handleResetRide = () => {
        setStep('ROUTE_SELECTION');
        setPickup('');
        setDropoff('');
        setRating(0);
        setSelectedVehicle(vehicleOptions[0]);
    };

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: activeTab === 'ride' ? 'Book a Ride' : 'Send a Package' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title={activeTab === 'ride' ? "Book a Ride" : "Pickup & Drop"}
                subtitle={activeTab === 'ride' ? `Instant rides in ${location.city}` : `Send packages anywhere in ${location.city}`}
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-xl mx-auto">
                    <div className="flex bg-gray-100 dark:bg-charcoal-light p-1 rounded-full mb-6 shadow-inner">
                        <button onClick={() => setActiveTab('ride')} className={`w-1/2 py-2.5 text-center font-bold transition-all text-sm rounded-full ${activeTab === 'ride' ? 'bg-white dark:bg-charcoal shadow' : 'text-gray-500'}`}>Book a Ride</button>
                        <button onClick={() => setActiveTab('package')} className={`w-1/2 py-2.5 text-center font-bold transition-all text-sm rounded-full ${activeTab === 'package' ? 'bg-white dark:bg-charcoal shadow' : 'text-gray-500'}`}>Send Package</button>
                    </div>

                    {activeTab === 'ride' ? (
                        <div className="bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl overflow-hidden">
                            <div className="h-64 bg-gray-300 dark:bg-charcoal flex items-center justify-center text-gray-500">
                                <MapPinIcon className="w-12 h-12 text-gray-400"/>
                                <p className="ml-2 font-semibold">Map Placeholder</p>
                            </div>
                            <div className="p-6">
                                {step === 'ROUTE_SELECTION' && (
                                    <form onSubmit={handleRequestRide} className="space-y-4 animate-fade-in">
                                        <h3 className="font-bold text-lg">Where to?</h3>
                                        <div><input type="text" value={pickup} onChange={(e) => setPickup(e.target.value)} required placeholder="Enter pickup location" className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" /></div>
                                        <div><input type="text" value={dropoff} onChange={(e) => setDropoff(e.target.value)} required placeholder="Enter drop-off location" className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue" /></div>
                                        <div className="space-y-2 pt-2">
                                            {vehicleOptions.map(v => {
                                                const fare = v.baseFare + v.perKmFare * RIDE_ESTIMATED_DISTANCE;
                                                return (
                                                    <button key={v.id} type="button" onClick={() => setSelectedVehicle(v)} className={`w-full flex items-center p-3 rounded-lg border-2 transition-all ${selectedVehicle.id === v.id ? 'border-brand-chakra-blue bg-brand-chakra-blue/10' : 'border-transparent bg-gray-50 dark:bg-charcoal'}`}>
                                                        <v.icon className="w-10 h-10 mr-4"/>
                                                        <div className="text-left flex-grow"><p className="font-bold">{v.name}</p><p className="text-xs text-gray-500">{v.capacity}</p></div>
                                                        <p className="font-bold text-lg">{location.currencySymbol}{fare.toFixed(0)}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button type="submit" className="w-full mt-2 py-3.5 font-bold rounded-lg bg-brand-chakra-blue text-white hover:bg-opacity-90 transition">Request {selectedVehicle.name}</button>
                                    </form>
                                )}
                                {step === 'FINDING_DRIVER' && (
                                    <div className="text-center py-10 animate-fade-in">
                                        <div className="relative w-24 h-24 mx-auto"><div className="absolute inset-0 rounded-full bg-brand-chakra-blue/20 animate-pulse"></div><div className="absolute inset-2 rounded-full bg-brand-chakra-blue/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div><div className="absolute inset-4 flex items-center justify-center rounded-full bg-brand-chakra-blue text-white"><MapPinIcon className="w-8 h-8"/></div></div>
                                        <h3 className="mt-6 text-xl font-bold">Finding a driver near you...</h3>
                                    </div>
                                )}
                                {step === 'DRIVER_ASSIGNED' && (
                                    <div className="text-center animate-fade-in">
                                        <h3 className="font-bold text-xl">Driver Found!</h3>
                                        <div className="my-4 p-4 bg-gray-100 dark:bg-charcoal rounded-lg flex items-center gap-4"><img src="https://picsum.photos/100/100?random=driver1" className="w-16 h-16 rounded-full"/><div className="text-left"><p className="font-bold">Rakesh Kumar</p><p className="text-sm">OD 02 AB 1234 ({selectedVehicle.name})</p><p className="text-sm font-bold text-yellow-500">★ 4.9</p></div></div>
                                        <p className="font-semibold">Arriving at your pickup location in 3 minutes.</p>
                                        <button onClick={handleStartTrip} className="w-full mt-4 py-3.5 font-bold rounded-lg bg-brand-green text-white hover:bg-opacity-90 transition">(Simulate) Start Trip</button>
                                    </div>
                                )}
                                {step === 'TRIP_IN_PROGRESS' && (
                                    <div className="text-center animate-fade-in">
                                        <h3 className="font-bold text-xl">Trip in Progress</h3><p className="text-gray-500 text-sm">You are on your way to {dropoff}</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4 overflow-hidden"><div className="bg-brand-chakra-blue h-2.5 rounded-full" style={{ width: '45%' }}></div></div>
                                        <p className="mt-4 font-semibold">Estimated arrival in 8 minutes.</p>
                                    </div>
                                )}
                                {step === 'TRIP_ENDED' && (
                                    <div className="text-center py-10 animate-fade-in">
                                        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" /><h2 className="text-2xl font-bold">You've Arrived!</h2><p className="text-gray-500">Total Fare: <span className="font-bold text-3xl text-charcoal dark:text-white">{location.currencySymbol}{(selectedVehicle.baseFare + selectedVehicle.perKmFare * RIDE_ESTIMATED_DISTANCE).toFixed(0)}</span></p>
                                        <div className="mt-6"><h4 className="font-bold mb-2">Rate your driver</h4><div className="flex justify-center gap-2">{[1, 2, 3, 4, 5].map(star => (<button key={star} onClick={() => setRating(star)}><StarIcon className={`w-8 h-8 transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}/></button>))}</div></div>
                                        <button onClick={handleResetRide} className="w-full mt-6 py-3.5 font-bold rounded-lg bg-brand-chakra-blue text-white hover:bg-opacity-90 transition">Book Another Ride</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fade-in">
                            {courierServices.map(service => (
                                <div key={service.id} className="group bg-white dark:bg-charcoal-light rounded-2xl p-6 shadow-lg hover:shadow-2xl dark:hover:shadow-brand-chakra-blue/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col text-center">
                                    <div className="mb-4 text-brand-chakra-blue mx-auto">{service.icon}</div>
                                    <h3 className="text-lg font-bold mb-2">{service.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">{service.description}</p>
                                    <button onClick={() => handleOpenCourierModal(service.name)} className="mt-4 w-full px-4 py-2 text-sm font-bold rounded-full bg-brand-chakra-blue/10 text-brand-chakra-blue border-2 border-transparent hover:bg-brand-chakra-blue hover:text-white transition">Book Now</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
             {isCourierModalOpen && (
                <PickupDropModal
                    isOpen={isCourierModalOpen}
                    onClose={() => setIsCourierModalOpen(false)}
                    serviceName={selectedCourierService}
                />
            )}
        </div>
    );
};

export default PickupDropPage;