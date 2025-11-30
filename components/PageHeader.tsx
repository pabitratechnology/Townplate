import React from 'react';

interface Breadcrumb {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    subtitle: string;
    breadcrumbs?: Breadcrumb[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, breadcrumbs }) => {
    
    const handleBreadcrumbClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        window.location.hash = href;
    };

    return (
        <section className="relative py-12 md:py-16 bg-gray-50 dark:bg-charcoal-light border-b border-gray-200 dark:border-charcoal overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
            <div className="container mx-auto px-4 relative text-center">
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav aria-label="Breadcrumb" className="mb-4 text-sm font-semibold">
                        <ol className="flex justify-center items-center space-x-2 text-gray-500 dark:text-gray-400">
                            {breadcrumbs.map((crumb, index) => (
                                <li key={index} className="flex items-center">
                                    {crumb.href ? (
                                        <a href={crumb.href} onClick={(e) => handleBreadcrumbClick(e, crumb.href!)} className="hover:text-brand-chakra-blue transition-colors">{crumb.label}</a>
                                    ) : (
                                        <span className="text-charcoal dark:text-white">{crumb.label}</span>
                                    )}
                                    {index < breadcrumbs.length - 1 && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}
                <h1 className="text-3xl md:text-4xl font-black text-brand-chakra-blue">{title}</h1>
                <p className="mt-2 text-md text-gray-600 dark:text-gray-300">{subtitle}</p>
            </div>
        </section>
    );
};

export default PageHeader;