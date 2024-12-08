import express from "express";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import configDotenv from "dotenv";
import cors from "cors";
import userRouter from "./src/routers/user.js";
import authRouter from "./src/routers/auth.js";
import sportRouer from "./src/routers/sport.js";
import classRouter from "./src/routers/class.js";

configDotenv.config();
const app = express();
app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV === "prod") app.use(morgan("combined"));
else app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(
//   cors({
//     origin: process.env.FRONT_URL, // Allow this origin
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true, // If you need to include cookies
//   })
// );

const allowedOrigins = [
  "http://158.180.80.145:3000",
  "http://localhost:3000",
  "http://frontend:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // 요청의 `origin`이 허용된 목록에 있는지 확인
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // 허용
      } else {
        callback(new Error("Not allowed by CORS")); // 차단
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // 쿠키 및 인증 정보 포함
  })
);

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/sport", sportRouer);
app.use("/class", classRouter);
app.get("/ping", (req, res) => {
  return res.status(200).send("pong");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
  console.log(`🚀 App listening on port ${app.get("port")} 🚀`);
});
