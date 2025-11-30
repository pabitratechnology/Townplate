import React from 'react';
import { Review } from '../types';
import StarRatingDisplay from './StarRatingDisplay';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-8">No reviews yet. Be the first to share your thoughts!</p>;
    }

    return (
        <div className="space-y-6">
            {reviews.map(review => (
                <div key={review.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-charcoal-light rounded-lg">
                    <img 
                        src={review.userPhotoURL || `https://ui-avatars.com/api/?name=${review.userName.replace(' ','+')}&background=random`} 
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold">{review.userName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                            </div>
                            <StarRatingDisplay rating={review.rating} size="h-4 w-4" />
                        </div>
                        <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{review.comment}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
