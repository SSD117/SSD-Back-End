import express from "express";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import configDotenv from "dotenv";
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

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
  console.log(`🚀 App listening on port ${app.get("port")} 🚀`);
});
