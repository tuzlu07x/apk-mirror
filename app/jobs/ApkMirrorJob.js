import Queue from "bull";
import Variant from "../../models/Variant.js";

const apkMirrorJob = new Queue("sendApkMirrorData", {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_PASSWORD,
  },
});

apkMirrorJob.process(async (job) => {
  if (job.data.type === "apk-mirror") await chunk(job.data.data);
  await clearRedisData();
  console.log("Queue type", job.data.type);
});

const chunk = async (data) => {
  const chunkSize = 10;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    try {
      for (const record of chunk) {
        await createOrUpdate(record);
      }
    } catch (error) {
      throw new Error(
        "While variant is creating there is an error.",
        error.message
      );
    }
  }
};

const createOrUpdate = async (record) => {
  const filter = { variantCode: record.variantCode };
  const updateOptions = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  };
  const result = await Variant.findOneAndUpdate(filter, record, updateOptions);
  console.log("Variant Created Successfully.", result);
  return result;
};

const clearRedisData = async () => {
  await apkMirrorJob.empty();
  console.log("Redis data cleared.");
};

export default apkMirrorJob;
