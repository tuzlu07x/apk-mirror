import Variant from "../../models/Variant.js";

export default class VariantRepository {
  async findByVariantCode(variantId) {
    try {
      const variant = await Variant.findOne({ variantId });
      return variant;
    } catch (error) {
      throw new Error(error);
    }
  }
}
