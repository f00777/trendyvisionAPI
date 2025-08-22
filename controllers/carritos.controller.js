import * as carritoModel from "../models/carritos.model.js";
import axios from "axios";
import { crearFirma } from "../utils/firmaFlow.js";
import dotenv from 'dotenv'
import {randomUUID} from 'crypto'
import { generarRecibo } from "./recibos.controller.js";

dotenv.config()

const API_KEY = process.env.FLOW_API_KEY;
const SECRET_KEY = process.env.FLOW_SECRET_KEY;
const URL_FRONTEND = process.env.DOMINIO

const isProduction = true

let flow_api_url;

if(isProduction){
  flow_api_url = "https://www.flow.cl/api"
}
else{
  flow_api_url = "https://sandbox.flow.cl/api"
}


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
    res.status(201).json(resultado);
  } catch (error) {
    console.log("error dentro del agregar producto al carrito: ", error)
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


export async function crearPago(req, res) {
  const { email } = req.usuario;

  try {

    const carrito = await carritoModel.obtenerCarritoPorEmail(email);

    console.log("crearPago, carrito: ", carrito)
    
    if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });
    if (carrito.pagado) return res.status(400).json({ error: 'Este carrito ya fue pagado' });

    const resTotal = await carritoModel.obtenerTotal(email)
    const total = parseInt(resTotal[0].total)
    const commerceOrder = carrito.id + '-' + randomUUID()

    const params = {
      apiKey: API_KEY,
      commerceOrder: commerceOrder,
      subject: 'Pago TrendyVision',
      currency: 'CLP',
      amount: total,
      email: email,
      urlConfirmation: `${URL_FRONTEND}/api/carritos/confirmacion`,
      urlReturn: `${URL_FRONTEND}/api/recibos/pago-exitoso/${commerceOrder}/${total}`
    };

    params.s = crearFirma(params, SECRET_KEY);

    const response = await axios.post(`${flow_api_url}/payment/create`, new URLSearchParams(params), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    res.json(response.data);
    
  } catch (err) {
    console.error('Error al crear el pago:', err.message);
    res.status(500).json({ error: 'Error al crear el pago' });
  }
}


export async function confirmarPago(req, res){
  const {token} = req.body;

  
  try {
    const params = {
      apiKey: API_KEY,
      token
    }


    params.s = crearFirma(params, SECRET_KEY);

    const { data } = await axios.get(`${flow_api_url}/payment/getStatus`, {params})

    const split = data.commerceOrder.split('-')
    const carritoId = parseInt(split[0])

    console.log("el carrito es: ", carritoId)

    if(data.status == '2'){
      await generarRecibo(carritoId, parseFloat(data.amount), data.commerceOrder)

      res.status(200).json({mensaje: "Pago exitoso"})
    }
    else{
      res.status(402).json({error: "Orden pendiente de pago o rechazada"})
    }
    

  } catch (error) {
    res.status(500).json(error)
  }
}