/**
 * Producción: pon la URL HTTPS real del API.
 * Pruebas locales: igual que dev (10.0.2.2 emulador) o IP del PC; en teléfono usa Bienvenida → servidor.
 */
export const environment = {
  production: true,
  apiUrl: 'http://10.0.2.2:3000/api',
  backendUrl: 'http://10.0.2.2:3000',
  clinicName: 'ACTIVA Health Center',
  clinicAddress: 'Av. Principal 123, Ciudad',
  clinicMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Clínica+Fisioterapia'
};