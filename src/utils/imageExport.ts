import { toPng } from 'html-to-image';

export const exportToImage = async (element: HTMLElement): Promise<void> => {
  try {
    const originalStyles = {
      width: element.style.width,
      maxWidth: element.style.maxWidth,
      height: element.style.height,
      padding: element.style.padding,
      margin: element.style.margin,
      transform: element.style.transform,
      position: element.style.position
    };

    const targetSize = 1080;

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
      pixelRatio: 2
    });

    Object.entries(originalStyles).forEach(([key, value]) => {
      element.style[key as any] = value;
    });

    const link = document.createElement('a');
    link.download = 'T-wrapped.png';
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('No s\'ha pogut generar la imatge');
  }
};