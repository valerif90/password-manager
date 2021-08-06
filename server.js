import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";

const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());

const port = process.env.PORT || 5000;

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    },
    () => console.log("DB connected")
);

app.use(passwordRoutes);
app.use(authRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

app.listen(port, () => console.log(`Server running at ${port}`));