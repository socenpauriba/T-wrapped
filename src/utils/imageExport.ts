import { toPng } from 'html-to-image';

export const exportToImage = async (element: HTMLElement): Promise<void> => {
  try {
    // Store original styles
    const originalStyles = {
      width: element.style.width,
      maxWidth: element.style.maxWidth,
      height: element.style.height,
      padding: element.style.padding,
      margin: element.style.margin,
      transform: element.style.transform,
      position: element.style.position
    };

    // Fixed square dimensions (1:1 aspect ratio)
    const targetSize = 1080;

    // Set temporary styles for capture
    Object.assign(element.style, {
      width: `${targetSize}px`,
      maxWidth: `${targetSize}px`,
      height: `${targetSize}px`,
      padding: '32px',
      margin: '0',
      transform: 'none',
      position: 'relative'
    });

    const dataUrl = await toPng(element, {
      quality: 1,
      backgroundColor: 'white',
      width: targetSize,
      height: targetSize,
      style: {
        transform: 'none',
        transformOrigin: 'center',
        margin: '0',
        padding: '32px'
      },
      pixelRatio: 2 // Higher pixel ratio for better quality
    });

    // Restore original styles
    Object.entries(originalStyles).forEach(([key, value]) => {
      element.style[key as any] = value;
    });

    // Create and trigger download
    const link = document.createElement('a');
    link.download = 'T-wrapped.png';
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('No s\'ha pogut generar la imatge');
  }
};