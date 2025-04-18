  // Función para convertir string a número de manera segura
 export const parseNumber = (value: string): number => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  // Función simple para generar IDs únicos para React Native
export function generateUniqueId() {
  return (
    "id_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Date.now().toString(36)
  )
}