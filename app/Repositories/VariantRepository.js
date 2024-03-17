import Variant from "../../models/Variant.js";

export default class VariantRepository {
  async list(page, limit) {
    try {
      const variants = await Variant.find()
        .skip((page - 1) * limit)
        .limit(limit);
      return variants;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByVariantId(variantId) {
    try {
      const variant = await Variant.findOne({ variantId });
      return variant;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteByVariantId(variantId) {
    try {
      const variant = await this.findByVariantId(variantId);
      if (!variant) throw new Error("Variant not found");
      await variant.deleteOne();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async countDocuments() {
    const totalDocuments = await Variant.countDocuments();
    return totalDocuments;
  }
}
