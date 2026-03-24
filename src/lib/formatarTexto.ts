
export const formatarTexto = (texto: string, variaveis: Record<string, string | number>) => {
  return texto.replace(/\[(\w+)\]/g, (match, key) => 
    variaveis[key] !== undefined ? String(variaveis[key]) : match
  );
};

// Function to format text with date variables
export const formatarTextoComDatas = (
  texto: string, 
  variaveis: Record<string, string | number | Date>,
  formatarData?: (data: Date) => string
) => {
  return texto.replace(/\[(\w+)\]/g, (match, key) => {
    const valor = variaveis[key];
    
    if (valor === undefined) return match;
    
    if (valor instanceof Date && formatarData) {
      return formatarData(valor);
    }
    
    return String(valor);
  });
};
