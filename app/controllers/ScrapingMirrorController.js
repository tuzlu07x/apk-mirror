import ApkMirrorMergeService from "../Services/ApkMirrorMergeService.js";

const scraping = new ApkMirrorMergeService();

async function getApkMirror(req, res) {
  try {
    const send = await scraping.send();
    res.status(200).json({ send, message: "Sending" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { getApkMirror };
