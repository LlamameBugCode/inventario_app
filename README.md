# Inventario con Cotización del Dólar en Tiempo Real

![React Native](https://img.shields.io/badge/React_Native-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-%23000000.svg?style=for-the-badge&logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

Aplicación móvil de inventario que actualiza precios automáticamente según la cotización del dólar en Bs (Bolívares) del día actual.

---

## **Características**
- Registro y gestión de productos con precios en USD y Bs.
- Actualización automática de precios en Bs basada en la tasa de cambio diaria.
- Backend con autenticación JWT para proteger las operaciones.
- Base de datos PostgreSQL para almacenar inventario y cotizaciones.
- Interfaz móvil responsive con React Native y Expo.

---

## **Tecnologías Utilizadas**
- **Frontend**: React Native, Expo, TypeScript.
- **Backend**: Flask (Python), SQLAlchemy, PostgreSQL.
- **Cotización del Dólar**: Integración con API externa (ej: [Dolar Venezuela API](https://github.com/fdvenezuela/currency-api)).
- **Autenticación**: JWT (JSON Web Tokens).
- **Migraciones**: Alembic (para PostgreSQL).

---

## **Instalación**

### **Requisitos Previos**
- Node.js y npm instalados.
- Python 3.8+ y pip.
- PostgreSQL corriendo localmente o en un servidor.
- Cuenta en [Expo Go](https://expo.dev/client) para probar la app.

---

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/LlamameBugCode/inventario_app.git
cd inventario_appr