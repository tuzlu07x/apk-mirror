import express from "express";
import connectDB from "./config/db.js";
import router from "./routes/router.js";
const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);
console.log("sdfdsffdsfds");
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda başlatıldı`);
});
