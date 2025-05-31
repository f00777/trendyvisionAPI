import * as carritoModel from "../models/carritos.model.js";

// Crear carrito para un usuario (si no tiene)
export const crearCarritoSiNoExiste = async (req, res) => {
  const { email } = req.body;

  try {
    let carrito = await carritoModel.obtenerCarritoPorEmail(email);
    if (!carrito) {
      carrito = await carritoModel.crearCarrito(email);
    }
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: "Error al crear carrito" });
  }
};

// Agregar producto al carrito
export const agregarProductoAlCarrito = async (req, res) => {
  const { email, producto_id, cantidad } = req.body;

  try {
    let carrito = await carritoModel.obtenerCarritoPorEmail(email);
    if (!carrito) {
      console.log("no hay carrito para el correo")
      carrito = await carritoModel.crearCarrito(email);
    }
    console.log("encontro el carrito ", carrito)
    const resultado = await carritoModel.agregarProducto(carrito.id, producto_id, cantidad);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto" });
  }
};

// Actualizar cantidad de un producto
export const actualizarCantidad = async (req, res) => {
  const { carrito_id, producto_id, cantidad } = req.body;

  try {
    const resultado = await carritoModel.actualizarCantidad(carrito_id, producto_id, cantidad);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar cantidad" });
  }
};

// Eliminar producto del carrito
export const eliminarProducto = async (req, res) => {
  const { carrito_id, producto_id } = req.body;

  try {
    const resultado = await carritoModel.eliminarProducto(carrito_id, producto_id);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

// Obtener productos del carrito
export const obtenerProductos = async (req, res) => {
  const { email } = req.params;

  try {
    const carrito = await carritoModel.obtenerCarritoPorEmail(email);
    if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });

    const productos = await carritoModel.obtenerProductosDelCarrito(carrito.id);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos del carrito" });
  }
};


// Vaciar todos los productos del carrito
export const vaciarCarrito = async (req, res) => {
  const { email } = req.body;

  try {
    const carrito = await carritoModel.obtenerCarritoPorEmail(email);
    if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });

    await carritoModel.vaciarCarrito(carrito.id);
    res.json({ mensaje: "Carrito vaciado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
};
