/**
 * Decodifica el payload de un JWT sin librerías externas.
 * No valida la firma — solo extrae los datos del payload.
 */
export function decodeJwt(token: string): any {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}
