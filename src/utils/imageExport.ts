import { toPng } from 'html-to-image';

export const exportToImage = async (element: HTMLElement): Promise<void> => {
  try {
    const dataUrl = await toPng(element, {
      quality: 0.95,
      backgroundColor: 'white',
      style: {
        // Ensure proper rendering of gradients and other styles
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    });

    // Create a link element to download the image
    const link = document.createElement('a');
    link.download = 'transport-wrapped.png';
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('No s\'ha pogut generar la imatge');
  }
};