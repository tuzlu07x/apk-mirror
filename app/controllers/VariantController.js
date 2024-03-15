import VariantService from "../Services/VariantService.js";

const variantService = new VariantService();

async function list(req, res) {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const variants = await variantService.list(page, limit);
    res.status(200).json(variants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    const variantId = req.params.variantCode;
    const variantData = req.body;
    const updatedVariant = await variantService.update(variantId, variantData);
    res.status(200).json(updatedVariant);
  } catch (error) {
    res.status(400).send({
      message: error.message,
      status: 400,
      data: new Date(),
    });
  }
}

async function destroy(req, res) {
  try {
    const variantId = req.params.variantCode;
    const deleteVariant = await variantService.delete(variantId);
    res.status(200).json({
      deleteVariant: deleteVariant,
      message: "Variant deleted successfully",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      status: 400,
      data: new Date(),
    });
  }
}

export { list, update, destroy };
