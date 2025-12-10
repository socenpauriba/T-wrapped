import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onError: (message: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onError }) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const isValidExcelFile = (file: File) => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/x-excel',
      'application/xls',
      'application/xlsx'
    ];
    return validTypes.includes(file.type) || 
           file.name.toLowerCase().endsWith('.xls') || 
           file.name.toLowerCase().endsWith('.xlsx');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && isValidExcelFile(file)) {
      onFileSelect(file);
    } else {
      onError('Si us plau, selecciona un fitxer Excel vàlid (.xls o .xlsx)');
    }
  }, [onFileSelect, onError]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidExcelFile(file)) {
      onFileSelect(file);
      // Reset the input value to allow selecting the same file again
      e.target.value = '';
    } else if (file) {
      onError('Si us plau, selecciona un fitxer Excel vàlid (.xls o .xlsx)');
    }
  }, [onFileSelect, onError]);

  return (
    <div
      className="w-full max-w-md p-8 border-2 border-dashed border-[#86c04d] rounded-lg 
                 hover:border-[#009889] transition-colors duration-200 cursor-pointer
                 bg-white shadow-md"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center space-y-4 cursor-pointer"
      >
        <Upload className="w-12 h-12 text-[#86c04d]" />
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            Arrossega el teu fitxer Excel aquí
          </p>
          <p className="text-sm text-gray-500">
            o fes clic per seleccionar-lo
          </p>
          <p className="text-xs text-[#009889] mt-2">
            Format T-mobilitat
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Històric de moviments de suport
          </p>
        </div>
      </label>
    </div>
  );
};