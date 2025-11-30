import React, { useState } from 'react';
import { Review, User } from '../types';
import { StarIcon } from './IconComponents';

interface ReviewFormProps {
  targetId: number;
  targetType: 'product' | 'restaurant';
  user: User;
  onReviewSubmit: (review: Omit<Review, 'id' | 'date'>) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ targetId, targetType, user, onReviewSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        if (!comment.trim()) {
            setError('Please write a comment.');
            return;
        }
        
        setIsSubmitting(true);
        setError('');

        const newReview: Omit<Review, 'id' | 'date'> = {
            targetId,
            targetType,
            userEmail: user.email,
            userName: user.name,
            userPhotoURL: user.photoURL,
            rating,
            comment,
        };
        
        try {
            await onReviewSubmit(newReview);
            // Reset form state after successful submission
            setRating(0);
            setComment('');
        } catch (e) {
            setError('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="p-6 bg-white dark:bg-charcoal-light rounded-2xl shadow-lg border border-gray-200 dark:border-charcoal">
            <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <p className="font-semibold mb-2">Your Rating</p>
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                type="button"
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                aria-label={`Rate ${star} stars`}
                            >
                                <StarIcon 
                                    className={`h-8 w-8 cursor-pointer transition-colors ${
                                        (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                     <label htmlFor="comment" className="font-semibold mb-2 block">Your Comment</label>
                     <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience..."
                        rows={4}
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-charcoal border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-chakra-blue"
                     />
                </div>
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 text-lg font-bold rounded-full bg-brand-chakra-blue text-white hover:bg-opacity-90 transition disabled:bg-gray-400"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;