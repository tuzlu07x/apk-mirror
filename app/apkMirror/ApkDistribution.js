import axios from "axios";
import cheerio from "cheerio";

export default class ApkDistribution {
  constructor(data = []) {
    this.page = 1;
    this.data = data;
  }

  getData() {
    return this.data;
  }

  async request() {
    try {
      await this.pushData();
      console.log(this.data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async pushData() {
    while (true) {
      const url = `${process.env.APK_MIRROR_BASE_URI}/uploads/page/${this.page}/?appcategory=instagram-instagram`;
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      console.log("page: ", this.page);
      console.log("data: ", this.data.length);
      const apkRows = $(".listWidget .appRow");
      if (!apkRows || apkRows.length === 0) {
        break;
      }

      this.eachApkRows(apkRows, $);
      this.page++;
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (this.data.length >= 10) {
        break;
      }
    }
  }

  eachApkRows(apkRows, $) {
    apkRows.each((index, element) => {
      if (this.data.length >= 10) return;

      const apkName = $(element).find(".appRowTitle").text().trim();

      if (!this.filterCondination(apkName)) {
        this.data.push({
          varianId: this.parseApkNameForVariantId(apkName),
        });
      }
    });
  }

  filterCondination(apkName) {
    const isAlphaBeta =
      apkName.toLowerCase().includes("alpha") ||
      apkName.toLowerCase().includes("beta") ||
      !apkName.includes("Instagram");

    return isAlphaBeta;
  }

  parseApkNameForVariantId(apkName) {
    const parts = apkName.split(" ");
    const version = parts[1];
    return version.replace(/\./g, "-");
  }
}
