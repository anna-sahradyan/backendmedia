import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import postRouter from './routes/posts-router.js';
import userRouter from "./routes/user-router.js";
import path from "path";
const cors_proxy = require('cors-anywhere');
//?Constants

const PORT = process.env.PORT || 4000;
const app = express();
dotenv.config();


//?Middleware
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

//?Routes
app.use(`/posts`, postRouter);
app.use(`/user`,userRouter);
let proxy = cors_proxy.createServer({
    originWhitelist: [],
    requireHeaders: [],
    removeHeaders: [],
});
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontendmedia/build")))
    app.get("*", (req, res) => {
        res.sendFile(
            path.resolve(__dirname, "../", "frontendmedia", "build", "index.html")
        )
    })

} else {
    app.get("/", (req, res) => {
        res.send("Home Page")
    })

}

//?Connect
mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => app.listen(PORT, () => console.log(`Server is running in http://localhost:${PORT}`))).catch((error) => console.log(error.message));



