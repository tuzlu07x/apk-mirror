import ApkMirrorMergeService from "../Services/ApkMirrorMergeService.js";

async function getApkMirror() {
  try {
    const scraping = new ApkMirrorMergeService();
    return scraping.send();
  } catch (error) {
    throw new Error(
      "There is an error in ScrapingMirrorController: ",
      error.message
    );
  }
}

export { getApkMirror };
