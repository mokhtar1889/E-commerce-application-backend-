import express from "express";
import { bootstrap } from "./bootstrap.js";
import dotenv from "dotenv";

dotenv.config();

let app = express();

let port = process.env.PORT;

await bootstrap(app);

app.listen(port, () => console.log("app ruunig at port ", port));
