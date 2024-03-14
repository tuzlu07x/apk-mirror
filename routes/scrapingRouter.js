import express from "express";
import { getApkMirror } from "../app/controllers/ScrapingMirrorController.js";
const router = express.Router();

router.get("/getApiMirror", async (req, res) => {
  try {
    const variants = getApkMirror();
    res.status(200).json({ message: "Data adding..." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching variants." });
  }
});

export default router;
