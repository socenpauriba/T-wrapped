import React, { useRef } from "react";
import { TransportSummary } from "../types/transport";
import { Train, Diamond, TowerControl, Share2, Download } from "lucide-react";
import { StatCard } from "./summary/StatCard";
import { TopList } from "./summary/TopList";
import ValidationsCalendar from "./summary/ValidationsCalendar";
import { useWebImageShare } from "../hooks/useWebImageShare";

// Lazy load the image export utility
// const exportToImage = lazy(() =>
//   import("../utils/imageExport").then((module) => ({
//     default: module.exportToImage,
//   }))
// );

interface SummaryProps {
  summary: TransportSummary;
}

export const Summary: React.FC<SummaryProps> = ({ summary }) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const { shareImage, isSharing } = useWebImageShare();

  const handleDownload = async () => {
    if (summary) {
      try {
        const exportFn = await import("../utils/imageExport").then(
          (module) => module.exportToImage
        );
        await exportFn(summary);
      } catch (error) {
        console.error("Error generating image:", error);
        alert("Hi ha hagut un error generant la imatge");
      }
    }
  };

  const handleNativeShare = async () => {
    if (summary) {
      try {
        const generateFn = await import("../utils/imageExport").then(
          (module) => module.generateImage
        );
        const dataUrl = await generateFn(summary);
        const result = await shareImage(dataUrl, 'T-Wrapped', 'El meu resum de T-mobilitat!');
        
        if (!result.success) {
          // Check if it's because sharing is not supported
          if (result.error instanceof Error && result.error.message === 'Native file sharing not supported') {
             alert("El teu dispositiu no suporta la compartició d'imatges directament. La imatge es descarregarà.");
             const link = document.createElement("a");
             link.download = "T-wrapped.png";
             link.href = dataUrl;
             link.click();
          }
        }
      } catch (error) {
        console.error("Error sharing image:", error);
        alert("Hi ha hagut un error compartint la imatge");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={summaryRef}
        className="w-full max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-xl"
      >
        <h2
          className="title-wrapped text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#86c04d] to-[#009889] 
                       text-transparent bg-clip-text"
        >
          El teu T-mobilitat wrapped
        </h2>

        <div className="grid gap-8">
          <StatCard
            icon={Train}
            title="Total Validacions"
            className="stat-card-validations"
          >
            <p className="text-4xl md:text-5xl font-bold text-[#009889]">
              {summary.totalValidations}
            </p>
          </StatCard>

          <StatCard
            icon={Diamond}
            title="Top 5 estacions"
            className="stat-card-stations"
          >
            <TopList
              items={summary.topStations.map((station) => ({
                name: station.station,
                count: station.count,
              }))}
            />
          </StatCard>

          <StatCard
            icon={TowerControl}
            title="Top 5 operadores"
            className="stat-card-operadores"
          >
            <TopList
              items={summary.topAgencies.map((agency) => ({
                name: agency.agency,
                count: agency.count,
              }))}
            />
          </StatCard>
        </div>

        {/* Contribution calendar */}
        <ValidationsCalendar data={summary.validationsByDay} />

        <div className="mt-12 text-center">
          <p className="text-sm md:text-base font-medium text-gray-500">
            Fes el teu a 🌐 t-wrapped.nuvol.cat
          </p>
        </div>
      </div>
      <br></br>
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-white text-[#009889] border-2 border-[#009889]
                   rounded-lg hover:bg-gray-50 transition-colors duration-200 
                   font-semibold shadow-md"
        >
          <Download className="w-5 h-5" />
          Descarregar
        </button>

        <button
          onClick={handleNativeShare}
          disabled={isSharing}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#86c04d] to-[#009889] 
                   text-white rounded-lg hover:opacity-90 transition-opacity duration-200 
                   font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Share2 className="w-5 h-5" />
          {isSharing ? 'Compartint...' : 'Compartir'}
        </button>
      </div>
    </div>
  );
};
