export interface TransportData {
  date: Date;
  agency: string;
  station: string;
  operation: string;
}

export interface TransportSummary {
  totalValidations: number;
  topStations: Array<{
    station: string;
    count: number;
  }>;
  topAgencies: Array<{
    agency: string;
    count: number;
  }>;
}