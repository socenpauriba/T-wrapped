import React, { useRef, lazy, Suspense } from "react";
import { TransportSummary } from "../types/transport";
import { Train, Diamond, TowerControl, Share2 } from "lucide-react";
import { StatCard } from "./summary/StatCard";
import { TopList } from "./summary/TopList";

// Lazy load the image export utility
const exportToImage = lazy(() =>
  import("../utils/imageExport").then((module) => ({
    default: module.exportToImage,
  }))
);

interface SummaryProps {
  summary: TransportSummary;
}

export const Summary: React.FC<SummaryProps> = ({ summary }) => {
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (summaryRef.current) {
      try {
        const exportFn = await import("../utils/imageExport").then(
          (module) => module.exportToImage
        );
        await exportFn(summaryRef.current);
      } catch (error) {
        console.error("Error generating image:", error);
        alert("Hi ha hagut un error generant la imatge");
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

        <div className="mt-12 text-center">
          <p className="text-sm md:text-base font-medium text-gray-500">
            Fes el teu a 🌐 t-wrapped.nuvol.cat
          </p>
        </div>
      </div>
      <br></br>
      <div className="flex justify-center">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#86c04d] to-[#009889] 
                   text-white rounded-lg hover:opacity-90 transition-opacity duration-200 
                   font-semibold shadow-md"
        >
          <Share2 className="w-5 h-5" />
          Compartir a xarxes socials
        </button>
      </div>
    </div>
  );
};
