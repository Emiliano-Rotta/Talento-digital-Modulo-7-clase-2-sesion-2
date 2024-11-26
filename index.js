const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// //varias formas de realizar consultas.
// //usando callback
// //usando promesas
// // usando async await

// //Callback

// // pool.query('SELECT * FROM estudiantes WHERE id = 1', (err, res)=> {
// //     if(err){
// //         console.error('error en la consulta:', err.message)
// //     } else{
// //         console.log('Resultado usando Callback:', res.rows)
// //     }
// // })

// // //Promesas

// // pool.query('SELECT * FROM estudiantes WHERE id = 1')
// //     .then(res =>
// //         console.log('Resultado usando Promesas:', res.rows)
// //     )
// //     .catch (err => {
// //         console.error('error en la consulta:', err.message)
// //     })


// // //Async/Await

// // const funcionAsincrona = async ()=>{
// //     try {
// //         const result = await pool.query('SELECT * FROM estudiantes WHERE id = 1');
// //         console.log('Resultado usando Async/await:', result.rows);
// //     }catch(err){
// //         console.error('Error en la consulta:', err.stack)
// //     } finally {
// //         pool.end()
// //     }
// // }
// // funcionAsincrona()

// //-----------------------------------------------------------------------------------------
// // Consultas parametrizadas

// // ¿Qué son las consultas parametrizadas? Son consultas SQL donde los datos dinámicos no se insertan directamente en la cadena de consulta, sino que se pasan como parámetros. Esto evita problemas de seguridad como la inyección SQL.
// // Ventajas:
// // Seguridad: Los parámetros se escapan automáticamente, protegiendo contra inyecciones.
// // Reutilización: Se pueden usar los mismos placeholders ($1, $2, etc.) con diferentes valores.
// // Mantenimiento: Hace que las consultas sean más legibles y fáciles de modificar.


// // ¿Qué es una inyección SQL?
// // La inyección SQL es una vulnerabilidad de seguridad que ocurre cuando una aplicación permite que un atacante inserte o manipule código SQL directamente en las consultas que ejecuta la base de datos. Esto puede llevar a:
// // Exposición de datos sensibles.
// // Modificación o eliminación de datos.
// // Ejecución de comandos no deseados en la base de datos.
// // Incluso el control completo del servidor de base de datos.
// //El problema surge cuando los valores dinámicos de una consulta SQL se concatenan directamente en la cadena de la consulta, sin ser validados o escapados correctamente. Esto permite al atacante incluir comandos SQL maliciosos en los datos que se envían al servidor.



// const query = 'INSERT INTO estudiantes (nombre, curso) VALUES ($1, $2)'
// const values = ['Ghiselle Voisier', 'Química'];

// // pool.query(query, values)
// // .then(()=> console.log('Estudiante incertado con exito'))
// // .catch(err=> console.error('Error en la consulta:', err.message))

// //codigo Peligroso por no tener consultas parametrizadas

// // async function obtenerUsuarioPorNombre(nombre) {
// //     const query = `SELECT * FROM estudiantes WHERE nombre = '${nombre}'`;
// //     try {
// //         const result = await pool.query(query);
// //         console.log(result.rows);
// //     } catch (err) {
// //         console.error('Error en la consulta:', err.message);
// //     }
// // }

// obtenerUsuarioPorNombre("' OR '1'='1");

// //solucion:
// async function obtenerUsuarioPorNombre(nombre) {
//     const query = 'SELECT * FROM estudiantes WHERE nombre = $1'; // Uso de placeholders ($1)
//     try {
//         const result = await pool.query(query, [nombre]); // Paso de parámetros en un array
//         console.log(result.rows);
//     } catch (err) {
//         console.error('Error en la consulta:', err.message);
//     }
// }
// obtenerUsuarioPorNombre("Emiliano");




// //ejercicio: tranformar estos codigos sin consulta parametrizada a un código seguro con buenas consultas:

// //1
// async function obtenerUsuarioPorCorreo(correo) {
//     const query = `SELECT * FROM usuarios WHERE correo = '${correo}'`;
//     try {
//         const result = await pool.query(query);
//         console.log(result.rows);
//     } catch (err) {
//         console.error('Error en la consulta:', err.message);
//     }
// }

// // codigo correcto:

// async function obtenerUsuarioPorCorreoCorrecto(correo) {
//     const query = 'SELECT * FROM usuarios WHERE correo = $1';
//     try {
//         const result = await pool.query(query, [correo]);
//         console.log(result.rows);
//     } catch (err) {
//         console.error('Error en la consulta:', err.message);
//     }
// }
// obtenerUsuarioPorCorreo("ghise@gmail.com");

// //2
// async function obtenerProductosPorCategoria(categoria) {
//     const query = `SELECT * FROM productos WHERE categoria = '${categoria}'`;
//     try {
//         const result = await pool.query(query);
//         return result.rows;
//     } catch (err) {
//         console.error('Error en la consulta:', err.message);
//     }
// }

