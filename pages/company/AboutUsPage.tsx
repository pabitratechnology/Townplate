import React, { useEffect } from 'react';
import PageHeader from '../../components/PageHeader';

const AboutUsPage: React.FC = () => {
    
    useEffect(() => {
        document.title = "About TownPlate | An Odia Vision for India";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Learn about TownPlate, a hyperlocal delivery platform born in Odisha, India. Discover our mission to empower local businesses and provide unparalleled convenience.");
        }
    }, []);
    
    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'About Us' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="About TownPlate: An Odia Vision for India"
                subtitle="Celebrating Odia 'Birapurusha Mahatmya' through technology and service."
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-4xl mx-auto space-y-8 text-lg text-gray-700 dark:text-gray-300">
                    <p className="text-xl font-semibold">
                        TownPlate is not just an app; it is a revolution born in the heart of Odisha, India's emerging visionary IT hub. Conceived and built by Pabitra Technology, we are a proudly Indian company driven by the spirit of 'Birapurusha Mahatmya' - the glory of our great heroes - to build a future of unparalleled convenience for every Indian.
                    </p>
                    <p>
                        Founded in Bhubaneswar, we witnessed the incredible potential of our local communities and the enterprising spirit of our people. Our mission became clear: to forge a hyperlocal ecosystem that empowers local businesses, from the smallest street-side vendor to the largest supermarket, connecting them to customers with the speed and efficiency that modern India deserves.
                    </p>
                    <h2 className="text-3xl font-bold text-charcoal dark:text-white pt-4">Our 'Mahatmya'</h2>
                    <p>
                        We believe in the greatness of simplicity and the power of technology to solve real-world problems. TownPlate is our commitment to this belief. By handling the complexities of logistics, payments, and marketing, we enable our partners to focus on what they do best: serving you with quality and love. This is our service to the nation, a digital bridge built with Odia ingenuity and Indian ambition.
                    </p>
                     <h2 className="text-3xl font-bold text-charcoal dark:text-white pt-4">Jai Jagannath. Vande Utkala Janani.</h2>
                    <p>
                        Join us on this incredible journey. With every order, you're not just getting what you need in minutes; you're supporting a local business, celebrating our shared heritage, and helping build a self-reliant, digital India.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;