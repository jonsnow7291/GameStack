# Cumplimiento de Requisitos Técnicos en React

A continuación se detalla cómo y en qué archivos se han implementado los requisitos solicitados para el proyecto **GameStack**, de modo que puedas explicarlos fácilmente:

## 1. Formularios, Controles y Variables de Estado (Menús, Textos, Casillas)
- **Cajas de texto (Inputs)**: En el archivo `frontend/src/pages/LoginPage.jsx` y `RegisterPage.jsx` usamos `<input type="email">` y `<input type="password">` atados a variables de estado (`useState`).
- **Casilla de elección (Checkbox)**: En `frontend/src/pages/CartPage.jsx` integramos un checkbox (`<input type="checkbox">`) para la opción "Add Gift Wrap". Su estado se maneja con la variable `isGiftWrap` que suma $5.00 al total de la compra de forma dinámica.
- **Menú desplegable (Select)**: En `frontend/src/pages/HomePage.jsx` integramos un control `<select>` con la variable de estado `sortOrder` para ordenar los juegos por precio ("Low to High", "High to Low").

## 2. Albergar Componentes e Interacción entre Ellos
- **Ruta de archivo**: `frontend/src/App.jsx`
- **Explicación**: El archivo `App.jsx` actúa como contenedor principal (alberga componentes). Importa y renderiza el `<NavBar />`, el `<Footer />` y diferentes "Páginas" dentro del sistema de rutas (`<Routes>`). 
- **Interacción**: `App.jsx` se comunica con `HomePage.jsx` inyectándole variables y funciones a través de **Props** (por ejemplo: `inventory={inventory}` y `addToCart={addToCart}`). A su vez, `HomePage` pasa esos mismos datos hacia abajo a los componentes hijos `GameCard.jsx`.

## 3. Componentes que Generen Eventos
- **Rutas de archivo**: `frontend/src/components/GameCard.jsx` y `frontend/src/components/NavBar.jsx`
- **Explicación**: Los componentes tienen botones e imágenes que generan eventos estándar de React. 
  - En `GameCard.jsx`, el botón "Add to cart" genera un evento `onClick` que dispara la función padre para añadir el juego al carrito. Las imágenes de los juegos tienen un evento `onError` que dispara una imagen de respaldo si el link falla.
  - En `NavBar.jsx`, el botón de "Logout" y de "Login/Register" generan eventos interactivos. El de logout tiene un evento `onClick` que limpia la sesión activa.

## 4. Hook de Efecto (`useEffect`)
- **Ruta de archivo**: `frontend/src/App.jsx`
- **Explicación**: Utilizamos el hook `useEffect` en múltiples partes clave:
  1. Para hacer la petición a la API (`loadInventory`) tan pronto como la aplicación se renderiza por primera vez.
  2. Para "escuchar" cambios en el carrito (`cart`) y guardarlos dinámicamente en el almacenamiento del navegador cada vez que se agrega o elimina un producto.

## 5. Propiedad `key` en Listas de Datos
- **Ruta de archivo**: `frontend/src/pages/HomePage.jsx` y `frontend/src/pages/CartPage.jsx`
- **Explicación**: En React, cuando iteramos sobre un array usando `.map()`, debemos proporcionar una clave única. 
  - En `HomePage.jsx`, mapeamos el inventario así: `<GameCard key={game.id} ... />`.
  - En `CartPage.jsx`, mapeamos los artículos del carrito así: `<div className="cart-row" key={item.id}>`.

## 6. Almacenamiento Local (Local Storage) integrado en el Carrito
- **Ruta de archivo**: `frontend/src/App.jsx`
- **Explicación**: La persistencia del carrito se mejoró sustancialmente.
  - **Carga inicial**: El estado del carrito se inicializa consultando el disco local: `localStorage.getItem('gamestack-cart')`. Si existe data previa, se reconstruye el carrito automáticamente, si no, inicia vacío.
  - **Guardado continuo**: Mediante un `useEffect`, le dijimos a React: *"Cada vez que la variable `cart` sufra una modificación, ejecuta `localStorage.setItem(...)`"*. De este modo, si el usuario cierra el navegador y regresa mañana, sus juegos en el carrito seguirán estando allí.

## 7. Diseño Distintivo de Botones (Login y Registro)
- **Ruta de archivo**: `frontend/src/components/NavBar.jsx`
- **Explicación**: Modificamos los enlaces superiores simples para convertirlos en botones interactivos con nuestra temática "Gamer / Cyberpunk". 
  - Al Login se le asignó la clase `ghost-button` (transparente que brilla con hover) y al Registro la clase `cta-link` (resaltado neón) para que sean altamente reconocibles al usuario visitante.
