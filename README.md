# Control de Acceso a Recursos Compartidos

## 📌 Descripción del proyecto
Este proyecto consiste en el desarrollo de una **aplicación web** para el control de acceso y uso de recursos compartidos, como proyectores, computadoras, herramientas, equipos deportivos y material audiovisual.

La aplicación busca reemplazar los métodos informales de control (libretas, mensajes, solicitudes verbales) por un sistema digital centralizado, claro y accesible.

---

## ❓ Problema que se aborda
En escuelas, clubes, coworkings y pequeñas empresas, los recursos compartidos suelen ser utilizados sin un control adecuado, lo que genera:

- Desconocimiento de quién tiene un recurso
- Uso simultáneo no autorizado
- Retrasos en devoluciones
- Conflictos entre usuarios
- Pérdida o mal uso del material
- Falta de historial de uso

---

## 💡 Propuesta de solución
La aplicación web permitirá:

- Visualizar los recursos disponibles
- Consultar el estado de cada recurso (disponible / en uso)
- Solicitar el uso de un recurso
- Registrar la entrega y devolución
- Mantener un historial de préstamos

Toda la información se gestiona de forma centralizada y es accesible desde cualquier dispositivo con navegador web, sin necesidad de instalar software adicional.

---

## 🎯 Objetivo del proyecto
Mejorar la organización y el control del uso de recursos compartidos mediante una aplicación web sencilla, accesible y fácil de usar.

---

## 👥 Usuarios objetivo
La aplicación está dirigida a:

- Escuelas (laboratorios, proyectores, material didáctico)
- Clubes (equipos deportivos)
- Coworkings (equipos tecnológicos)
- Pequeñas empresas

Está pensada para usuarios sin conocimientos técnicos.

---

## 🧱 Tecnologías
- JavaScript
- Node.js
- Docker
- GitHub Actions (CI/CD)

> Las tecnologías específicas de frontend y backend se definirán conforme avance el desarrollo del proyecto.

---

## 🧠 Arquitectura general
La aplicación seguirá una arquitectura web tradicional:

- **Frontend (FE):** Interfaz de usuario
- **Backend (BE):** Lógica del sistema y gestión de datos
- **DevOps (DO):** Contenerización, CI/CD y automatización
- **QA:** Pruebas y validación del sistema

---

## 👨‍💻 Roles del equipo
- **TL (Tech Lead / Arquitectura):** Definición de arquitectura y decisiones técnicas
- **FE (Frontend):** Desarrollo de la interfaz de usuario
- **BE (Backend):** Desarrollo de la lógica del servidor
- **DO (DevOps / CI-CD):** Contenerización, pipelines y automatización
- **QA (QA / Testing):** Pruebas y validación del sistema

---

## 🐳 Docker
El proyecto cuenta con un contenedor Docker que permite ejecutar la aplicación en un entorno controlado y reproducible.

### Construcción de la imagen
```bash
docker build -t proyecto-turnos.
