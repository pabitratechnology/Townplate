import React, { useEffect } from 'react';
import PageHeader from '../../components/PageHeader';

const CookiePolicyPage: React.FC = () => {
    
    useEffect(() => {
        document.title = "Cookie Policy - TownPlate";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Learn about how TownPlate uses cookies to improve your browsing experience, personalize content, and analyze site traffic.");
        }
    }, []);

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Cookie Policy' }
    ];
    
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Cookie Policy"
                subtitle="How we use cookies to improve your experience."
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-12 md:py-16">
                 <div className="max-w-4xl mx-auto prose dark:prose-invert prose-lg">
                    <h2>What Are Cookies</h2>
                    <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.</p>
                    
                    <h2>How We Use Cookies</h2>
                    <p>We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>
                    
                     <h2>Disabling Cookies</h2>
                    <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.</p>

                    <p><em>(This is a placeholder document. For a complete and legally binding document, please consult a legal professional.)</em></p>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicyPage;
