import dotenv from "dotenv";
import http from "http";
import connectDB from "./db/index.js";
import { app } from "./app.js";
// import { initSocketServer } from "./socket.js";

dotenv.config({ path: "./env" });

const server = http.createServer(app);
// initSocketServer(server);

connectDB()
  .then(() => {
    server.on("error", (err) => {
      console.log("ERROR", err);
    });
    server.listen(process.env.PORT || 8000, () => {
      console.log("Server running on port:" + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("mongoDB connection failed", err);
  });
