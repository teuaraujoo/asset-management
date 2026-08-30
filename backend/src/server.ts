import "dotenv/config";
import app from "./app";
import logger from "./libs/logger";
import { startMemoryMonitor } from "./monitoring/memory.monitor";

const PORT = process.env.PORT ?? 3000;
const memoryMonitor = startMemoryMonitor();
const server = app.listen(PORT, () => {
    logger.info({
        event: "server.started",
        port: PORT,
        environment: process.env.NODE_ENV ?? "development",
    }, "Server started");
});

function shutdown(signal: string) {
    clearInterval(memoryMonitor);

    logger.info(
        {
            event: "server.shutdown_started",
            signal,
        },
        "Server shutdown started",
    );

    server.close((error) => {
        if (error) {
            logger.error(
                {
                    event: "server.shutdown_failed",
                    err: error,
                },
                "Server shutdown failed",
            );

            process.exit(1);
        }

        logger.info(
            { event: "server.shutdown_completed" },
            "Server shutdown completed",
        );

        process.exit(0);
    });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
