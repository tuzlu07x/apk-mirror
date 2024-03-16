import express from "express";
import { getApkMirror } from "../app/controllers/ScrapingMirrorController.js";
const router = express.Router();

router.post("/api/getApiMirror", getApkMirror);

export default router;
