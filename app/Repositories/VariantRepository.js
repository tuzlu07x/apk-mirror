import Variant from "../../models/Variant.js";

export default class VariantRepository {
  async findByVariantCode(variantCode) {
    try {
      const variant = await Variant.findOne({ variantCode });
      return variant;
    } catch (error) {
      throw new Error(error);
    }
  }
}