// //codigo correcto:
// async function obtenerProductosPorCategoriaCorrecto(categoria) {
//     const query = 'SELECT * FROM productos WHERE categoria = $1';
//     try {
//         const result = await pool.query(query, [categoria]);
//         return result.rows;
//     } catch (err) {
//         console.error('Error en la consulta:', err.message);
//     }
// }


//-----------------------------------------------------------------------------------------
// Consultas con objetos

// El parámetro rowMode

// rowMode: 'object' --> { id:2, nombre:'Ghiselle'}
// rowMode: 'array' --> [1, 'Ghiselle']

// object: Fácil acceso por nombre de columna; ideal para código más descriptivo.
// array: Más eficiente en términos de memoria y velocidad, útil cuando necesitas procesar grandes volúmenes de datos o no necesitas nombres de columna.

async function consultaConRowMode() {
    const queryConfig = {
        text: 'SELECT id, nombre, edad FROM estudiantes WHERE edad > $1',
        values: [20],
        rowMode: 'array'
        //rowMode: 'object' //es la forma por defecto
    }
    try {

        const result = await pool.query(queryConfig);
        console.log(result.rows)
        result.rows.forEach(row => {
            console.log('Fila como array:', row)
        })
    } catch (err) {
        console.error('Error en la consulta:', err.message);
    } finally {
        pool.end //Si no se llama a pool.end(), el proceso de Node.js queda abierto, consumiendo recursos y bloqueando el programa.

    }
}

consultaConRowMode()


//--------------------------------------------------------------------------

// 2da tanda de ejercicios:

// Ejercicio 1: Gestión de Estudiantes
// Objetivo: Crear una base de datos para gestionar estudiantes y realizar consultas parametrizadas para agregar nuevos estudiantes y buscar los que cumplan criterios específicos.
// Pasos:
// Crear la base de datos "gestor_estudiantes".
// Crear una tabla llamada "estudiantes" con la siguiente estructura:

// CREATE TABLE estudiantes (
//     id SERIAL PRIMARY KEY,
//     nombre VARCHAR(50) NOT NULL,
//     edad INT NOT NULL,
//     curso VARCHAR(50) NOT NULL
// );

// INSERT INTO estudiantes (nombre, edad, curso)
// VALUES 
//     ('Juan Pérez', 20, 'Matemáticas'),
//     ('María López', 22, 'Física'),
//     ('Carlos Gómez', 19, 'Química');

// Realizar las siguientes acciones:
// Insertar un estudiante utilizando una consulta parametrizada.
// Buscar todos los estudiantes mayores de 20 años usando una consulta parametrizada.
//-------------------------------------------------------------

// Ejercicio 2: Registro de Profesores y Cursos
// Objetivo: Crear una base de datos para registrar profesores y cursos, utilizando el modo de fila rowMode: 'array' para realizar consultas avanzadas.
//     Pasos:
// Crear la base de datos "registro_educativo".
// Crear dos tablas:

// CREATE TABLE profesores(
//         id SERIAL PRIMARY KEY,
//         nombre VARCHAR(50) NOT NULL,
//         especialidad VARCHAR(50) NOT NULL
//     );
// CREATE TABLE cursos(
//         id SERIAL PRIMARY KEY,
//         nombre VARCHAR(50) NOT NULL,
//         profesor_id INT REFERENCES profesores(id)
//     );
// INSERT INTO profesores(nombre, especialidad)
// VALUES
//     ('Ana Torres', 'Matemáticas'),
//     ('Luis García', 'Física'),
//     ('Sofía Martínez', 'Química');
//     INSERT INTO cursos(nombre, profesor_id)
// VALUES
//     ('Álgebra', 1),
//     ('Termodinámica', 2),
//     ('Reacciones Químicas', 3);
    

// realizar las siguientes acciones:
// Buscar todos los cursos junto con el nombre del profesor, utilizando el modo rowMode: 'array'.
// Insertar un nuevo curso para un profesor específico utilizando una consulta parametrizada.

    //--------------------------------------------------
//     Objetivo: Crear una base de datos para registrar ventas de productos, realizar consultas con objetos y manejar errores en las consultas.
// Pasos:
// Crear la base de datos "admin_ventas".
// Crear dos tablas:
// CREATE TABLE productos(
//             id SERIAL PRIMARY KEY,
//             nombre VARCHAR(50) NOT NULL,
//             precio NUMERIC(10, 2) NOT NULL
//         );
// CREATE TABLE ventas(
//             id SERIAL PRIMARY KEY,
//             producto_id INT REFERENCES productos(id),
//             cantidad INT NOT NULL,
//             fecha DATE DEFAULT CURRENT_DATE
//         );

// INSERT INTO productos(nombre, precio)
// VALUES
//     ('Laptop', 1000.00),
//     ('Mouse', 20.00),
//     ('Teclado', 50.00);


//     INSERT INTO ventas(producto_id, cantidad)
// VALUES
//     (1, 2),
//     (2, 5);


// Realizar las siguientes acciones:
// Insertar una nueva venta utilizando una consulta con objetos.
// Buscar todas las ventas realizadas de un producto específico, manejando los errores de conexión.
