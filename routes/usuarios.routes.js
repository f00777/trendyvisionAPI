import express from "express"
import { loginUsuario, obtenerPerfil, registrarUsuario, logout } from "../controllers/usuarios.controller.js"
import authMiddleware from '../middlewares/auth.js'

const router = express.Router();

router.post("/crear", registrarUsuario)
router.post("/login", loginUsuario)
router.get("/perfil", authMiddleware, obtenerPerfil)
router.post("/logout", authMiddleware, logout)

export default router