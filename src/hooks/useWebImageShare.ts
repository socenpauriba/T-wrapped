import { useState, useCallback } from 'react';

interface ShareResult {
  success: boolean;
  error?: unknown;
}

interface UseWebImageShareReturn {
  shareImage: (imageUrl: string, title?: string, text?: string) => Promise<ShareResult>;
  isSharing: boolean;
  canShare: boolean;
}

export const useWebImageShare = (): UseWebImageShareReturn => {
  const [isSharing, setIsSharing] = useState(false);
  const [canShare, setCanShare] = useState(true); // Optimistically true, updated on check

  const shareImage = useCallback(async (imageUrl: string, title: string = 'Shared Image', text: string = ''): Promise<ShareResult> => {
    setIsSharing(true);

    try {
      // 1. Fetch the image and convert to Blob
      // This handles both remote URLs (if CORS allows) and Data URLs (Base64)
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // 2. Create a File object
      // We need to give it a name and type. 
      // If it's a png, use .png, etc. Defaulting to png for safety if unknown.
      const fileType = blob.type || 'image/png';
      const fileName = `share-image.${fileType.split('/')[1] || 'png'}`;
      const file = new File([blob], fileName, { type: fileType });

      // 3. Construct share data
      const shareData: ShareData = {
        files: [file],
        title: title,
        text: text,
      };

      // 4. Check support
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return { success: true };
      } else {
        // Fallback: If file sharing isn't supported, try sharing just the URL/Text
        // or throw an error to be handled by the caller (e.g. to open a modal)
        console.warn('Native file sharing not supported on this device/browser.');
        setCanShare(false);
        return { success: false, error: new Error('Native file sharing not supported') };
      }

    } catch (error) {
      // AbortError is usually when the user cancels the share sheet
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing image:', error);
      }
      return { success: false, error };
    } finally {
      setIsSharing(false);
    }
  }, []);

  return { shareImage, isSharing, canShare };
};
