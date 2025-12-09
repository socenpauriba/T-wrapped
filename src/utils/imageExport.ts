import { TransportSummary } from "../types/transport";
import templateSrc from "../assets/template.png";

// Configuration for text positions (adjust these values based on your template)
const CONFIG = {
  totalValidations: { x: 540, y: 400, fontSize: 120 }, // Center x is 540 for 1080px width
  topStations: { 
    startX: 100, 
    startY: 800, 
    lineHeight: 60,
    fontSize: 40 
  },
  topAgencies: { 
    startX: 600, 
    startY: 800, 
    lineHeight: 60,
    fontSize: 40 
  }
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export const generateImage = async (summary: TransportSummary): Promise<string> => {
  try {
    // 1. Load the template image
    const image = await loadImage(templateSrc);
    
    // 2. Create a canvas with the same dimensions as the image
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Could not get canvas context');

    // 3. Draw the template
    ctx.drawImage(image, 0, 0);

    // 4. Configure text styles
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 5. Draw Total Validations
    ctx.font = `bold ${CONFIG.totalValidations.fontSize}px sans-serif`;
    ctx.fillText(
      summary.totalValidations.toString(), 
      CONFIG.totalValidations.x, 
      CONFIG.totalValidations.y
    );

    // 6. Draw Top Stations
    ctx.textAlign = 'left';
    ctx.font = `bold ${CONFIG.topStations.fontSize}px sans-serif`;
    
    summary.topStations.slice(0, 5).forEach((station, index) => {
      const y = CONFIG.topStations.startY + (index * CONFIG.topStations.lineHeight);
      const text = `${index + 1}. ${station.station} (${station.count})`;
      ctx.fillText(text, CONFIG.topStations.startX, y);
    });

    // 7. Draw Top Agencies
    ctx.textAlign = 'left'; // Or right/center depending on your layout
    ctx.font = `bold ${CONFIG.topAgencies.fontSize}px sans-serif`;

    summary.topAgencies.slice(0, 5).forEach((agency, index) => {
      const y = CONFIG.topAgencies.startY + (index * CONFIG.topAgencies.lineHeight);
      const text = `${index + 1}. ${agency.agency} (${agency.count})`;
      ctx.fillText(text, CONFIG.topAgencies.startX, y);
    });

    // 8. Return Data URL
    return canvas.toDataURL('image/png');

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("No s'ha pogut generar la imatge");
  }
};

export const exportToImage = async (summary: TransportSummary): Promise<void> => {
  const dataUrl = await generateImage(summary);
  const link = document.createElement("a");
  link.download = "T-wrapped.png";
  link.href = dataUrl;
  link.click();
};
