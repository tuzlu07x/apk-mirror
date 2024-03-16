import express from "express";
import { list, update, destroy } from "../app/controllers/VariantController.js";
import { checkVariant } from "../app/controllers/VariantCheckController.js";

const router = express.Router();

router.get("/api/variant/list", list);
router.put("/api/variant/update/:variantId", update);
router.delete("/api/variant/delete/:variantId", destroy);

router.post("/api/variant/check", checkVariant);

export default router;
