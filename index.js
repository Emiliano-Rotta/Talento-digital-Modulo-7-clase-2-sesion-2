const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

//varias formas de realizar consultas.
//usando callback
//usando promesas
// usando async await

//Callback

// pool.query('SELECT * FROM estudiantes WHERE id = 1', (err, res)=> {
//     if(err){
//         console.error('error en la consulta:', err.message)
//     } else{
//         console.log('Resultado usando Callback:', res.rows)
//     }
// })

// //Promesas

// pool.query('SELECT * FROM estudiantes WHERE id = 1')
//     .then(res =>
//         console.log('Resultado usando Promesas:', res.rows)
//     )
//     .catch (err => {
//         console.error('error en la consulta:', err.message)
//     })
        

// //Async/Await

// const funcionAsincrona = async ()=>{
//     try {
//         const result = await pool.query('SELECT * FROM estudiantes WHERE id = 1');
//         console.log('Resultado usando Async/await:', result.rows);
//     }catch(err){
//         console.error('Error en la consulta:', err.stack)
//     } finally {
//         pool.end()
//     }
// }
// funcionAsincrona()

// Consultas parametrizadas

// const query = 'INSERT INTO estudiantes (nombre, curso) VALUES ($1, $2)'
// const values = ['Ghiselle Voisier', 'Química'];

// pool.query(query, values)
// .then(()=> console.log('Estudiante incertado con exito'))
// .catch(err=> console.error('Error en la consulta:', err.message))

//codigo Peligroso por no tener consultas parametrizadas

// async function obtenerUsuarioPorNombre(nombre) {
//     const query = `SELECT * FROM estudiantes WHERE nombre = '${nombre}'`;
//     try {
//         const result = await pool.query(query);
//         console.log(result.rows);
//     } catch (err) {
//         console.error('Error en la consulta:', err.message);
//     }
// }

obtenerUsuarioPorNombre("' OR '1'='1");

//solucion:
async function obtenerUsuarioPorNombre(nombre) {
    const query = 'SELECT * FROM estudiantes WHERE nombre = $1'; // Uso de placeholders ($1)
    try {
        const result = await pool.query(query, [nombre]); // Paso de parámetros en un array
        console.log(result.rows);
    } catch (err) {
        console.error('Error en la consulta:', err.message);
    }
}
obtenerUsuarioPorNombre("Emiliano");




//ejercicio: tranformar estos codigos sin consulta parametrizada a un código seguro con buenas consultas:

//1
async function obtenerUsuarioPorCorreo(correo) {
    const query = `SELECT * FROM usuarios WHERE correo = '${correo}'`;
    try {
        const result = await pool.query(query);
        console.log(result.rows);
    } catch (err) {
        console.error('Error en la consulta:', err.message);
    }
}
//2
async function obtenerProductosPorCategoria(categoria) {
    const query = `SELECT * FROM productos WHERE categoria = '${categoria}'`;
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error en la consulta:', err.message);
    }
}

