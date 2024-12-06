import { read, utils } from 'xlsx';
import { TransportData } from '../types/transport';
import { ExcelParseError } from '../types/errors';

export const parseExcelFile = async (file: File): Promise<TransportData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          throw new ExcelParseError('No s\'ha pogut llegir el fitxer');
        }

        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        
        if (!workbook.SheetNames.length) {
          throw new ExcelParseError('El fitxer Excel està buit');
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(worksheet, { 
          header: 1,
          raw: false,
          blankrows: false
        });

        // Skip empty rows at the beginning
        const headerRowIndex = jsonData.findIndex((row: any[]) => 
          row?.some(cell => cell === 'Num.Transacción' || cell === 'Data')
        );

        if (headerRowIndex === -1) {
          throw new ExcelParseError('Format incorrecte: No s\'han trobat les capçaleres esperades');
        }

        const headers = jsonData[headerRowIndex] as string[];
        const requiredColumns = {
          date: headers.indexOf('Data'),
          agency: headers.indexOf('Agència'),
          operation: headers.indexOf('Operació'),
          station: headers.indexOf('Estació Fix')
        };

        // Verify all required columns exist
        if (Object.values(requiredColumns).some(index => index === -1)) {
          throw new ExcelParseError(
            'Format incorrecte: El fitxer ha de contenir les columnes Data, Agència, Operació i Estació Fix'
          );
        }

        const transportData: TransportData[] = [];

        // Process data rows (skip headers)
        for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (!row || row.length === 0) continue;

          const operation = String(row[requiredColumns.operation] || '').trim();
          
          // Only process "Validació d'entrada" records
          if (operation.includes('Validació')) {
            try {
              const dateStr = row[requiredColumns.date];
              if (!dateStr) continue;

              // Parse date in format DD/MM/YYYY HH:mm:ss
              const [datePart, timePart] = dateStr.split(' ');
              const [day, month, year] = datePart.split('/').map(Number);
              const [hours, minutes, seconds] = timePart.split(':').map(Number);
              
              const date = new Date(year, month - 1, day, hours, minutes, seconds);
              
              if (isNaN(date.getTime())) {
                console.warn(`Data invàlida a la fila ${i + 1}: ${dateStr}`);
                continue;
              }

              const agency = String(row[requiredColumns.agency] || '').trim();
              const station = String(row[requiredColumns.station] || '').trim();

              if (!agency || !station) {
                console.warn(`Dades incompletes a la fila ${i + 1}`);
                continue;
              }

              transportData.push({
                date,
                agency,
                station,
                operation
              });
            } catch (error) {
              console.warn(`Error processant la fila ${i + 1}:`, error);
            }
          }
        }

        if (!transportData.length) {
          throw new ExcelParseError('No s\'han trobat validacions al fitxer');
        }

        resolve(transportData);
      } catch (error) {
        reject(error instanceof ExcelParseError ? error : new ExcelParseError('Error processant el fitxer'));
      }
    };

    reader.onerror = () => reject(new ExcelParseError('Error llegint el fitxer'));
    reader.readAsArrayBuffer(file);
  });
};