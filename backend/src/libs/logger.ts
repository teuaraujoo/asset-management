import pino from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";

const logger = pino({
    level: process.env.LOG_LEVEL ?? "info",

    redact: {
        paths: [
            "password",
            "token",
            "accessToken",
            "refreshToken",
            "authorization",
            "cookie",
            "req.headers.authorization",
            "req.headers.cookie",
            "body.password",
        ],
        censor: "[REDACTED]"
    },
    transport: isDevelopment
        ? {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
            },
        }
        : undefined,
});

export default logger;