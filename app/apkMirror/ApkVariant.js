import axios from "axios";
import cheerio from "cheerio";
import { proxies } from "../../proxyList.js";

export default class ApkVariantScraping {
  constructor(versionId) {
    this.versionId = versionId;
    this.data = [];
    this.proxyList = proxies;
  }

  getData() {
    return this.data;
  }

  async request() {
    try {
      let proxy = this.getRandomProxy();
      console.log("proxy:  ", proxy);
      const versionId = this.setVariantIdAccordingUrl();
      const url = `${process.env.APK_MIRROR_BASE_URI}/apk/instagram/instagram-instagram/instagram-instagram-${versionId}-release/`;
      const response = await axios.get(url, {
        proxy: {
          host: proxy.ip,
          port: proxy.port,
          protocol: "http",
          secure: false,
          requireTLC: true,
          auth: {
            username: process.env.PROXY_USERNAME,
            password: process.env.PROXY_PASSWORD,
          },
        },
      });
      const html = response.data;
      const $ = cheerio.load(html);
      const apkVariants = $(
        ".listWidget .variants-table .table-row.headerFont"
      );

      this.pushData(apkVariants, $);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        let proxy = this.getRandomProxy();
        console.log("Proxy blocked. 403 Code");

        this.proxyList = this.proxyList.filter(
          (p) => p.ip !== proxy.ip || p.port !== proxy.port
        );
        return this.request();
      }
      throw new Error("Error fetching data: " + error.message);
    } finally {
      await this.delay(3000);
    }
  }

  pushData(apkVariants, $) {
    apkVariants.each((index, element) => {
      const tableCells = $(element).find(".table-cell");
      const architecture = tableCells.eq(1).text().trim();
      const minVersion = tableCells.eq(2).text().trim();
      const screenDpi = tableCells.eq(3).text().trim();
      const releaseDate = $(element).find(".dateyear_utc").text().trim();
      const variantIdElement = $(element).find(".colorLightBlack").first();
      const variantId = variantIdElement.text().trim();

      if (variantId !== null) {
        return this.data.push({
          variantId:
            typeof variantId === "string" ? parseInt(variantId) : variantId,
          versionId: this.versionId,
          architecture,
          minVersion,
          screenDpi,
          releaseDate: new Date(releaseDate),
        });
      }
    });
  }

  getRandomProxy() {
    const randomIndex = Math.floor(Math.random() * this.proxyList.length);
    return this.proxyList[randomIndex];
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setVariantIdAccordingUrl() {
    return this.versionId.replace(/\./g, "-");
  }
}
