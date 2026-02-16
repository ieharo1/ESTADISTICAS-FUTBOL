# Estadísticas Fútbol Profesional - Europa

Sistema web completo para análisis y visualización de estadísticas de fútbol profesional de ligas europeas, construido con **Node.js + Express + MongoDB + ECharts + Bootstrap 5** bajo arquitectura **MVC**.

## Stack tecnológico

- Backend: Node.js + Express.js
- Frontend: HTML5 + Bootstrap 5 + JavaScript vanilla
- Gráficos: Apache ECharts
- Base de datos: MongoDB + Mongoose
- Motor de vistas: EJS

## Funcionalidades incluidas

### 1) Dashboard principal
- Resumen por liga (goles totales, promedio por partido, mejor ataque, mejor defensa).
- Tabla de posiciones dinámica con puntos y diferencia de goles.
- Gráficos interactivos:
  - Barras (goles por equipo)
  - Radar (comparativa top 5)
  - Pie (distribución de puntos)

### 2) Vista por equipo
- Goles anotados/recibidos.
- Posesión promedio.
- Tiros al arco.
- Efectividad.
- xG simulado, índice defensivo, eficiencia ofensiva.
- Racha reciente (W/D/L).
- Evolución temporal de rendimiento (línea).
- Heatmap de indicadores clave.

### 3) Vista comparativa
- Comparación entre 2+ equipos seleccionados.
- Radar avanzado (xG, ofensiva, defensiva, posesión, efectividad).
- Barra + línea (goles y efectividad).
- Comparación entre ligas con curva de xG simulado.

## Estructura

```
/config
/controllers
/models
/routes
/public
/views
scripts/
server.js
package.json
```

## Requisitos

- Node.js 18+
- MongoDB local o remoto

## Instalación

1. Clonar o abrir el proyecto.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear archivo `.env` a partir de `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Ajustar `MONGODB_URI` según tu entorno.

## Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción local
```bash
npm start
```

El servidor estará en `http://localhost:3000` (o puerto definido en `PORT`).

## Carga automática de datos

Al iniciar la app:
- Se conecta a MongoDB.
- Si no hay equipos en la colección, ejecuta seed automático con dataset realista de ligas europeas (mínimo 5 equipos por liga).

También puedes forzar el seed manual:
```bash
npm run seed
```

## API REST disponible

- `GET /api/leagues` → resumen de todas las ligas.
- `GET /api/leagues/:league` → detalle por liga.
- `GET /api/teams` → catálogo de equipos.
- `GET /api/teams/:id` → detalle de equipo.
- `GET /api/compare?ids=id1,id2,...` → comparativa de equipos.

## Manejo de errores

- Middleware de errores para API y vistas.
- Página de error 404 y 500.

## Scripts npm

- `npm start` → iniciar servidor.
- `npm run dev` → iniciar con nodemon.
- `npm run seed` → regenerar dataset.

---

## 📄 Licencia

MIT — contribuciones bienvenidas 🚀

---

🧑‍💻 Isaac Haro

Ingeniero en Sistemas · Full Stack · Automatización · Data

Isaac Esteban Haro Torres
- 📧 zackharo1@gmail.com
- 📱 098805517
- 💻 [GitHub](https://github.com/ieharo1)

Licencia

MIT — contribuciones bienvenidas 🚀

