import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import routes from "@/routes";
import passportHandler from "@/services/passport";
import logger from "@/config/logger";
import { env } from "@/config/env/env";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

const port = env.API_LOCAL_PORT;

const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: "*", credentials: true, methods: "GET,POST,PUT,DELETE,PATCH" }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 30 * 60 * 1000, sameSite: true },
        store: new PrismaSessionStore(new PrismaClient(), {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    }),
);

passportHandler.initialize(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

http.createServer(app).listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
