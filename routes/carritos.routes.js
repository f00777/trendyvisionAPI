import express from "express";
import * as carritoController from "../controllers/carritos.controller.js";

const router = express.Router();

// Crear carrito si no existe
router.post("/crear", carritoController.crearCarritoSiNoExiste);

// Agregar producto al carrito
router.post("/agregar", carritoController.agregarProductoAlCarrito);

// Actualizar cantidad de producto
router.put("/actualizar", carritoController.actualizarCantidad);

// Eliminar producto del carrito
router.delete("/eliminar", carritoController.eliminarProducto);

// Obtener productos del carrito por email
router.get("/productos/:email", carritoController.obtenerProductos);

//Vacia el carrito por email
router.delete("/vaciar", carritoController.vaciarCarrito);


export default router;
