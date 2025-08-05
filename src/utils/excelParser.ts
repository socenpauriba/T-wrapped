import { read, utils } from "xlsx";
import { TransportData } from "../types/transport";
import { ExcelParseError } from "../types/errors";

type TranslationFunction = (key: string) => string;

export const parseExcelFile = async (file: File, t: TranslationFunction): Promise<TransportData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          throw new ExcelParseError(t('errors.fileReadError'));
        }

        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = read(data, { type: "array" });

        if (!workbook.SheetNames.length) {
          throw new ExcelParseError(t('errors.emptyFileError'));
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
          blankrows: false,
        });

        // Skip empty rows at the beginning
        const headerRowIndex = jsonData.findIndex((row: any[]) =>
          row?.some(
            (cell) =>
              // Spanish headers
              cell === "NUM. TRANSACCIÓN" ||
              cell === "FECHA" ||
              cell === "AGENCIA" ||
              cell === "OPERACIÓN" ||
              cell === "ESTACIÓN FIJO" ||
              // Catalan headers
              cell === "Num.Transacción" ||
              cell === "Data" ||
              cell === "Agència" ||
              cell === "Operació" ||
              cell === "Estació Fix" ||
              // English headers
              cell === "Transaction Num." ||
              cell === "Date" ||
              cell === "Agency" ||
              cell === "Operation" ||
              cell === "Fixed Equipment"
          )
        );

        if (headerRowIndex === -1) {
          throw new ExcelParseError(t('errors.headersNotFoundError'));
        }

        const headers = jsonData[headerRowIndex] as string[];
        
        // Find column indices for different languages
        const findColumnIndex = (columnNames: string[]) => {
          for (const name of columnNames) {
            const index = headers.indexOf(name);
            if (index !== -1) return index;
          }
          return -1;
        };

        const requiredColumns = {
          date: findColumnIndex(["Data", "FECHA", "Date"]),
          agency: findColumnIndex(["Agència", "AGENCIA", "Agency"]),
          operation: findColumnIndex(["Operació", "OPERACIÓN", "Operation"]),
          station: findColumnIndex(["Estació Fix", "ESTACIÓN FIJO", "Fixed Equipment"]),
        };

        // Verify all required columns exist
        if (Object.values(requiredColumns).some((index) => index === -1)) {
          throw new ExcelParseError(t('errors.invalidFormatError'));
        }

        const transportData: TransportData[] = [];

        // Process data rows (skip headers)
        for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (!row || row.length === 0) continue;

          const operation = String(row[requiredColumns.operation] || "").trim();

          const isValidation = operation.includes("Validació") || 
                              operation.includes("Validación") || 
                              operation.includes("validation");
          
          if (isValidation) {
            try {
              const dateStr = row[requiredColumns.date];
              if (!dateStr) continue;

              const [datePart, timePart] = dateStr.split(" ");
              const [day, month, year] = datePart.split("/").map(Number);
              const [hours, minutes, seconds] = timePart.split(":").map(Number);

              const date = new Date(
                year,
                month - 1,
                day,
                hours,
                minutes,
                seconds
              );

              if (isNaN(date.getTime())) {
                console.warn(`${t('errors.invalidDateWarning')} ${i + 1}: ${dateStr}`);
                continue;
              }

              const agency = String(row[requiredColumns.agency] || "").trim();
              const station = String(row[requiredColumns.station] || "").trim();

              if (!agency || !station) {
                console.warn(`${t('errors.incompleteDataWarning')} ${i + 1}`);
                continue;
              }

              transportData.push({
                date,
                agency,
                station,
                operation,
              });
            } catch (error) {
              console.warn(`${t('errors.processingRowError')} ${i + 1}:`, error);
            }
          }
        }

        if (!transportData.length) {
          throw new ExcelParseError(t('errors.noValidationsError'));
        }

        resolve(transportData);
      } catch (error) {
        reject(
          error instanceof ExcelParseError
            ? error
            : new ExcelParseError(t('errors.processingError'))
        );
      }
    };

    reader.onerror = () =>
      reject(new ExcelParseError(t('errors.fileLoadError')));
    reader.readAsArrayBuffer(file);
  });
};
