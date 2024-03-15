import express from "express";
import { list, update, destroy } from "../app/controllers/VariantController.js";
const router = express.Router();

router.get("/api/variant/list", list);
router.put("/api/variant/update/:variantCode", update);
router.delete("/api/variant/delete/:variantCode", destroy);

export default router;
