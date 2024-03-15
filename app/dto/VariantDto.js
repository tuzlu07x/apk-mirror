export default class VariantDto {
  constructor(
    variantId,
    versionId,
    architecture,
    minVersion,
    screenDpi,
    releaseDate
  ) {
    this.variantId = variantId;
    this.versionId = versionId;
    this.architecture = architecture;
    this.minVersion = minVersion;
    this.screenDpi = screenDpi;
    this.releaseDate = releaseDate;
  }

  setVariantCode(variantId) {
    if (typeof variantId !== "number" || variantId.length === 0) {
      throw new Error("Variant code must be a non-empty number");
    }
    this.variantId = variantId;
  }

  setVariantId(versionId) {
    if (typeof versionId !== "string" || versionId.length === 0) {
      throw new Error("Variant ID must be a non-empty string");
    }
    this.versionId = versionId;
  }

  setArchitecture(architecture) {
    if (typeof architecture !== "string" || architecture.length === 0) {
      throw new Error("Architecture must be a non-empty string");
    }
    this.architecture = architecture;
  }

  setMinVersion(minVersion) {
    if (typeof minVersion !== "string" || minVersion.length === 0) {
      throw new Error("Minimum version must be a non-empty string");
    }
    this.minVersion = minVersion;
  }

  setScreenDpi(screenDpi) {
    if (typeof screenDpi !== "string" || screenDpi.length === 0) {
      throw new Error("Screen DPI must be a non-empty string");
    }
    this.screenDpi = screenDpi;
  }

  setReleaseDate(releaseDate) {
    if (typeof releaseDate !== "object" || !(releaseDate instanceof Date)) {
      throw new Error("Release date must be a Date object");
    }
    this.releaseDate = releaseDate;
  }
}
