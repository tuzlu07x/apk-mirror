import express from "express";
import connectDB from "./config/db.js";
import scrapingRouter from "./routes/scrapingRouter.js";
import variantRouter from "./routes/variantRouter.js";
const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", scrapingRouter);
app.use("/", variantRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda başlatıldı`);
});
