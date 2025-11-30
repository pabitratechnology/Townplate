import React, { useState, useEffect } from 'react';
import { Location, FeaturedItem, ProductVariant, CustomizationOption, CustomizationGroup, User, Review } from '../types';
import { StarIcon, PlusIcon, MinusIcon, ArrowLeftIcon, CheckCircleIcon } from '../components/IconComponents';
import ProductCarousel from '../components/ProductCarousel';
import * as api from '../services/api';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import StarRatingDisplay from '../components/StarRatingDisplay';

const SCRIPT_ID = 'json-ld-script';

const injectJSONLD = (product: FeaturedItem, location: Location) => {
    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
        existingScript.remove();
    }

    if (!product) return;

    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.imageUrl,
        "description": product.description,
        "sku": product.id,
        "brand": {
            "@type": "Brand",
            "name": "TownPlate"
        },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": location.currency,
            "price": product.price,
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": product.reviewCount || 0
        }
    };

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
};


interface ProductPageProps {
  currentUser: User | null;
  location: Location;
  onAddToCart: (product: FeaturedItem, variant?: ProductVariant, quantity?: number, customizations?: { groupName: string; option: CustomizationOption }[]) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ currentUser, location, onAddToCart }) => {
    const [product, setProduct] = useState<FeaturedItem | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string | string[]>>({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState<FeaturedItem[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [canUserReview, setCanUserReview] = useState(false);
    const [hasUserReviewed, setHasUserReviewed] = useState(false);
    
    const requestLogin = () => {
        window.dispatchEvent(new CustomEvent('request-login'));
    };

    const checkUserStatus = async (user: User | null, productId: number) => {
        if (!user) {
            setCanUserReview(false);
            setHasUserReviewed(false);
            return;
        }
        const [purchased, reviewed] = await Promise.all([
            api.hasUserPurchased(user.email, productId, 'product'),
            api.hasUserReviewed(user.email, productId, 'product')
        ]);
        setHasUserReviewed(reviewed);
        setCanUserReview(purchased && !reviewed);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            window.scrollTo(0, 0);
            const hashParts = window.location.hash.split('/');
            const id = parseInt(hashParts[hashParts.length - 1], 10);
            
            setIsLoading(true);
            setProduct(null);
            setRelatedProducts([]);
            setQuantity(1);
            setSelectedCustomizations({});

            if (id) {
                try {
                    const foundProduct = await api.getProductById(id);
                    if (foundProduct) {
                        setProduct(foundProduct);

                        // SEO & Metadata
                        document.title = `${foundProduct.name} - Order on TownPlate`;
                        const descriptionTag = document.getElementById('page-description');
                        if (descriptionTag) {
                            descriptionTag.setAttribute('content', foundProduct.description || `Order ${foundProduct.name} online from TownPlate for fast delivery in ${location.city}.`);
                        }
                        injectJSONLD(foundProduct, location);

                        // Set default variant
                        const defaultVariant = (foundProduct.variants && foundProduct.variants.length > 0)
                            ? foundProduct.variants[0]
                            : { name: foundProduct.unit || 'Standard', price: foundProduct.price };
                        setSelectedVariant(defaultVariant);
                        
                        // Set default customizations
                        const initialCustomizations: Record<string, string | string[]> = {};
                        foundProduct.customizationGroups?.forEach(group => {
                            if (group.type === 'radio' && group.required) {
                                initialCustomizations[group.name] = group.options[0].name;
                            }
                        });
                        setSelectedCustomizations(initialCustomizations);
                        
                        const [allProducts, fetchedReviews] = await Promise.all([
                            api.getAllProducts(),
                            api.getReviewsForTarget(id, 'product')
                        ]);
                        
                        const related = allProducts.filter(p => p.category === foundProduct.category && p.id !== foundProduct.id).slice(0, 10);
                        setRelatedProducts(related);
                        setReviews(fetchedReviews);
                        checkUserStatus(currentUser, id);
                    }
                } catch (error) {
                    console.error("Failed to fetch product:", error);
                }
            }
            setIsLoading(false);
        };
        fetchProduct();
        
        return () => {
            const existingScript = document.getElementById(SCRIPT_ID);
            if (existingScript) existingScript.remove();
        };

    }, [window.location.hash, location.city, currentUser]);
    
    useEffect(() => {
        if (!product || !selectedVariant) return;

        let customizationsPrice = 0;
        product.customizationGroups?.forEach(group => {
            const selection = selectedCustomizations[group.name];
            if (selection) {
                if (Array.isArray(selection)) {
                    selection.forEach(optionName => {
                        const option = group.options.find(opt => opt.name === optionName);
                        if (option) customizationsPrice += option.price;
                    });
                } else {
                    const option = group.options.find(opt => opt.name === selection);
                    if (option) customizationsPrice += option.price;
                }
            }
        });

        setTotalPrice((selectedVariant.price + customizationsPrice) * quantity);

    }, [product, selectedVariant, selectedCustomizations, quantity]);
    
    useEffect(() => {
        if (product) {
            let categoryHref = '#/';
            const cat = product.category.toLowerCase();
            const groceryKeywords = ['grocery', 'dairy', 'bread', 'eggs', 'fruits', 'vegetables', 'snacks', 'drinks', 'pantry', 'cleaning', 'personal care'];
            const medicineKeywords = ['medicine', 'pharmacy', 'wellness', 'health', 'pain', 'first aid', 'skincare'];
            
            if (groceryKeywords.some(kw => cat.includes(kw))) {
                categoryHref = `#/grocery?category=${encodeURIComponent(product.category)}`;
            } else if (medicineKeywords.some(kw => cat.includes(kw))) {
                categoryHref = '#/medicines';
            } else {
                categoryHref = '#/food';
            }

            setBreadcrumbs([
                { label: 'Home', href: '#/' },
                { label: product.category, href: categoryHref },
                { label: product.name }
            ]);
        }
    }, [product]);
    
    const handleReviewSubmit = async (reviewData: Omit<Review, 'id' | 'date'>) => {
        if (!product) return;
        await api.addReview(reviewData);
        
        const [updatedProduct, updatedReviews] = await Promise.all([
            api.getProductById(product.id),
            api.getReviewsForTarget(product.id, 'product')
        ]);

        setProduct(updatedProduct);
        setReviews(updatedReviews);
        checkUserStatus(currentUser, product.id);
    };

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-brand-saffron border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!product) {
        return (
             <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">Product not found.</h1>
                <a href="#/" className="mt-4 inline-block text-brand-saffron font-bold">Go back to Home</a>
            </div>
        );
    }
    
    const handleCustomizationChange = (group: CustomizationGroup, optionName: string) => {
        setSelectedCustomizations(prev => {
            const newSelections = { ...prev };
            const currentSelection = newSelections[group.name];

            if (group.type === 'radio') {
                newSelections[group.name] = optionName;
            } else {
                const currentOptions = Array.isArray(currentSelection) ? [...currentSelection] : [];
                const optionIndex = currentOptions.indexOf(optionName);
                if (optionIndex > -1) {
                    currentOptions.splice(optionIndex, 1);
                } else {
                    currentOptions.push(optionName);
                }
                newSelections[group.name] = currentOptions;
            }
            return newSelections;
        });
    };

    const handleAddToCartClick = () => {
        if (!selectedVariant) return;

        const customizationsToCart: { groupName: string; option: CustomizationOption }[] = [];
        product.customizationGroups?.forEach(group => {
            const selection = selectedCustomizations[group.name];
            if (Array.isArray(selection)) {
                selection.forEach(optionName => {
                    const option = group.options.find(opt => opt.name === optionName);
                    if (option) customizationsToCart.push({ groupName: group.name, option });
                });
            } else if (typeof selection === 'string') {
                const option = group.options.find(opt => opt.name === selection);
                if (option) customizationsToCart.push({ groupName: group.name, option });
            }
        });
        
        onAddToCart(product, selectedVariant, quantity, customizationsToCart);
    };

    return (
        <div className="animate-fade-in">
            <div className="container mx-auto px-4 py-8">
                <nav aria-label="Breadcrumb" className="mb-6">
                    <ol className="flex items-center space-x-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="flex items-center">
                                {crumb.href ? (
                                    <a href={crumb.href} onClick={(e) => { e.preventDefault(); window.location.hash = crumb.href; }} className="hover:text-brand-chakra-blue transition-colors">{crumb.label}</a>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    <div>
                        <img src={product.imageUrl} alt={product.name} className="w-full h-auto aspect-square object-cover rounded-2xl shadow-xl" />
                    </div>

                    <div>
                        <h1 className="text-4xl font-black mb-2">{product.name}</h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">{product.category}</p>
                        
                        <a href="#reviews" className="flex items-center gap-2 mb-6">
                            <StarRatingDisplay rating={product.rating} />
                            <span className="text-md font-bold">{product.rating.toFixed(1)}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">({product.reviewCount || 0} reviews)</span>
                        </a>

                        {product.description && <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{product.description}</p>}
                        {product.ingredients && product.ingredients.length > 0 && (
                             <div className="mb-6"><h3 className="font-bold text-lg mb-2">Ingredients</h3><div className="flex flex-wrap gap-2">{product.ingredients.map(ing => (<span key={ing} className="px-3 py-1 text-sm bg-gray-100 dark:bg-charcoal-light rounded-full">{ing}</span>))}</div></div>
                        )}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-6"><h3 className="font-bold text-lg mb-2">Options</h3><div className="flex flex-wrap gap-2">{product.variants.map(variant => (<button key={variant.name} onClick={() => setSelectedVariant(variant)} className={`px-4 py-2 font-bold rounded-lg border-2 transition-colors ${selectedVariant?.name === variant.name ? 'bg-brand-saffron text-white border-brand-saffron' : 'bg-white dark:bg-charcoal-light border-gray-200 dark:border-charcoal hover:border-brand-saffron'}`}>{variant.name}</button>))}</div></div>
                        )}

                        {product.customizationGroups?.map(group => (
                            <fieldset key={group.name} className="mb-6">
                                <legend className="font-bold text-lg mb-2">{group.name} {group.required && <span className="text-xs text-red-500">(Required)</span>}</legend>
                                <div className="space-y-2">
                                    {group.options.map(option => {
                                        const isSelected = group.type === 'radio'
                                            ? selectedCustomizations[group.name] === option.name
                                            : (Array.isArray(selectedCustomizations[group.name]) && (selectedCustomizations[group.name] as string[]).includes(option.name));
                                        
                                        return (
                                            <label key={option.name} className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'bg-brand-chakra-blue/10 border-brand-chakra-blue' : 'bg-gray-50 dark:bg-charcoal-light border-gray-200 dark:border-charcoal hover:border-brand-chakra-blue/50'}`}>
                                                <div className="flex items-center">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${isSelected ? 'bg-brand-chakra-blue border-brand-chakra-blue' : 'border-gray-400'}`}>
                                                        {isSelected && <CheckCircleIcon className="w-4 h-4 text-white" />}
                                                    </div>
                                                    <span className="font-semibold">{option.name}</span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                                                    {option.price > 0 && `+ ${location.currencySymbol}${option.price.toFixed(2)}`}
                                                </span>
                                                <input
                                                    type={group.type}
                                                    name={group.name}
                                                    checked={isSelected}
                                                    onChange={() => handleCustomizationChange(group, option.name)}
                                                    className="sr-only"
                                                />
                                            </label>
                                        );
                                    })}
                                </div>
                            </fieldset>
                        ))}
                        
                        <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-charcoal-light rounded-xl mb-6">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 rounded-full bg-white dark:bg-charcoal shadow transition-transform hover:scale-110"><MinusIcon className="w-5 h-5"/></button>
                                <span className="text-2xl font-bold w-10 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="p-2 rounded-full bg-white dark:bg-charcoal shadow transition-transform hover:scale-110"><PlusIcon className="w-5 h-5"/></button>
                            </div>
                            <span className="text-4xl font-black text-brand-saffron">{location.currencySymbol}{totalPrice.toFixed(2)}</span>
                        </div>

                        <button 
                            onClick={handleAddToCartClick}
                            className="w-full py-4 text-lg font-bold rounded-full bg-brand-saffron text-white hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg shadow-brand-saffron/30"
                        >
                           Add to Cart
                        </button>
                    </div>
                </div>
                 
                <section id="reviews" className="mt-12 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">Ratings & Reviews</h2>
                    <div className="bg-white dark:bg-charcoal-light p-6 rounded-2xl shadow-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div className="text-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-charcoal pb-4 md:pb-0 md:pr-4">
                            <p className="text-5xl font-black text-brand-chakra-blue">{product.rating.toFixed(1)}</p>
                            <StarRatingDisplay rating={product.rating} size="h-6 w-6" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Based on {product.reviewCount} reviews</p>
                        </div>
                        <div className="md:col-span-2">
                            {currentUser && canUserReview && (
                                <ReviewForm
                                    targetId={product.id}
                                    targetType="product"
                                    user={currentUser}
                                    onReviewSubmit={handleReviewSubmit}
                                />
                            )}
                            {currentUser && hasUserReviewed && (
                                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-300 font-semibold">
                                    <CheckCircleIcon className="w-6 h-6 mx-auto mb-2" />
                                    You've already reviewed this product. Thank you!
                                </div>
                            )}
                            {!currentUser && !canUserReview && !hasUserReviewed && (
                                <div className="text-center p-4 bg-gray-100 dark:bg-charcoal rounded-lg text-gray-600 dark:text-gray-300">
                                    <p>
                                        <a href="#" onClick={(e) => { e.preventDefault(); requestLogin(); }} className="font-bold text-brand-chakra-blue hover:underline">Log in</a> to share your thoughts.
                                    </p>
                                    <p className="text-xs mt-1">Only customers who have purchased this item can leave a review.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <ReviewList reviews={reviews} />
                </section>
            </div>

            {relatedProducts.length > 0 && (
                <div className="bg-gray-50 dark:bg-charcoal-light pt-12 pb-8 mt-8">
                     <div className="container mx-auto px-4">
                        <ProductCarousel
                            title="You Might Also Like"
                            items={relatedProducts}
                            currencySymbol={location.currencySymbol}
                            onAddToCart={onAddToCart}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPage;