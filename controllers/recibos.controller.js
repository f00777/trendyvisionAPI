import * as recibosModel from "../models/recibos.model.js"
import { obtenerTotal, obtenerCarritoPorId, obtenerProductosDelCarrito, vaciarCarrito } from "../models/carritos.model.js"

export async function generarRecibo(id_carrito, total){
    try {
        const carrito = await obtenerCarritoPorId(id_carrito)
        const email = carrito.usuario_email

        const resCrearRecibo = await recibosModel.crearRecibo(email, total)
        const id_recibo = resCrearRecibo[0].id

        const productosCarrito = await obtenerProductosDelCarrito(id_carrito)

        if(productosCarrito.length > 0){

            for(const productoCarrito of productosCarrito){
                const resInsertarProductoRecibo = await recibosModel.crearReciboProducto(id_recibo, productoCarrito.producto_id, productoCarrito.cantidad, parseFloat(productoCarrito.precio))
            }


            const vaciarElCarro = await vaciarCarrito(id_carrito)
            console.log("El vaciado del carrito tiene como resultado: ", vaciarElCarro)
        }
        
    } catch (error) {
        throw new Error(error)
    }

}


export async function obtenerRecibos(req, res){
    const {email} = req.usuario
    try {
        const recibos = await recibosModel.obtenerRecibosEmail(email)
        res.status(200).json({recibos})
    } catch (error) {
        console.log("error")
        res.status(500).json({error: error.message})
    }
}

export async function obtenerRecibosId(req, res){
    const {id} = req.params
    const {email} = req.usuario

    console.log("id: ", id, " email: ", email)

    try {
        const productos = await recibosModel.obtenerDetalleRecibo(id, email)
        res.status(200).json({productos})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}