# Guía de Despliegue del Sistema de Gestión de Pedidos (Mini-OMS)

Esta guía te ayudará a ejecutar el proyecto localmente y a desplegarlo en producción de forma unificada (Frontend en React + Backend en Flask + Base de Datos) utilizando **Vercel** y **Vercel Postgres**. El backend cuenta con soporte híbrido automático: usa **SQLite** localmente para facilitar el desarrollo rápido, y conmuta a **Vercel Postgres** de forma transparente al ser desplegado en producción.

---

## 1. Ejecución Local (Desarrollo)

### Requisitos Previos
- Tener instalado **Python 3.9 o superior**.
- Tener instalado **Node.js 18 o superior**.

### Paso A: Levantar el Backend (Flask con SQLite)

1. Abre tu terminal y navega al directorio del backend:
   ```bash
   cd backend
   ```
2. Crea un entorno virtual (opcional pero recomendado):
   ```bash
   python -m venv venv
   # En Windows:
   venv\Scripts\activate
   # En macOS/Linux:
   source venv/bin/activate
   ```
3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Inicializa la base de datos local (creará el archivo `oms.db` e insertará los registros semilla):
   ```bash
   python database/connection.py
   ```
5. Ejecuta el servidor de desarrollo de Flask:
   ```bash
   python app.py
   ```
   *El backend estará disponible en `http://127.0.0.1:5000`*.

---

### Paso B: Levantar el Frontend (React + Vite)

1. Abre otra terminal y navega al directorio del frontend:
   ```bash
   cd frontend
   ```
2. Instala los módulos de Node.js:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
   *El frontend estará disponible en `http://localhost:5173`*.

---

## 2. Despliegue en Producción (Vercel con Vercel Postgres)

El proyecto está configurado como un **Monorepo Unificado** mediante el archivo `vercel.json` en la raíz. Al desplegarlo a Vercel, este se encargará de:
1. Compilar el frontend en React de forma estática.
2. Desplegar el backend de Flask como una **función Serverless de Python** bajo la ruta `/api/v1/*` (apuntando a `api/index.py`).
3. Eliminar los problemas de **CORS** en producción, ya que tanto la aplicación visual como la API se ejecutarán bajo el mismo dominio de Vercel.

### Paso 1: Subir el Código a GitHub
Crea un repositorio en GitHub y sube todo el contenido de la carpeta del proyecto (asegúrate de que los archivos `vercel.json`, la carpeta `api`, `backend` y `frontend` estén en el nivel raíz del repositorio).

### Paso 2: Crear el Proyecto en Vercel
1. Ve a tu panel de **Vercel** (https://vercel.com) e inicia sesión.
2. Haz clic en **Add New** > **Project**.
3. Importa el repositorio de GitHub que acabas de crear.
4. En la configuración del proyecto, deja el **Root Directory** en la raíz (no selecciones ninguna subcarpeta) y haz clic en **Deploy**.

### Paso 3: Crear la Base de Datos Vercel Postgres
Vercel cuenta con bases de datos SQL gratuitas e integradas de un solo clic:
1. Una vez creado tu proyecto en Vercel, ve a la pestaña **Storage** (Almacenamiento) en la parte superior del Dashboard de Vercel.
2. Selecciona **Connect Database** > **Postgres** (Vercel Postgres).
3. Acepta los términos de uso y selecciona el plan gratuito. Haz clic en **Create**.
4. Selecciona un nombre para tu base de datos y elige una región cercana a tu servidor de Vercel (por ejemplo, `Washington D.C. (us-east-1)`).
5. Haz clic en **Connect** para vincular la base de datos a tu proyecto de Mini-OMS.

> [!NOTE]
> Al conectar la base de datos, Vercel inyectará automáticamente variables de entorno críticas como `POSTGRES_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, etc., a tu servidor de producción de forma segura.

### Paso 4: Redesplegar y Sincronizar
1. Ve a la pestaña **Deployments** de tu proyecto en Vercel.
2. Selecciona el último despliegue, haz clic en los tres puntos (`...`) y selecciona **Redeploy** (Redesplegar) con la opción de limpiar caché.
3. Durante esta compilación, Vercel instalará las librerías indicadas en `api/requirements.txt` (incluyendo `psycopg2-binary`).
4. Al arrancar, el backend detectará automáticamente la variable `POSTGRES_URL`, se conectará a Vercel Postgres, creará las tablas relacionales (`users` y `orders`) y cargará la semilla por defecto si la base de datos está vacía.

¡Eso es todo! Ya tienes el sistema Mini-OMS funcionando en la nube con una base de datos PostgreSQL real y persistente de Vercel.

---

## 3. Credenciales por Defecto (Semilla)
Tanto en local como en producción en la nube, puedes iniciar sesión utilizando las siguientes credenciales de prueba pre-cargadas:
- **Correo Electrónico**: `admin@example.com`
- **Contraseña**: `admin123`
