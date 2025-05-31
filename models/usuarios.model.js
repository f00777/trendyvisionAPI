import sql from "../db/index.js";
import bcrypt from "bcrypt";
import { esEmailValido, esNumerico } from "../utils/functions.js";
// Crear un nuevo usuario
export const crearCuenta = async ({
  email,
  nombre,
  apellido,
  password,
  password2,
  region,
  comuna,
  direccion,
  codigoPostal,
  telefono,
  admin = false
}) => {
  
    if(email.length > 300 || nombre.length > 300 || apellido.length > 300 || password.length > 300 || region.length > 300 || comuna.length > 300 || direccion.length > 300 ||codigoPostal.length > 300 || telefono.length > 300  || !esNumerico(codigoPostal) || !esNumerico(telefono) ){
        throw new Error("Datos no válidos")
    }
    

    if(!esEmailValido(email)){
        throw new Error("El Email no es válido")
    }

    if(await existeUsuario({email})){
      throw new Error("El Email ya se encuentra registado")
    }

    if( password != password2){
        throw new Error("Las contraseñas no son iguales")
    }

    const hash = await bcrypt.hash(password, 10);

    const resultado = await sql`
        INSERT INTO usuarios (email, nombre, apellido, contraseña, region, comuna, direccion, codigo_postal, telefono, admin)
        VALUES (${email}, ${nombre}, ${apellido}, ${hash}, ${region}, ${comuna}, ${direccion}, ${codigoPostal}, ${telefono}, ${admin})
        RETURNING *;
    `;

    return resultado[0];
};

// Iniciar sesión de un usuario
export const iniciarSesion = async ({email, password}) => {
  const resultado = await sql`
    SELECT * FROM usuarios WHERE email = ${email};
  `;

  const usuario = resultado[0];
  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  const contraseñaValida = await bcrypt.compare(password, usuario.password);
  if (!contraseñaValida) {
    throw new Error("Contraseña incorrecta");
  }

  return usuario;
};


// Obtener datos de un usuario
export const obtenerDatosUsuario = async ({email}) =>{
  const resultado = await sql`
    SELECT nombre, email FROM usuarios WHERE email = ${email};
  `;

  const usuario = resultado[0];

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }
  
  return usuario
}

const existeUsuario = async({email}) => {
  const resultado = await sql`
    SELECT nombre, email FROM usuarios WHERE email = ${email};
  `;

  const usuario= resultado[0];

  if(usuario){
    return true;
  }
  return false;
}


