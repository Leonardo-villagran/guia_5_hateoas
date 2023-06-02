const { Pool } = require('pg');
const format = require('pg-format');
require('dotenv').config();

// Configura la conexión a la base de datos PostgreSQL a través de variables de entorno
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    allowExitOnIdle: true
});

const obtenerMedicamentos = async (req, res) => {
    const { limits = 10, order_by = "id_ASC", page = 0 } = req.query;

    const [campo, direccion] = order_by.split("_");
    const offset = page * limits;

    const consulta = format("select * from medicamentos order by %s %s limit %s offset %s", campo, direccion, limits, offset);
    const result = await pool.query(consulta);
    medicamentos = result.rows
    // const HATEOAS = await prepararHATEOAS(medicamentos)
    res.json(medicamentos);
}
const obtenerPersonal = async (req, res) => {
    const { limits = 10, order_by = "id_ASC", page = 0 } = req.query;

    const [campo, direccion] = order_by.split("_");
    const offset = page * limits;

    const consulta = format("select * from personal order by %s %s limit %s offset %s", campo, direccion, limits, offset);
    const result = await pool.query(consulta);
    personal = result.rows;
    res.json(personal);
}
const obtenerMedicamentosPorFiltro = async (req, res) => {
    const { precio_max, precio_min, stock_max, stock_min } = req.query;
    let filtros = [];
    let values = [];

    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor)
        const { length } = filtros
        filtros.push(`${campo} ${comparador} $${length + 1}`)
    }

    if (precio_max) agregarFiltro('precio', '<=', precio_max);
    if (precio_min) agregarFiltro('precio', '>=', precio_min);
    if (stock_max) agregarFiltro('stock', '<=', stock_max);
    if (stock_min) agregarFiltro('stock', '>=', stock_min);

    let consulta = "SELECT * FROM medicamentos";

    if (filtros.length > 0) {
        filtros = filtros.join(" AND ")
        consulta += ` WHERE ${filtros}`
    }

    const result = await pool.query(consulta, values);
    const medicamentos = result.rows
    res.json(medicamentos);
}
const obtenerPersonalPorFiltro = async (req, res) => {
    const { salario_min, salario_max, rol } = req.query;
    let filtros = [];

    let values = [];

    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor)
        const { length } = filtros
        filtros.push(`${campo} ${comparador} $${length + 1}`)
    
    }

    if (salario_max) agregarFiltro('salario', '<=', salario_max);
    if (salario_min) agregarFiltro('salario', '>=', salario_min);
    if (rol) agregarFiltro('rol', 'LIKE', `%${rol}%`);

    let consulta = "SELECT * FROM personal";

    if (filtros.length > 0) {
        filtros = filtros.join(" AND ")
        console.log(filtros);
        consulta += ` WHERE ${filtros}`
    }
    const result = await pool.query(consulta, values);
    const personal = result.rows
    res.json(personal);
}
// const prepararHATEOAS = (medicamentos) => {
//     const results = medicamentos.map((m) => {
//         return {
//             name: m.nombre,
//             href: `/medicamentos/medicamento/${m.id}`,
//         }
//     }).slice(0, 4)
//     const total = medicamentos.length
//     const HATEOAS = {
//         total,
//         results
//     }
//     return HATEOAS
// }
module.exports = { obtenerMedicamentos, obtenerPersonal, obtenerMedicamentosPorFiltro, obtenerPersonalPorFiltro };