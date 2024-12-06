import { EXCEL_MIME_TYPES } from './constants';
import { ValidationError } from '../types/errors';

export const validateExcelFile = (file: File): void => {
  if (!isValidExcelFile(file)) {
    throw new ValidationError('Si us plau, selecciona un fitxer Excel vàlid (.xls o .xlsx)');
  }
};

export const isValidExcelFile = (file: File): boolean => {
  return EXCEL_MIME_TYPES.includes(file.type as any) || 
         file.name.toLowerCase().endsWith('.xls') || 
         file.name.toLowerCase().endsWith('.xlsx');
};

export const validateDate = (dateStr: string): Date => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new ValidationError(`Data invàlida: ${dateStr}`);
  }
  return date;
};