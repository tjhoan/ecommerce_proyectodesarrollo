# Proyecto Ecommerce Urban Street

Este proyecto es una página web estilo ecommerce desarrollada con Node.js, Express, MongoDB(varios módulos) y EJS como motor de plantillas.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

1. Node.js: (https://www.youtube.com/watch?v=czFj5zoI5uc)
2. MongoDB: (https://www.youtube.com/watch?v=eKXIxSZrJfw&t=2s) por cierto, en versiones actuales para poder correr correctamente mongo, se usa el comando mongosh (es un error del video)

Al terminar los tutoriales, cierre las consolas ya que las tendra que abrir nuevamente desde el visual

## Instalación

1. Descomprimir el archivo, donde desee (puede ser en descargas).
2. Abre dos cmd de windows, en una ejecute el comando mongod para inicializar el servidor de mongo y en la otra, el comando mongosh para iniciar la shell de mongo.
3. Ahora en visual debe abrir la carpeta que ha descomprimido.
4. En visual abra otra consola (importante que este en el directorio del proyecto) y ejecute: "npm init --yes" para inicializar un nuevo proyecto en node.
5. Ahora, en la misma consola ejecute el siguiente comando para instalar las dependencias: "npm i"

## Ejecución del proyecto

4. Ahora, en la terminal en visual (directorio del proyecto) ejecute el comando: "npm run dev" para correr el proyecto
3. Deberías ver el siguiente mensaje en la consola: 

[nodemon] starting node src/server.js
Server on port 3000
DB is connected

## Acceso a la aplicación

1. Abre tu navegador web y visita: http://localhost:3000/index

## Configuración inicial

1. Seleccionar el boton de Iniciar o Entrar para poder acceder al main.
2. Accede al formulario de administrador que esta en la parte superior derecha.
3. Ingresa las siguientes credenciales:
- Nombre: admin
- Contraseña: 123
Oprima ingresar para acceder al dashboard del admin.

4. En la vista de administrador:
- Crea una o dos categorías.
- Crea productos (es obligatorio incluir imagenes y que sean maximo 5), si desea en "/public/fotosRopa" tiene algunas imagenes que puede probar.

## Uso de la aplicación

1. Regresa a la vista principal para ver los productos haciendo click en Menu en la barra lateral izquierda.
2. Para usar el carrito de compras:
- Haz login como cliente, puede ingresar sus datos o ficticios.
- Añade productos al carrito.
- Completa el proceso de pago.
- Visualiza la factura.

3. En el admin, en la seccion de productos existe la funcionalidad de busqueda la cual sirve para cada uno de los atributos del producto

## Notas importantes

- Asegúrate de iniciar MongoDB antes de ejecutar la aplicación.
- El servidor se ejecuta en el puerto 3000.
- Es necesario crear productos desde la vista de administrador antes de poder visualizarlos en la página principal.