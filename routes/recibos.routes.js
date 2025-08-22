import express from "express";
import * as recibosController from "../controllers/recibos.controller.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router()

router.get("/", authMiddleware, recibosController.obtenerRecibos)
router.get("/:id", authMiddleware, recibosController.obtenerRecibosId)
router.post("/pago-exitoso/:orden/:total", recibosController.pagoExitoso)

export default router