import React from 'react';
import { StarIcon } from './IconComponents';

interface StarRatingDisplayProps {
  rating: number;
  size?: string; // e.g., 'h-5 w-5'
}

const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({ rating, size = 'h-5 w-5' }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<StarIcon key={i} className={`${size} text-yellow-400`} />);
        } else if (i - 0.5 <= rating) {
            stars.push(
                <div key={i} className={`relative ${size}`}>
                    <StarIcon className={`${size} text-gray-300 dark:text-gray-600`} />
                    <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
                         <StarIcon className={`${size} text-yellow-400`} />
                    </div>
                </div>
            );
        } else {
            stars.push(<StarIcon key={i} className={`${size} text-gray-300 dark:text-gray-600`} />);
        }
    }
    return <div className="flex items-center">{stars}</div>;
};

export default StarRatingDisplay;
