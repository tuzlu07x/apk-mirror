import mongoose from "mongoose";
import { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const variantSchema = new Schema(
  {
    variantCode: { type: Number, require: true },
    variantId: { type: String, required: true },
    architecture: { type: String, required: true },
    minVersion: { type: String, required: true },
    screenDpi: { type: String, required: true },
    releaseDate: { type: Date, required: true },
  },
  { timestamps: true }
);

variantSchema.plugin(mongoosePaginate);

const Variant = mongoose.model("Variant", variantSchema);
export default Variant;
