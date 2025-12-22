import { TransportSummary } from "../types/transport";
import templateSrc from "../assets/template.png";

// Import all operadora images
import FGC from "../assets/operadores/FGC.png";
import FMB from "../assets/operadores/FMB.png";
import RENFE from "../assets/operadores/RENFE OPERADORA.png";
import TB from "../assets/operadores/TB.png";
import TUSGSAL from "../assets/operadores/TUSGSAL.png";

const OPERADORA_IMAGES: Record<string, string> = {
  FGC,
  FMB,
  'RENFE OPERADORA': RENFE,
  TB,
  TUSGSAL
};

// Configuration for text positions (adjust these values based on your template)
const CONFIG = {
  totalValidations: { x: 240, y: 1470, fontSize: 140 },
  topStations: { 
    leftX: 95,      // Left position for station names
    rightX: 980,    // Right position for validation counts
    maxWidth: 800,  // Maximum width for station names before truncating
    startY: 425, 
    lineHeight: 62,
    fontSize: 40
  },
  topAgencies: { 
    leftX: 95,      // Left position for agency names
    rightX: 980,    // Right position for validation counts
    maxWidth: 800,  // Maximum width for agency names before truncating
    startY: 910, 
    lineHeight: 62,
    fontSize: 40
  },
  operadora: {
    x: 550,
    y: 1315,
    width: 403, //807
    height: 371, //739
    defaultImage: 'TB.png'
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

    // 4. Load and draw operadora logo
    const mostUsedOperadora = summary.topAgencies[0]?.agency || CONFIG.operadora.defaultImage;
    const operadoraImageSrc = OPERADORA_IMAGES[mostUsedOperadora] || OPERADORA_IMAGES[CONFIG.operadora.defaultImage];
    
    if (operadoraImageSrc) {
      try {
        const operadoraImage = await loadImage(operadoraImageSrc);
        ctx.drawImage(
          operadoraImage,
          CONFIG.operadora.x,
          CONFIG.operadora.y,
          CONFIG.operadora.width,
          CONFIG.operadora.height
        );
      } catch (error) {
        console.warn(`Failed to load operadora image for ${mostUsedOperadora}, using default`);
        try {
          const defaultImage = await loadImage(OPERADORA_IMAGES[CONFIG.operadora.defaultImage]);
          ctx.drawImage(
            defaultImage,
            CONFIG.operadora.x,
            CONFIG.operadora.y,
            CONFIG.operadora.width,
            CONFIG.operadora.height
          );
        } catch (fallbackError) {
          console.warn("Failed to load default operadora image");
        }
      }
    }

    // 5. Configure text styles
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 6. Draw Total Validations
    ctx.font = `bold ${CONFIG.totalValidations.fontSize}px sans-serif`;
    ctx.fillText(
      summary.totalValidations.toString(), 
      CONFIG.totalValidations.x, 
      CONFIG.totalValidations.y
    );

    // Helper function to truncate text to a max characters
    const truncateText = (text: string, maxChars: number = 25): string => {
      if (text.length <= maxChars) return text;
      return text.slice(0, maxChars - 3) + '...';
    };

    // 7. Draw Top Stations
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

    // 8. Draw Top Agencies
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

    // 9. Return Data URL
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
