import express from "express"
import { loginUsuario, obtenerPerfil, registrarUsuario, logout, obtenerDatos, editarDatos } from "../controllers/usuarios.controller.js"
import authMiddleware from '../middlewares/auth.js'

const router = express.Router();

router.post("/crear", registrarUsuario)
router.post("/login", loginUsuario)
router.get("/perfil", authMiddleware, obtenerPerfil)
router.post("/logout", authMiddleware, logout)
router.get("/datos", authMiddleware, obtenerDatos)
router.put("/datos", authMiddleware, editarDatos)

export default router