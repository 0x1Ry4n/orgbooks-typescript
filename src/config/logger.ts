import { createLogger, format, transports } from "winston";

const loggerFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.simple(),
    format.printf((info) => {
        return `${info.timestamp} - [${info.level.toUpperCase()}]: ${JSON.stringify(info.message, null, "\t")}`;
    }),
    format.colorize({
        all: true,
    }),
);

const logger = createLogger({
    format: loggerFormat,
    transports: [new transports.Console({ level: "silly" }), new transports.File({ filename: "error.log", level: "error" })],
});

export default logger;
