// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// Emulador Android: 10.0.2.2 apunta al PC donde corre el API.
// Teléfono físico (misma Wi‑Fi): en la app, Bienvenida → "Dirección del servidor"
//   o cambia apiUrl a la IP de tu PC (ipconfig / ifconfig).

export const environment = {
  production: false,
  apiUrl: 'http://10.0.2.2:3000/api',
  backendUrl: 'http://10.0.2.2:3000',
  clinicName: 'ACTIVA Health Center',
  clinicAddress: 'Av. Principal 123, Ciudad',
  clinicMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Clínica+Fisioterapia'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
