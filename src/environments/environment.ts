// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
//
// 📱 GUÍA DE URLs SEGÚN DONDE CORRES LA APP:
// ✅ Navegador (npm start):          apiUrl: 'http://localhost:3000/api'
// ✅ Emulador Android Studio:        apiUrl: 'http://10.0.2.2:3000/api'
// ✅ Teléfono físico (misma WiFi):   apiUrl: 'http://192.168.1.4:3000/api'  ← ACTIVO AHORA

export const environment = {
  production: false,
  apiUrl: 'http://192.168.1.4:3000/api',
  backendUrl: 'http://192.168.1.4:3000',
  clinicName: 'ACTIVA Health Center',
  clinicAddress: 'Av. Principal 123, Ciudad',
  clinicMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Clínica+Fisioterapia'
};
