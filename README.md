# ✈️ CambioRápido

> Calculadora de divisas en tiempo real, diseñada para el viajero latinoamericano.

![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18-61dafb)
![Vite](https://img.shields.io/badge/Vite-5-646cff)
![API](https://img.shields.io/badge/API-ExchangeRate--API-orange)

---

## ¿Qué es esto?

CambioRápido resuelve un problema concreto: estás en Argentina, ves un precio en pesos y no tenés idea de cuánto es en colones o en dólares. Abrir Google, buscar, esperar — es lento. Con esta app, lo tenés en un tap.

Construida con React + Vite, se conecta a tasas de cambio en tiempo real y está pensada primero para LATAM — con las monedas de la región priorizadas y una interfaz que funciona bien en móvil.

---

## Features

- 💱 **Conversión en tiempo real** — tasas actualizadas cada 5 minutos via ExchangeRate-API
- ⭐ **Monedas favoritas** — guardá las que usás seguido, convertís en segundos
- 🌎 **32 monedas** — cobertura completa de LATAM + las principales del mundo, con bandera y país
- 📈 **Gráfico de tendencia** — sparkline visual por par de monedas
- 🕘 **Historial** — registro de conversiones de la sesión, tocando cualquier resultado
- ☀️🌙 **Modo claro/oscuro** — toggle instantáneo
- 📱 **Mobile-first** — diseñado para usarse con una mano, parado en una feria

---

## Tech Stack

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | React 18 | Componentes reactivos, hooks, ecosistema maduro |
| Build tool | Vite 5 | HMR instantáneo, build rápido, configuración mínima |
| Estilos | CSS-in-JS (template strings) | Zero dependencies, scoping automático, portable |
| API | ExchangeRate-API (open.er-api.com) | Gratis, sin API key, confiable, HTTPS |
| Hosting | Vercel | Deploy automático desde GitHub, CDN global, gratis |

---

## Correrlo localmente

```bash
# 1. Clonar
git clone https://github.com/pprendas/cambio-rapido.git
cd cambio-rapido

# 2. Instalar dependencias
npm install

# 3. Correr en desarrollo
npm run dev

# 4. Build para producción
npm run build
```

Requiere Node.js 18+.

---

## Estructura del proyecto

```
cambio-rapido/
├── src/
│   ├── App.jsx          # Componente principal — toda la lógica y UI
│   └── main.jsx         # Entry point de React
├── index.html           # HTML base
├── vite.config.js       # Configuración de Vite
└── package.json
```

---

## API utilizada

[ExchangeRate-API](https://www.exchangerate-api.com/) — endpoint público gratuito:

```
GET https://open.er-api.com/v6/latest/USD
```

Retorna tasas de cambio relativas al USD como moneda base para todas las monedas soportadas. Sin API key requerida para el tier gratuito.

**Limitaciones del tier gratuito:**
- 1,500 requests/mes
- Actualización diaria (no por segundo)
- Sin historial real de tasas

Para producción con más tráfico, considerar el tier pago o alternativas como Fixer.io o CurrencyBeacon.

---

## Seguridad

- No se almacenan datos del usuario (sin backend, sin base de datos)
- No hay login ni manejo de información sensible
- Las tasas se consumen de una API pública — ningún dato sale del dispositivo
- HTTPS en todo el flujo (Vercel + API)
- Sin dependencias externas de UI (sin riesgo de supply chain attacks por npm)

---

## Roadmap

- [ ] Modo offline con caché en localStorage
- [ ] Tipo de cambio paralelo/informal (dólar blue ARG, etc.)
- [ ] Alertas de tasa — notificación cuando llegue a X valor
- [ ] PWA — instalar como app nativa en iOS/Android
- [ ] Soporte a criptomonedas (BTC, ETH, USDT)
- [ ] Widget para pantalla de inicio

---

## Contribuir

Pull requests bienvenidos. Para cambios grandes, abrí un issue primero.

1. Fork del repo
2. Creá tu rama (`git checkout -b feature/nueva-moneda`)
3. Commit (`git commit -m 'feat: agregar soporte para XYZ'`)
4. Push (`git push origin feature/nueva-moneda`)
5. Abrí un Pull Request

---

## Licencia

MIT — libre para usar, modificar y distribuir.

---

Hecho con ☕ desde Costa Rica
