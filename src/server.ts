import express from "express";
import bodyParser from "body-parser";
import http from "http";
import helloRoute from "./routes/index";
import logger from "./config/logger";
import { env } from "./config/env/env";

const port = env.API_LOCAL_PORT;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helloRoute);

http.createServer(app).listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
