import sql from '../db/index.js';

export const getTodosLosProductos = async () => {
  return await sql`SELECT * FROM productos`;
};

export const getProductoPorId = async (id) => {
  return await sql`SELECT * FROM productos WHERE id = ${id}`;
};

export const crearNuevoProducto = async ({ nombre, precio, inventario, imagenes, descripcion }) => {
  return await sql`
    INSERT INTO productos (nombre, precio, inventario, imagenes, descripcion)
    VALUES (${nombre}, ${precio}, ${inventario}, ${imagenes}, ${descripcion})
    RETURNING *`;
};

export const actualizarProductoPorId = async (id, { nombre, precio, inventario, imagenes, descripcion }) => {
  return await sql`
    UPDATE productos
    SET nombre = ${nombre}, precio = ${precio}, inventario = ${inventario},
        imagenes = ${imagenes}, descripcion = ${descripcion}
    WHERE id = ${id}
    RETURNING *`;
};

export const eliminarProductoPorId = async (id) => {
  return await sql`DELETE FROM productos WHERE id = ${id} RETURNING *`;
};
