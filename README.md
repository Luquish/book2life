# Book2Life 📚

Book2Life es una aplicación web moderna construida con Next.js que permite transformar textos en experiencias interactivas utilizando la API de OpenAI. La aplicación está diseñada para crear experiencias inmersivas a partir de textos literarios.

## 🚀 Características

- Interfaz moderna y responsive construida con Next.js y Tailwind CSS
- Integración con la API de OpenAI para procesamiento de texto
- Diseño UI/UX intuitivo con componentes de Radix UI
- Soporte para temas claro/oscuro
- Totalmente tipado con TypeScript

## 🛠️ Tecnologías Principales

- **Next.js 15.3.1**: Framework de React para producción
- **React 19**: Biblioteca para construcción de interfaces
- **TypeScript**: Tipado estático para JavaScript
- **Tailwind CSS**: Framework de CSS utilitario
- **Radix UI**: Componentes de UI accesibles y sin estilos
- **OpenAI API**: Procesamiento de lenguaje natural

## 📋 Prerrequisitos

- Node.js (versión LTS recomendada)
- PNPM como gestor de paquetes
- Una clave de API de OpenAI

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/book2life.git
cd book2life
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Configura las variables de entorno:
Crea un archivo `.env.local` en la raíz del proyecto y añade:
```
OPENAI_API_KEY=tu-api-key-aquí
```

4. Inicia el servidor de desarrollo:
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🚀 Scripts Disponibles

- `pnpm dev`: Inicia el servidor de desarrollo con Turbopack
- `pnpm build`: Construye la aplicación para producción
- `pnpm start`: Inicia el servidor de producción
- `pnpm lint`: Ejecuta el linter

## 📁 Estructura del Proyecto

```
book2life/
├── src/
│   ├── app/          # Rutas y páginas de la aplicación
│   ├── components/   # Componentes reutilizables
│   ├── lib/         # Utilidades y configuraciones
│   └── hooks/       # Custom hooks de React
├── public/          # Archivos estáticos
└── ...
```
