import { randomUUID } from "node:crypto";
import pinoHttp from "pino-http";
import logger from "../libs/logger";

const loggerMiddleware = pinoHttp({
    logger,

    genReqId(req, res) {
        const requestId = req.headers["x-request-id"]?.toString() ?? randomUUID();
        res.setHeader("x-request-id", requestId);

        return requestId;
    },

    customLogLevel(_req, res, error) {
        if (error || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";

        return "info";
    },

    customSuccessMessage() {
        return "HTTP request completed";
    },

    customErrorMessage() {
        return "HTTP request failed";
    },

    serializers: {
        req(req) {
            return {
                id: req.id,
                method: req.method,
                url: req.url
            };
        },

        res(res) {
            return {
                statusCode: res.statusCode
            };
        },
    },

});

export default loggerMiddleware;