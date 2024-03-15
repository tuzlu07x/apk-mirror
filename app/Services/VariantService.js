import Variant from "../../models/Variant.js";
import VariantRepository from "../Repositories/VariantRepository.js";
export default class VariantService {
  constructor() {
    this.variantRepository = new VariantRepository();
  }
  async list(page, limit) {
    try {
      const totalDocuments = await Variant.countDocuments();
      const totalPages = Math.ceil(totalDocuments / limit);
      const variants = await Variant.find()
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: variants,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalDocuments: totalDocuments,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(variantId, variantDto) {
    try {
      const variant = await this.variantRepository.findByVariantCode(variantId);
      if (!variant) throw new Error("Variant not found");

      if (variantDto.variantId) {
        variant.variantId = variantDto.variantId;
      }
      if (variantDto.versionId) {
        variant.versionId = variantDto.versionId;
      }
      if (variantDto.architecture) {
        variant.architecture = variantDto.architecture;
      }
      if (variantDto.minVersion) {
        variant.minVersion = variantDto.minVersion;
      }
      if (variantDto.screenDpi) {
        variant.screenDpi = variantDto.screenDpi;
      }
      if (variantDto.releaseDate) {
        variant.releaseDate = variantDto.releaseDate;
      }
      Object.assign(variant, variantDto);
      const updatedVariant = await variant.save();
      return updatedVariant;
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(variantId) {
    try {
      const variant = await this.variantRepository.findByVariantCode(variantId);
      if (!variant) throw new Error("Variant not found");
      await variant.deleteOne();
      return variant;
    } catch (error) {
      throw new Error(error);
    }
  }
}
