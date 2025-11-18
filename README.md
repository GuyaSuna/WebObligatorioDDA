# 🎓 PokéCenter - Ejemplo Educativo de Sistema CRUD con PokeAPI

Este proyecto es un ejemplo educativo que muestra cómo implementar un sistema CRUD completo usando **Next.js**, **React** y la **PokeAPI**. Está diseñado para enseñar conceptos de desarrollo web frontend sin revelar soluciones del obligatorio de DDA.

## 🎯 Objetivo Educativo

Este ejemplo muestra la estructura y funcionamiento de una aplicación web completa, adaptando la temática de una plataforma de streaming a un sistema de gestión de Pokémon y entrenadores.

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 16 + React 19
- **Estilos**: Tailwind CSS
- **API Externa**: PokeAPI (https://pokeapi.co)
- **Almacenamiento**: localStorage para datos CRUD simulados
- **Arquitectura**: Páginas separadas por funcionalidad

## 📁 Estructura del Proyecto

```
├── app/
│   ├── page.jsx                    # Dashboard principal
│   ├── Usuarios/page.js            # Gestión de entrenadores
│   ├── Contenidos/page.jsx         # Gestión de Pokémon (PokeAPI)
│   ├── Reproducciones/page.jsx     # Registro de batallas
│   ├── Reportes/page.jsx           # Estadísticas y reportes
│   └── components/
│       └── Navigation.jsx          # Navegación compartida
├── api/
│   └── api.js                      # Funciones para API y localStorage
└── README.md
```

## 🔄 Funcionalidades Implementadas

### 1. **Dashboard Principal**
- Estadísticas generales del sistema
- Navegación a todas las secciones
- Interfaz responsive

### 2. **Gestión de Entrenadores**
- ✅ **CREATE**: Crear nuevos entrenadores
- ✅ **READ**: Listar todos los entrenadores
- ✅ **UPDATE**: Editar información de entrenadores
- ✅ **DELETE**: Eliminar entrenadores
- **Tipos**: Estándar y Premium
- **Persistencia**: localStorage

### 3. **Gestión de Pokémon**
- 📡 **Datos Reales**: Obtenidos de PokeAPI
- 🔍 **Transformación**: Adaptados al modelo de negocio
- ⚡ **Tipos**: Categorización por tipo de Pokémon
- 🌟 **Premium**: Pokémon raros exclusivos para usuarios premium

### 4. **Registro de Batallas**
- 📝 **Registro**: Nuevas batallas entre entrenadores y Pokémon
- ✅ **Validación**: Control de acceso para Pokémon premium
- ⭐ **Calificación**: Sistema de 1-5 estrellas
- 📊 **Historial**: Visualización de batallas registradas

### 5. **Reportes y Estadísticas**
- 📈 **Pokémon Populares**: Los más utilizados en batallas
- 👥 **Filtros de Entrenadores**: Por tipo y fecha
- 🎯 **Batallas por Entrenador**: Historial individual
- 📊 **Promedios**: Calificaciones por Pokémon
- 📅 **Reportes por Fecha**: Actividad diaria

## 🛠️ Aspectos Técnicos Destacados

### Integración con APIs Externas
```javascript
// Ejemplo de transformación de datos de PokeAPI
const pokemonList = await Promise.all(
  datos.results.slice(0, 20).map(async (pokemon) => {
    const detail = await fetch(pokemon.url).then(r => r.json());
    return {
      id: detail.id,
      titulo: detail.name.charAt(0).toUpperCase() + detail.name.slice(1),
      categoria: detail.types[0].type.name,
      exclusivoPremium: detail.base_experience > 150
    };
  })
);
```

### Gestión de Estado Local
```javascript
// Simulación de backend con localStorage
function guardarDatosLocales() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localData));
}
```

### Componentes Reutilizables
- Navegación común para todas las páginas
- Formularios dinámicos con validación
- Tablas responsivas con acciones CRUD

## 🎓 Conceptos Educativos Demostrados

1. **Arquitectura de Aplicación Web**
   - Separación de responsabilidades
   - Componentes modulares
   - Gestión de estado

2. **Integración de APIs**
   - Consumo de APIs REST
   - Transformación de datos
   - Manejo de promesas y async/await

3. **CRUD Completo**
   - Operaciones básicas de base de datos
   - Validaciones del lado cliente
   - Persistencia de datos

4. **UX/UI Moderna**
   - Diseño responsive
   - Feedback visual
   - Navegación intuitiva

5. **Buenas Prácticas**
   - Código limpio y documentado
   - Manejo de errores
   - Optimización de rendimiento

## 🚀 Cómo Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir en el navegador
http://localhost:3000
```

## 📚 Adaptación para Obligatorio

Para adaptar este ejemplo a un obligatorio real:

1. **Backend**: Implementar Spring Boot con MySQL
2. **Autenticación**: Agregar sistema de login
3. **Validaciones**: Implementar validaciones del lado servidor
4. **Testing**: Agregar pruebas unitarias y de integración
5. **Deploy**: Configurar para producción

## 🎯 Valor Educativo

Este proyecto demuestra:
- ✅ Estructura completa de una aplicación web moderna
- ✅ Integración con APIs externas reales
- ✅ Implementación de operaciones CRUD
- ✅ Diseño de interfaces de usuario efectivas
- ✅ Gestión de datos y estado en el frontend

**Nota**: Este es un ejemplo educativo que utiliza PokeAPI para demostrar conceptos sin revelar soluciones específicas del obligatorio académico.

---

## 👨‍🏫 Para Profesores

Este proyecto puede utilizarse para enseñar:
- Desarrollo frontend con React/Next.js
- Integración de APIs
- Diseño de sistemas CRUD
- Arquitectura de aplicaciones web
- Buenas prácticas de desarrollo

El uso de la temática Pokémon hace el aprendizaje más atractivo mientras mantiene la seriedad técnica del proyecto.
