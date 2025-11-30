import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { updateProfile } from '../firebase';
import { User } from '../types';
import PageHeader from '../components/PageHeader';
import * as api from '../services/api';

interface EditProfilePageProps {
    user: User;
    onUpdateUser: (updatedUser: User) => void;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ user, onUpdateUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        photoURL: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            document.title = "Edit Profile - TownPlate";
            const descriptionTag = document.getElementById('page-description');
            if (descriptionTag) {
                descriptionTag.setAttribute('content', "Update your personal information, contact details, and profile picture on TownPlate.");
            }
            
            setFormData({
                name: user.name,
                phone: user.phone || '',
                photoURL: user.photoURL || ''
            });
            setPreviewUrl(user.photoURL || null);
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            setMessage('Error: Not authenticated.');
            setIsLoading(false);
            return;
        }

        try {
            let finalPhotoUrl = formData.photoURL;
            if (imageFile) {
                setMessage('Uploading image...');
                finalPhotoUrl = await api.uploadImage(imageFile);
            }
            
            setMessage('Updating profile...');

            // Update Firebase Auth profile (name and photo)
            await updateProfile(currentUser, {
                displayName: formData.name,
                photoURL: finalPhotoUrl
            });

            // Prepare the updated user object for the App state
            const updatedUser: User = {
                ...user,
                name: formData.name,
                photoURL: finalPhotoUrl,
                phone: formData.phone
            };

            // Call the callback from App.tsx to update global state and backend
            onUpdateUser(updatedUser);

            setMessage('Profile updated successfully!');
            setTimeout(() => {
                window.location.hash = '#/profile';
            }, 1500);

        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage('Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (window.history.length > 2) {
            window.history.back();
        } else {
            window.location.hash = '#/profile';
        }
    };

    const breadcrumbs = [
        { label: 'Home', href: '#/' },
        { label: 'My Profile', href: '#/profile' },
        { label: 'Edit Profile' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Edit Profile"
                subtitle="Update your personal information"
                breadcrumbs={breadcrumbs}
            />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col items-center">
                            <img 
                                src={previewUrl || `https://ui-avatars.com/api/?name=${formData.name.replace(' ','+')}&background=random&size=128`}
                                alt="Profile Preview"
                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-charcoal-dark shadow-md mb-4"
                            />
                             <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 text-sm font-bold rounded-full bg-brand-chakra-blue/10 text-brand-chakra-blue hover:bg-brand-chakra-blue hover:text-white transition">
                                Change Photo
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="phone">Phone Number</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="e.g., +91 12345 67890"
                                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="photoURL">Profile Picture URL</label>
                            <input
                                id="photoURL"
                                name="photoURL"
                                type="url"
                                value={formData.photoURL}
                                onChange={handleInputChange}
                                placeholder="Or paste an image URL here"
                                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue"
                            />
                        </div>

                        {message && (
                            <p className={`text-center font-semibold ${message.includes('successfully') ? 'text-green-500' : (message.includes('Uploading') || message.includes('Updating') ? 'text-brand-chakra-blue' : 'text-red-500')}`}>
                                {message}
                            </p>
                        )}

                        <div className="flex items-center gap-4 pt-4">
                            <a 
                                href="#/profile"
                                onClick={handleCancel}
                                className="w-full text-center py-3.5 text-lg font-bold rounded-full bg-gray-200 dark:bg-charcoal text-charcoal dark:text-white hover:bg-gray-300 dark:hover:bg-charcoal-dark transition"
                            >
                                Cancel
                            </a>
                             <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center py-3.5 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition disabled:bg-gray-400"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;