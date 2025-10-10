import * as XLSX from 'xlsx';

export interface GuestImportData {
  name: string;
  phone: string;
}

export const processExcelFile = (file: File): Promise<GuestImportData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Skip header row and process data
        const guests: GuestImportData[] = [];
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row.length >= 2 && row[0] && row[1]) {
            guests.push({
              name: String(row[0]).trim(),
              phone: String(row[1]).trim()
            });
          }
        }
        
        resolve(guests);
      } catch (error) {
        reject(new Error('Error procesando el archivo Excel'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error leyendo el archivo'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const downloadExcelTemplate = () => {
  const templateData = [
    ['Nombre', 'Teléfono'],
    ['Juan Pérez', '+573001234567'],
    ['María García', '+573007654321'],
    ['Carlos López', '+573009876543']
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Invitados');
  
  // Set column widths
  ws['!cols'] = [
    { width: 20 },
    { width: 15 }
  ];
  
  XLSX.writeFile(wb, 'plantilla_invitados.xlsx');
};