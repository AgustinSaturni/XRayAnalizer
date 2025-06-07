# XRayAnalizer

**XRayAnalizer** es una aplicación web que permite realizar análisis de radiografías de pies mediante inteligencia artificial.

## 🚀 Funcionalidad

Este portal tiene como objetivo brindar soporte a profesionales de la salud para el análisis automatizado de radiografías, con foco inicial en la medición de ángulos en imágenes de pies. Actualmente, se encuentra en versión MVP (Producto Mínimo Viable).

> 🔧 La funcionalidad de análisis de ángulos con IA **aún no está implementada**.

---

## 🧪 Cómo ejecutarlo localmente

1. Clonar el repositorio desde la rama `master`:

   ```bash
   git clone <URL-del-repo>
   cd XRayAnalizer

2. Instalar las dependencias::

   ```bash
   npm i

3. Instalar las dependencias::

   ```bash
   npm run dev

4. (OPCIONAL) Usar back-end local:

   1. Clonar el back-end (https://github.com/AgustinSaturni/xrayanalizer-back-end)
   2. Levantarlo localmente siguiendo las instrucciones.
   3. Modificar en el codigo del front-end el parametro BASE_URL para que apunte al localhost que nos da el back-end al levantarlo.

## 🛠️ Arquitectura

- **Frontend**: Aplicación web construida con React (utilizando Vite o Next.js), desplegada en [Vercel](https://vercel.com).
- **Backend**: API desarrollada en Python, desplegada en [Render](https://xrayanalizer-back-end.onrender.com/docs#/).
- **Comunicación**: El frontend se comunica con el backend a través de peticiones HTTP.

---

## 📌 Notas

- Este portal es un **MVP** (Producto Mínimo Viable) del producto final.
- La aplicación se conecta a un backend implementado en Python.
- El análisis de ángulos con inteligencia artificial **aún no está implementado** y será incorporado en futuras versiones.

---

## 📞 Contacto

- **Mail**: a.saturni2021@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/agustin-saturni
