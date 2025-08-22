import sql from '../db/index.js';

export async function crearRecibo(email, total){
    return await sql`INSERT INTO recibos (usuario_email, total) VALUES (${email}, ${total}) RETURNING *`
} 

export async function crearReciboProducto(recibo_id, producto_id, cantidad, precio_unitario){
    return await sql`INSERT INTO recibo_productos (recibo_id, producto_id, cantidad, precio_unitario) VALUES (${recibo_id}, ${producto_id}, ${cantidad}, ${precio_unitario}) RETURNING *`
}

export async function obtenerRecibosEmail(email){
    return await sql`SELECT * FROM recibos WHERE usuario_email = ${email} ORDER BY fecha DESC`
}


export async function obtenerDetalleRecibo(idRecibo, email){
    return await sql`
    SELECT p.nombre, rp.cantidad, rp.precio_unitario
    FROM productos AS p JOIN recibo_productos AS rp ON rp.producto_id = p.id
    JOIN recibos AS r ON rp.recibo_id = r.id 
    WHERE r.id = ${idRecibo} AND r.usuario_email = ${email}
    `
}