import React from 'react';
import { useWebImageShare } from '../hooks/useWebImageShare';

interface ShareButtonProps {
  imageUrl: string;
  title?: string;
  text?: string;
  className?: string;
  fallbackAction?: () => void; // Action to take if native sharing fails (e.g. copy to clipboard)
}

const ShareButton: React.FC<ShareButtonProps> = ({ 
  imageUrl, 
  title = 'Check this out!', 
  text = '', 
  className = '',
  fallbackAction 
}) => {
  const { shareImage, isSharing } = useWebImageShare();

  const handleShareClick = async () => {
    if (!imageUrl) return;

    const result = await shareImage(imageUrl, title, text);

    if (!result.success && fallbackAction) {
      // If native sharing failed (or wasn't supported), trigger the fallback
      fallbackAction();
    }
  };

  return (
    <button
      onClick={handleShareClick}
      disabled={isSharing}
      className={`flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Share image"
    >
      {isSharing ? (
        <span>Sharing...</span>
      ) : (
        <>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          <span>Share</span>
        </>
      )}
    </button>
  );
};

export default ShareButton;
