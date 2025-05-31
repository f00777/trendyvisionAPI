import {
    getTodosLosProductos,
    getProductoPorId,
    crearNuevoProducto,
    actualizarProductoPorId,
    eliminarProductoPorId
  } from '../models/productos.model.js';
  
  // Obtener todos los productos
  export const obtenerTodosLosProductos = async (req, res) => {
    try {
      const result = await getTodosLosProductos();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  };
  
  // Obtener un producto por ID
  export const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await getProductoPorId(id);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el producto' });
    }
  };
  
  // Crear un nuevo producto
  export const crearProducto = async (req, res) => {
    const { nombre, precio, inventario, imagenes, descripcion } = req.body;
    try {
      const result = await crearNuevoProducto({ nombre, precio, inventario, imagenes, descripcion });
      res.status(201).json(result[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el producto' });
    }
  };
  
  // Actualizar un producto existente
  export const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, inventario, imagenes, descripcion } = req.body;
    try {
      const result = await actualizarProductoPorId(id, { nombre, precio, inventario, imagenes, descripcion });
      if (result.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
      }
      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  };
  
  // Eliminar un producto
  export const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await eliminarProductoPorId(id);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
      }
      res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  };
  

  export const pruebaUsuario = async (req, res) => {
    const { email, password } = req.body;
    console.log("email " + email)
    console.log("contraseña " + password)

    res.json({email, password})
  }