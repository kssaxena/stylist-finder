import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const allowedOrigins = [
  process.env.ORIGIN_1,
  process.env.ORIGIN_2,
  process.env.ORIGIN_3,
].filter(Boolean);

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      return callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.text({ limit: "10mb", type: "text/*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(compression());
// app.use(limiter());
// app.use(trackVisitor());

app.use((req, res, next) => {
  console.log("__________________________________________________");
  console.log("Request method:", req.method);
  console.log("Request received at:", req.url);
  console.log("Request with body:", req.body);
  console.log("Request from origin:", req.headers.origin);
  next();
});

// now importing routes and using them
import customerRoutes from "./routes/customer.route.js";
import professionalRoutes from "./routes/professional.route.js";
import storeRoutes from "./routes/store.route.js";

app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/professional", professionalRoutes);
app.use("/api/v1/store", storeRoutes);

export { app };
