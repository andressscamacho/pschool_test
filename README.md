## API de prueba para PSCHOOL

### Descripción

Se diseñó una API basada en las siguientes especificaciones:
* Crear dos servicios. Productos y pedidos.
* Deben crearse tres tablas en una base de datos NoSQL. Se escogió MongoDB
* Las tres tablas deben tener la estructura de:
Productos(código, nombre, precio), Pedidos(id_pedido, fecha), 
DetallePedido(id_producto, cantidad, id_pedido)
* Adicional: Crear un cliente básico para consumir el API

Para comodidad en el desarrolló se decidió traducir los modelos a inglés, de la siguiente forma:
Orders(_id, date), OrderDetails(_id, product_id, order_id, quantity), 
Products(_id, name, price).

Teniendo en cuenta lo anterior se creó dos endpoints para la creación de productos y pedidos.

#### Productos (/products)

 Soporta todas las operaciones CRUD, especificado de la siguiente forma.
 
 * **GET**: Permite traer todos los productos, pero no filtra por ningún campo
 * **GET /:id**: Permite traer un producto con id especificado
 * **POST**: Crea un producto. Se debe envíar con un JSON con dos campos name y price, que corresponden al nombre y precio del producto respectivamente.
 * **PUT/PATCH /:id**: Este método edita los campos de determinado producto. Util en caso de cambiar nombre (name) y precio (price) del producto.
 * **DELETE /:id**: Borra un producto en específico.
 
 #### Pedidos (/orders)
 
 Soporta todas las operaciones CRUD, especificado de la siguiente forma.
 
 * **GET**: Trae todos los pedidos. La estructura de cada pedido contiene el id(_id), fecha de creación(date), y productos(products).
 * **GET /:id**: Trae un pedido específico
 * **POST**: Crea un pedido. Se debe envíar un JSON con un campo de productos (products), que contenga una lista de ids de producto y la cantidad. Ejemplo:

`{products: [{product_id: 'j', quantity: 1}]}`
 * **PUT/PATCH /:id**: Este método permite editar los productos de un pedido. Se deben envíar los nuevos productos en un JSON.
 * **DELETE /:id**: Borra el pedido
 
 ### Estructura del proyecto
 
 La estructura del proyecto fue generada a partir
 de [express-generator](https://expressjs.com/es/starter/generator.html).

 En la carpeta routes se encuentra el código de cada uno de los endpoints organizados en carpetas a manera de módulos. Cada módulo
 tiene tres archivos.
 
 * model.js: Define el modelo y el acceso a los datos desde mongo
 * controller.js: Define la lógica de consulta
 * index.js: Define las rutas
 
 Esta estructura permite agregar y quitar nuevos endpoints sin dañar el proyecto. Falta el archivo de test.js para
 pruebas del endpoint.
 
 Los archivos principales son app.js donde está toda la configuración básica de un servidor node con Express y bin/www donde se
 define el script de inicio del servidor.
 
 ### Inicio del proyecto
 
 Para iniciar el proyecto es necesario tener una instacia de MongoDb corriendo. Para más información puede
 ver [aquí](https://docs.mongodb.com/manual/installation/). Y también tener instalado 
 en el servidor NodeJs y NPM. Una vez instalado estos requerimentos se debe ingresar en el proyecto y
 ejecutar dos comandos
 
 * `npm install`: para instalar las librerías necesarias del proyecto
 * `npm run-script start`: para iniciar el servidor.
 
 Después de iniciado se puede consultar en localhost:3000 o el puerto que se defina en la variable de entorno ENV.

### Pedientes

* Crear cliente para consumir datos
