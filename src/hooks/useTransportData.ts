import { useState, useCallback } from 'react';
import { TransportSummary } from '../types/transport';
import { parseExcelFile } from '../utils/excelParser';
import { analyzeTransportData } from '../utils/analyzeData';
import { validateExcelFile } from '../utils/validation';

interface UseTransportDataReturn {
  summary: TransportSummary | null;
  rawData: import('../types/transport').TransportData[];
  loading: boolean;
  error: string | null;
  handleFileSelect: (file: File) => Promise<void>;
  resetData: () => void;
  setError: (error: string | null) => void;
}

export const useTransportData = (): UseTransportDataReturn => {
  const [summary, setSummary] = useState<TransportSummary | null>(null);
  const [rawData, setRawData] = useState<import('../types/transport').TransportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      validateExcelFile(file);
      const data = await parseExcelFile(file);
      const analyzedData = analyzeTransportData(data);
      setSummary(analyzedData);
      setRawData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperat processant el fitxer');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetData = useCallback(() => {
    setSummary(null);
    setError(null);
    setRawData([]);
  }, []);

  return {
    summary,
    rawData,
    loading,
    error,
    handleFileSelect,
    resetData,
    setError
  };
};