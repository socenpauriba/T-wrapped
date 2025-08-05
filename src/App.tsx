import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileUpload } from './components/FileUpload';
import { Summary } from './components/Summary';
import { Header } from './components/Header';
import { HowTo } from './components/HowTo';
import { Footer } from './components/Footer';
import { useTransportData } from './hooks/useTransportData';

function App() {
  const { t } = useTranslation();
  const { summary, loading, error, handleFileSelect, resetData } = useTransportData();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        {!summary && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xl text-gray-600">
                {t('app.description')}
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <FileUpload onFileSelect={handleFileSelect} />
              {loading && (
                <p className="text-center mt-4 text-gray-600">
                  {t('app.processing')}
                </p>
              )}
              {error && (
                <p className="text-center mt-4 text-red-600">
                  {error}
                </p>
              )}
              <br></br>
              <center><p className="text-xs text-gray-500 mt-1">{t('app.privacy')}</p></center>
            </div>

            <HowTo />
          </div>
        )}

        {summary && (
          <div className="mt-8">
            <Summary summary={summary} />
            <div className="text-center mt-8">
              <button
                onClick={resetData}
                className="px-6 py-3 bg-gradient-to-r from-[#86c04d] to-[#009889] text-white 
                         rounded-lg hover:opacity-90 transition-opacity duration-200 
                         font-semibold shadow-md"
              >
{t('app.newAnalysis')}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;