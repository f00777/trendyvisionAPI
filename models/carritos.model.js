import sql from '../db/index.js';

// Obtener el último carrito activo por email
export const obtenerCarritoPorEmail = async (email) => {
  const [carrito] = await sql`
    SELECT * FROM carritos
    WHERE usuario_email = ${email}
    ORDER BY id DESC
    LIMIT 1
  `;
  return carrito;
};

export const obtenerCarritoPorId = async (id) => {
  const [carrito] = await sql`
    SELECT * FROM carritos
    WHERE id = ${id}
    ORDER BY id DESC
    LIMIT 1
  `;
  return carrito;
};

// Crear nuevo carrito para un usuario
export const crearCarrito = async (email) => {
  const [nuevoCarrito] = await sql`
    INSERT INTO carritos (usuario_email) VALUES (${email}) RETURNING *
  `;
  return nuevoCarrito;
};

// Agregar producto al carrito
export const agregarProducto = async (carritoId, productoId, cantidad) => {
    console.log("se entro a agregar producto")
  const [existente] = await sql`
    SELECT * FROM carrito_productos
    WHERE carrito_id = ${carritoId} AND producto_id = ${productoId}
  `;

  console.log("dentro de agregar producto, el carrito existente es: ", existente)

  if (existente) {
    console.log("hubo existente")
    return await sql`
      UPDATE carrito_productos
      SET cantidad = cantidad + ${cantidad}
      WHERE carrito_id = ${carritoId} AND producto_id = ${productoId}
      RETURNING *;
    `;
  } else {
    console.log("no hubo existente")
    return await sql`
      INSERT INTO carrito_productos (carrito_id, producto_id, cantidad)
      VALUES (${carritoId}, ${productoId}, ${cantidad})
      RETURNING *;
    `;
  }
};

// Actualizar cantidad de un producto
export const actualizarCantidad = async (carritoId, productoId, cantidad) => {
  return await sql`
    UPDATE carrito_productos
    SET cantidad = ${cantidad}
    WHERE carrito_id = ${carritoId} AND producto_id = ${productoId}
    RETURNING *;
  `;
};

// Eliminar producto del carrito
export const eliminarProducto = async (carritoId, productoId) => {
  return await sql`
    DELETE FROM carrito_productos
    WHERE carrito_id = ${carritoId} AND producto_id = ${productoId};
  `;
};

// Obtener productos del carrito
export const obtenerProductosDelCarrito = async (carritoId) => {
  return await sql`
    SELECT cp.*, p.nombre, p.precio, p.imagenes
    FROM carrito_productos cp
    JOIN productos p ON cp.producto_id = p.id
    WHERE cp.carrito_id = ${carritoId}
  `;
};

// Vaciar el carrito (eliminar todos los productos de un carrito)
export const vaciarCarrito = async (carritoId) => {
  return await sql`
    DELETE FROM carrito_productos
    WHERE carrito_id = ${carritoId};
  `;
};


export const obtenerTotal = async (email) => {
  return await sql`
  SELECT SUM (p.precio * cp.cantidad) as total 
  FROM productos as p JOIN carrito_productos as cp on p.id = cp.producto_id
  JOIN carritos as c on c.id = cp.carrito_id
  WHERE c.usuario_email = ${email}
  `
}