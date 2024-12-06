export const EXCEL_MIME_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/x-excel',
  'application/xls',
  'application/xlsx'
] as const;

export const COLUMN_MAPPINGS = {
  date: ['data', 'date', 'fecha'],
  agency: ['agència', 'agencia', 'agency'],
  operation: ['operació', 'operacion', 'operation'],
  transaction: ['transacció', 'transaccion', 'transaction'],
  station: ['estació fix', 'estacion fija', 'fixed station']
} as const;

export const VALIDATION_TYPES = {
  operation: 'Validació',
  transaction: 'Validació d\'entrada'
} as const;