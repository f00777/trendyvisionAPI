import express from "express"
import { loginUsuario, registrarUsuario } from "../controllers/usuarios.controller.js"

const router = express.Router();

router.post("/crear", registrarUsuario)
router.post("/login", loginUsuario)

export default router