import mongoose from "mongoose";
import { Schema } from "mongoose";

const variantSchema = new Schema(
  {
    variantCode: { type: String, require: true },
    variantId: { type: String, required: true },
    architecture: { type: String, required: true },
    minVersion: { type: String, required: true },
    screenDpi: { type: String, required: true },
    releaseDate: { type: String, required: true },
  },
  { timestamps: true }
);

const Variant = mongoose.model("Variant", variantSchema);
export default Variant;
