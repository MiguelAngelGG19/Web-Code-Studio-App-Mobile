# ACTIVA – App Móvil

App para pacientes de fisioterapia (Ionic Angular + Capacitor, Android).

---

## Requisitos

- Node.js 18+
- Backend ACTIVA corriendo (por defecto `http://localhost:3000/api`)

---

## Desarrollo

```bash
npm install
npm start
```

Abre la URL que indique el CLI (ej. `http://localhost:8100`). La app usa `src/environments/environment.ts` (`apiUrl: 'http://localhost:3000/api'`).

---

## Build para producción y Android

```bash
# 1. Configurar API y clínica en src/environments/environment.prod.ts
npm run build -- --configuration=production
npx cap sync android
npx cap open android
```

En Android Studio: Run en emulador o dispositivo conectado.

---

## Publicación en Play Store

Sigue el checklist en **[PLAYSTORE-RELEASE.md](PLAYSTORE-RELEASE.md)** (URL de API, datos de clínica, política de privacidad, generación del AAB, etc.).

---

## Documentación técnica

- **[DOCUMENTACION-IMPLEMENTACION.md](../DOCUMENTACION-IMPLEMENTACION.md)** – Pantallas, flujos, APIs y configuración del proyecto completo.
