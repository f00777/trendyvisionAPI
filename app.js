import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productosRoutes from './routes/productos.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import carritosRoutes from './routes/carritos.routes.js';
import recibosRoutes from './routes/recibos.routes.js'; 
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cookieParser());

// Middlewares
app.use(cors({
    origin: process.env.DOMINIO, // Permite cualquier dominio
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
    credentials: true // Si necesitas enviar cookies o cabeceras con credenciales
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Rutas
app.use('/productos', productosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/carritos', carritosRoutes);
app.use('/recibos', recibosRoutes);

// Escuchar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
