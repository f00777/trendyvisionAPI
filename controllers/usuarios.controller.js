import { crearCuenta, iniciarSesion } from "../models/usuarios.model.js";

// Crear un nuevo usuario
export const registrarUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await crearCuenta(req.body);
    res.status(201).json({ mensaje: "Usuario creado exitosamente", usuario: nuevoUsuario });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error : `${error.message}` });
  }
};

// Iniciar sesión
export const loginUsuario = async (req, res) => {

  console.log(req.body)

  try {
    const usuario = await iniciarSesion(req.body);
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    res.status(200).json({ mensaje: "Inicio de sesión exitoso", usuario });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error : `${error.message}`});
  }
};
