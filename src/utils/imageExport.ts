import { TransportSummary } from "../types/transport";
import templateSrc from "../assets/template.png";

// Configuration for text positions (adjust these values based on your template)
const CONFIG = {
  totalValidations: { x: 240, y: 1710, fontSize: 130 },
  topStations: { 
    leftX: 95,      // Left position for station names
    rightX: 930,    // Right position for validation counts
    maxWidth: 750,  // Maximum width for station names before truncating
    startY: 850, 
    lineHeight: 55,
    fontSize: 35 
  },
  topAgencies: { 
    leftX: 95,      // Left position for agency names
    rightX: 930,    // Right position for validation counts
    maxWidth: 750,  // Maximum width for agency names before truncating
    startY: 1250, 
    lineHeight: 55,
    fontSize: 35
  }
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
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

    // Helper function to truncate text to max 34 characters
    const truncateText = (text: string, maxChars: number = 35): string => {
      if (text.length <= maxChars) return text;
      return text.slice(0, maxChars - 3) + '...';
    };

    // 6. Draw Top Stations
    ctx.font = `bold ${CONFIG.topStations.fontSize}px sans-serif`;
    
    summary.topStations.slice(0, 5).forEach((station, index) => {
      const y = CONFIG.topStations.startY + (index * CONFIG.topStations.lineHeight);
      
      // Draw station name on the left (truncated if needed)
      ctx.textAlign = 'left';
      const stationName = `${index + 1}. ${station.station}`;
      const truncatedStation = truncateText(stationName, 34);
      ctx.fillText(truncatedStation, CONFIG.topStations.leftX, y);
      
      // Draw validation count on the right
      ctx.textAlign = 'right';
      const validationText = `${station.count} validacions`;
      ctx.fillText(validationText, CONFIG.topStations.rightX, y);
    });

    // 7. Draw Top Agencies
    ctx.font = `bold ${CONFIG.topAgencies.fontSize}px sans-serif`;

    summary.topAgencies.slice(0, 5).forEach((agency, index) => {
      const y = CONFIG.topAgencies.startY + (index * CONFIG.topAgencies.lineHeight);
      
      // Draw agency name on the left (truncated if needed)
      ctx.textAlign = 'left';
      const agencyName = `${index + 1}. ${agency.agency}`;
      const truncatedAgency = truncateText(agencyName, 34);
      ctx.fillText(truncatedAgency, CONFIG.topAgencies.leftX, y);
      
      // Draw validation count on the right
      ctx.textAlign = 'right';
      const validationText = `${agency.count} validacions`;
      ctx.fillText(validationText, CONFIG.topAgencies.rightX, y);
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
