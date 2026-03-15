/**
 * Configuración de producción.
 * Antes de publicar en Play Store: define apiUrl real y datos de la clínica.
 */
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-backend.com/api',
  clinicName: 'ACTIVA Health Center',
  clinicAddress: 'Av. Principal 123, Ciudad',
  clinicMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Clínica+Fisioterapia'
};