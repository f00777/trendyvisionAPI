import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


dotenv.config()
const SECRET = process.env.JWT_SECRET


export default function authMiddleware (req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ mensaje: 'No autenticado' });

  try {
    const datos = jwt.verify(token, SECRET);
    req.usuario = datos;
    next();
  } catch {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};
