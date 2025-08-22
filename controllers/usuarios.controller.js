import { crearCuenta, iniciarSesion, obtenerDatosUsuario, editarDatosUsuario } from "../models/usuarios.model.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const SECRET = process.env.JWT_SECRET

// Crear un nuevo usuario
export const registrarUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await crearCuenta(req.body);

    const token = jwt.sign({email: nuevoUsuario.email}, SECRET, {expiresIn: '30d'})

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true si usas HTTPS
      sameSite: 'Lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias
    })

    res.status(201).json({ mensaje: "Usuario creado exitosamente"});
  } catch (error) {
    res.status(500).json({ error : `${error.message}` });
  }
};

// Iniciar sesión
export const loginUsuario = async (req, res) => {

  try {

    const usuario = await iniciarSesion(req.body);

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({email: usuario.email}, SECRET, {expiresIn: '30d'})

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true si usas HTTPS
      sameSite: 'Lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias
    })

    res.status(200).json({ mensaje: "Inicio de sesión exitoso", usuario });
  } catch (error) {
    res.status(500).json({ error : `${error.message}`});
  }
};

export const obtenerPerfil = async (req, res) => {
  res.status(200).json({email : req.usuario.email})
}


export const obtenerDatos = async (req, res) => {
  try {
    const datos = await obtenerDatosUsuario({email: req.usuario.email})
    res.status(200).json(datos)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const editarDatos = async (req, res) => {
  try {
    const datos = await editarDatosUsuario(req.usuario.email, req.body)
    res.status(200).json(datos)
  } catch (error) {
    res.status(500).json(error)
  }
}

export function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false, // true si usas HTTPS
    sameSite: 'Lax',
  })
  return res.status(200).json({ mensaje: 'Sesión cerrada' })
}
