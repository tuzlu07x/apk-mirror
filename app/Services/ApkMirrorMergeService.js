import ApkDistribution from "../apkMirror/ApkDistribution.js";
import ApkVariant from "../apkMirror/ApkVariant.js";
import Queue from "../jobs/ApkMirrorJob.js";

export default class ApkMirrorMergeService {
  constructor() {
    this.apkDistribution = new ApkDistribution();
  }

  async send() {
    await this.apkDistribution.request();
    this.apkDistribution.getData().map(async (item) => {
      console.log("service burasi: ", item.varianId);
      const apkVariant = new ApkVariant(item.varianId);
      await apkVariant.request();
      const response = await Queue.add({
        type: "apk-mirror",
        data: apkVariant.getData(),
      });
      console.log("wait for this item:  ", item);
      return response;
    });
  }
}
