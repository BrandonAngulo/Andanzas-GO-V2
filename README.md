<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Andanzas GO

Andanzas GO es una aplicación web interactiva y gamificada diseñada para descubrir, recorrer y valorar el patrimonio cultural, artístico e histórico de Santiago de Cali, Colombia. 

No es simplemente un mapa de sitios turísticos: es un dispositivo pedagógico y una lectura narrativa del territorio, que permite a los usuarios conectar con las memorias de la ciudad a través del juego, la exploración física y el relato comunitario.

---

## 🚀 Características Principales

1.  **Mapa Interactivo Cultural**: Mapeo georreferenciado de 100 sitios emblemáticos de Cali, clasificados en categorías (museos, teatros, espacio público, escuelas de salsa, haciendas históricas, etc.), cada uno con descripciones detalladas, significados históricos y datos curiosos bilingües.
2.  **Misiones y Rutas Temáticas**: 16 rutas seleccionadas (como la *Ruta de la Salsa*, *Ruta Colonial* o *Ruta del Arte Urbano*) con un "Modo Misión" inmersivo:
    *   *Briefing* inicial narrado en estilo terminal.
    *   Validación híbrida de visitas: Registro real mediante geolocalización GPS (100m) o trivia manual si el usuario está lejos o sin cobertura.
    *   Desafíos y trivias culturales con anécdotas didácticas.
3.  **Sistema de Gamificación Completo**:
    *   Puntos de Cultura y niveles acumulativos.
    *   14 insignias únicas desbloqueables en la base de datos (4 insignias por acciones de la app y 10 insignias específicas ligadas a las rutas culturales).
4.  **Agenda Cultural del Segundo Semestre 2026**: Integración completa y verificada de los eventos culturales de la ciudad de julio a diciembre (Festival Petronio Álvarez 30 Años, Feria de Cali, Festival de Salsa, FIL Cali, Premios Macondo, etc.).
5.  **Accesibilidad e i18n**: Soporte completo español/inglés y menú de accesibilidad (escala de grises, alto contraste y tamaño de fuente dinámico).
6.  **PWA y Soporte Offline**: Aplicación Web Progresiva real con Service Worker personalizado para el almacenamiento en caché del App Shell y almacenamiento en caché inteligente de las consultas de Supabase y librerías externas (esm.sh), permitiendo navegar y completar rutas sin conexión.

---

## 🛠️ Stack Tecnológico

*   **Frontend**: React (v18), Vite, TypeScript, Tailwind CSS (v3).
*   **Servicios Externos**: Google Maps JavaScript API (a través de `@vis.gl/react-google-maps`).
*   **Backend & DB**: Supabase (PostgreSQL) para autenticación, perfiles, favoritos, reseñas con fotos, insignias, registro de puntos y soporte.
*   **PWA**: Service Worker personalizado (`sw.js`) y manifest web nativo.

---

## 📁 Estructura del Proyecto

*   `components/`: Componentes UI y modales (panels, map, ui, views).
*   `contexts/`: Coordinadores globales de estado (Auth, Datos de la App, Progreso de Usuario).
*   `services/`: Clientes API y RPC para interactuar con la base de datos de Supabase.
*   `hooks/`: Custom hooks para búsquedas, filtros y lógica de navegación de rutas.
*   `public/`: Carpeta de distribución PWA (Service Worker, manifest.json e iconos generados).
*   `init_db.sql`: Estructura completa de la base de datos (tablas, RLS, triggers y funciones RPC).

---

## 💻 Ejecución Local

### Requisitos Previos: Node.js (v18 o superior).

1.  **Clonar e Instalar Dependencias**:
    ```bash
    npm install
    ```
2.  **Configurar Variables de Entorno (`.env`)**:
    Crea un archivo `.env` en la raíz con las siguientes credenciales:
    ```env
    VITE_SUPABASE_URL=tu_supabase_url
    VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
    VITE_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key
    ```
3.  **Iniciar Servidor de Desarrollo**:
    ```bash
    npm run dev
    ```
4.  **Compilar para Producción y Probar PWA**:
    ```bash
    npm run build
    npm run preview
    ```
