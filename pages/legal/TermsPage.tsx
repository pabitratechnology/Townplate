import React, { useEffect } from 'react';
import PageHeader from '../../components/PageHeader';

const TermsPage: React.FC = () => {

    useEffect(() => {
        document.title = "Terms & Conditions - TownPlate";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Read the official Terms and Conditions for using the TownPlate website and mobile application services.");
        }
    }, []);

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Terms & Conditions' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Terms & Conditions"
                subtitle="Please read these terms carefully before using our service."
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose dark:prose-invert prose-lg">
                    <h2>1. Introduction</h2>
                    <p>Welcome to TownPlate. These terms and conditions outline the rules and regulations for the use of TownPlate's Website and mobile application.</p>
                    
                    <h2>2. Intellectual Property Rights</h2>
                    <p>Other than the content you own, under these Terms, TownPlate and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
                    
                    <h2>3. Restrictions</h2>
                    <p>You are specifically restricted from all of the following: publishing any Website material in any other media; selling, sublicensing and/or otherwise commercializing any Website material; publicly performing and/or showing any Website material...</p>
                    
                    <p><em>(This is a placeholder document. For a complete and legally binding document, please consult a legal professional.)</em></p>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
