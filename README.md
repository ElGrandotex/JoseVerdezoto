# JoseVerdezoto

Aplicación bancaria desarrollada con Angular 20, siguiendo principios de **Clean Code**, **Clean Architecture** y **SOLID**

## Repositorio GitHub
https://github.com/ElGrandotex/JoseVerdezoto

## Funcionalidades implementadas y probadas consummiendo servicios Backend
- F1. Listar productos financieros en tabla
- F2. Busqueda mediante input de texto. Permite buscar por Nombre, Descripcion y Fechas
- F3. Se aplica paginacion mostrando 5, 10 o 20 items en la tabla controlado por un select
- F4. Mediante el boton `Agregar` se ingresa al formulario de registro en el cual se tiene un formulario con validaciones en cada campo, una vez ingresado correctamente los valores se habilita el boton de enviar y se agrega el item. Adicional, se tiene el boton `Reiniciar` que limpia los campos.
- F5. Al seleccionar un item de la tabla se abre el menu dropdown en donde se tienen los botones de `Editar` y `Eliminar`. Al seleccionar en `Editar` se abre el formulario de registro con los campos completados segun el id del item y se deshabilita el campo del ID. Al modificar la informacion y si cumple las validaciones necesarias se habilita el boton `Enviar` y se guardan los cambios del item
- F6. Al abrir el menu dropdown se puede seleccionar el boton de `Eliminar`, el cual abre un modal pidiendo confirmacion para eliminarlo y se elimina el item

## Instalación

```bash
npm install
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Running unit tests

Ejecutar pruebas [Jest](https://jestjs.io/), usando el comando:

```bash
npm test
```

Para ejecutar las pruebas en modo vigilancia:

```bash
npm run test:watch
```

Para generar reporte de cobertura:

```bash
npm run test:coverage
```


## Scripts disponibles

- `ng serve` - inicia el servidor de desarrollo
- `npm run build` - compila la aplicación
- `npm test` - ejecuta las pruebas unitarias con Jest
- `npm run test:watch` - ejecuta Jest en modo observación
- `npm run test:coverage` - ejecuta Jest con reporte de cobertura
