import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { allRoutes } from "./routes/routes";
import path from "path";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// Set EJS as the view engine
app.set("views", path.join("views"));
app.set("view engine", "ejs");
app.use("/api/v1", allRoutes);

// start the server
app.listen(process.env.PORT, () => {
  // sequelize;
  console.log("Server started on port", process.env.PORT || 8080);
});

export default app;
