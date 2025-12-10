import React from 'react';
import { FileUpload } from './components/FileUpload';
import { Summary } from './components/Summary';
import { Header } from './components/Header';
import { HowTo } from './components/HowTo';
import { Footer } from './components/Footer';
import { useTransportData } from './hooks/useTransportData';
import AnalysisTab from './components/AnalysisTab';
import { useState } from 'react';

function App() {
  const { summary, rawData, loading, error, handleFileSelect, resetData, setError } = useTransportData();
  const [activeTab, setActiveTab] = useState<'wrapped' | 'analysis'>('wrapped');

  const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded ${active ? 'bg-[#009889] text-white' : 'bg-white text-gray-700 border'}`}>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        {!summary && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xl text-gray-600">
                Descobreix els teus hàbits de transport públic. Puja el teu fitxer Excel
                i obté un resum personalitzat del teu ús del transport.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <FileUpload onFileSelect={handleFileSelect} onError={setError} />
              {loading && (
                <p className="text-center mt-4 text-gray-600">
                  Processant el teu fitxer...
                </p>
              )}
              {error && (
                <p className="text-center mt-4 text-red-600">
                  {error}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-4 text-center">No guardem ni recollim aquestes dades</p>
            </div>

            <HowTo />
          </div>
        )}

        {summary && (
          <div className="mt-8">
            {/* Tabs for Wrapped / Analysis */}
            <div className="flex items-center gap-4 justify-center mb-6">
              <TabButton label="Wrapped" active={activeTab === 'wrapped'} onClick={() => setActiveTab('wrapped')} />
              <TabButton label="Anàlisi" active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} />
            </div>

            {activeTab === 'wrapped' ? (
              <>
                <Summary summary={summary} />
                <div className="text-center mt-8">
                  <button
                    onClick={resetData}
                    className="px-6 py-3 bg-gradient-to-r from-[#86c04d] to-[#009889] text-white 
                             rounded-lg hover:opacity-90 transition-opacity duration-200 
                             font-semibold shadow-md"
                  >
                    Analitzar un altre fitxer
                  </button>
                </div>
              </>
            ) : (
              <AnalysisTab data={rawData} />
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;