import React, { useEffect } from 'react';
import PageHeader from '../../components/PageHeader';

const blogPosts = [
    { title: 'TownPlate Launches in London!', date: 'October 26, 2024', category: 'Announcement', excerpt: 'We are thrilled to bring our ultra-fast delivery service to the vibrant city of London...' },
    { title: '5 Tips for a Healthier Grocery Haul', date: 'October 22, 2024', category: 'Lifestyle', excerpt: 'Shopping for groceries online? Here are five simple tips to make sure your cart is packed with nutritious choices...' },
    { title: 'Partner Spotlight: The Pizza Palace', date: 'October 18, 2024', category: 'Partners', excerpt: 'Meet the family behind one of our most popular pizzerias and learn their secret to the perfect crust...' },
];

const BlogPage: React.FC = () => {
    
    useEffect(() => {
        document.title = "TownPlate Blog | News & Updates";
        const descriptionTag = document.getElementById('page-description');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', "Read the latest news, updates, stories, and tips from the world of TownPlate. Stay informed about our services and partners.");
        }
    }, []);

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'Blog' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="TownPlate Blog"
                subtitle="News, updates, and stories from the world of TownPlate."
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                    {blogPosts.map((post) => (
                        <div key={post.title} className="bg-white dark:bg-charcoal-light rounded-2xl shadow-lg p-8">
                            <p className="text-sm font-bold text-brand-chakra-blue mb-2">{post.category}</p>
                            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{post.date}</p>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">{post.excerpt}</p>
                            <a href="#" className="font-bold text-brand-chakra-blue hover:underline">Read More &rarr;</a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;