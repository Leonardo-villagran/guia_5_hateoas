const express= require('express');
require('dotenv').config();
const cors = require('cors');

//Instancia de Express para la creación de las rutas solicitadas
const app = express();

const {obtenerMedicamentos, obtenerPersonal, obtenerMedicamentosPorFiltro,obtenerPersonalPorFiltro} =require('./controllers/consultas');

//generar constante que determina el puerto a usar
const PORT = process.env.PORT || 3000;

//Habilitar el middleware de CORS para comunicación entre disntos dominios
app.use(cors());

// Configura body-parser para parsear las solicitudes JSON
app.use(express.json());

app.get('/medicamentos', obtenerMedicamentos);

app.get('/medicamentos/filtros', obtenerMedicamentosPorFiltro);

app.get('/personal/filtros', obtenerPersonalPorFiltro);

app.get('/personal', obtenerPersonal);


app.get("*", (req, res) => {
    res.status(404).send("Esta ruta no existe")
    })    

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor de Express escuchando en el puerto ${PORT}`);
});
