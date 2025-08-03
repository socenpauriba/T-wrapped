import { TransportData, TransportSummary } from '../types/transport';

export const analyzeTransportData = (data: TransportData[]): TransportSummary => {
    const stationCount: { [key: string]: number } = {};
  const agencyCount: { [key: string]: number } = {};
  const validationsByDayCount: { [key: string]: number } = {};
  const agencyCount: { [key: string]: number } = {};

  // Count occurrences
  data.forEach((entry) => {
    if (entry.station) {
      stationCount[entry.station] = (stationCount[entry.station] || 0) + 1;
    }
    if (entry.agency) {
      agencyCount[entry.agency] = (agencyCount[entry.agency] || 0) + 1;
    }
    if (entry.date) {
      const dateString = entry.date.toISOString().split('T')[0];
      validationsByDayCount[dateString] = (validationsByDayCount[dateString] || 0) + 1;
    }
  });

  // Get top 5 stations
  const topStations = Object.entries(stationCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([station, count]) => ({ station, count }));

  // Get top 5 agencies
  const topAgencies = Object.entries(agencyCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([agency, count]) => ({ agency, count }));

    const validationsByDay = Object.entries(validationsByDayCount).map(([date, count]) => ({
    date,
    count,
  }));

  return {
    totalValidations: data.length,
    topStations,
    topAgencies,
    validationsByDay,
  };
};