import VariantRepository from "../Repositories/VariantRepository.js";

export default class VariantCheckService {
  constructor() {
    this.variantRepository = new VariantRepository();
  }
  async checkCompatibility(agentData) {
    agentData = this.parseAgent(agentData);
    console.log(agentData.variantId);
    const variant = await this.variantRepository.findByVariantCode(
      agentData.variantId
    );
    if (!variant) throw new Error("Variant is not defined");
    const { minVersion, screenDpi } = variant;
    const { minAndroidVersion, minDpi } = agentData;
    console.log(variant);

    if (
      parseInt(minVersion) < minAndroidVersion ||
      parseInt(screenDpi) < minDpi
    ) {
      return false;
    }
    return true;
  }

  parseAgent(agent) {
    const agentArray = agent.agent.split(" ");
    console.log(agentArray);
    const versionId = agentArray[1];
    const androidVersion = agentArray[3];
    const dpi = agentArray[5];
    const variantId = agentArray[11];
    return { versionId, androidVersion, dpi, variantId };
  }
}
