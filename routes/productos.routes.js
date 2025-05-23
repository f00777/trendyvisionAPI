import express from 'express';
import {
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  pruebaUsuario
} from '../controllers/productos.controller.js';

const router = express.Router();

// GET /api/productos → Lista todos los productos
router.get('/', obtenerTodosLosProductos);

// GET /api/productos/:id → Obtiene un producto por ID
router.get('/:id', obtenerProductoPorId);

// POST /api/productos → Crea un nuevo producto
router.post('/', crearProducto);

// PUT /api/productos/:id → Actualiza un producto existente
router.put('/:id', actualizarProducto);

// DELETE /api/productos/:id → Elimina un producto
router.delete('/:id', eliminarProducto);

router.post("/usuario", pruebaUsuario);

export default router;
