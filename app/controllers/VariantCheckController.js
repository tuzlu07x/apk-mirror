import VariantCheckService from "../Services/VariantCheckService.js";

const variantCheckService = new VariantCheckService();

async function checkVariant(req, res) {
  try {
    const agent = req.body;
    const isCompatible = await variantCheckService.checkCompatibility(agent);
    if (isCompatible)
      res
        .status(200)
        .json({ status: "success", message: "This variant is ok." });
    else
      res
        .status(400)
        .json({ status: "fail", message: "This variant is not ok." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { checkVariant };
