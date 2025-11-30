import React, { useEffect } from 'react';
import PageHeader from '../../components/PageHeader';

const PrivacyPolicyPage: React.FC = () => {

    useEffect(() => {
        document.title = "Privacy Policy - TownPlate";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Read TownPlate's privacy policy to understand how we collect, use, and protect your personal information when you use our services.");
        }
    }, []);

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Privacy Policy' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Privacy Policy"
                subtitle="Your privacy is important to us."
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-12 md:py-16">
                 <div className="max-w-4xl mx-auto prose dark:prose-invert prose-lg">
                    <h2>1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact customer support. This information may include your name, email address, phone number, delivery address, and payment information.</p>
                    
                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to provide, maintain, and improve our services, including to process transactions, send delivery updates, and respond to your comments and questions.</p>
                    
                    <h2>3. Sharing of Information</h2>
                    <p>We may share your information with our delivery partners and vendors to fulfill your orders. We do not sell your personal information to third parties.</p>
                    
                    <p><em>(This is a placeholder document. For a complete and legally binding document, please consult a legal professional.)</em></p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
