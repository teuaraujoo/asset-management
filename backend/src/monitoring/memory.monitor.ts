import logger from "../libs/logger";

const BYTES_IN_MEGABYTE = 1024 * 1024;
const MEMORY_SAMPLE_INTERVAL_MS = 60_000;

function bytesToMegabytes(bytes: number) {
    return Number((bytes / BYTES_IN_MEGABYTE).toFixed(2));
}

function getConfiguredMemoryLimit() {
    const configuredLimit = Number(process.env.MEMORY_LIMIT_MB);

    if (!Number.isFinite(configuredLimit) || configuredLimit <= 0) {
        return 0;
    }

    return configuredLimit * BYTES_IN_MEGABYTE;
}

function getMemoryLimit() {
    const constrainedMemory = process.constrainedMemory();

    return constrainedMemory > 0
        ? constrainedMemory
        : getConfiguredMemoryLimit();
}

export function startMemoryMonitor() {
    const interval = setInterval(() => {
        const {
            rss,
            heapTotal,
            heapUsed,
            external,
            arrayBuffers,
        } = process.memoryUsage();
        const memoryLimit = getMemoryLimit();

        logger.info(
            {
                event: "process.memory_sample",
                memory: {
                    rssMb: bytesToMegabytes(rss),
                    heapTotalMb: bytesToMegabytes(heapTotal),
                    heapUsedMb: bytesToMegabytes(heapUsed),
                    externalMb: bytesToMegabytes(external),
                    arrayBuffersMb: bytesToMegabytes(arrayBuffers),
                    limitMb: memoryLimit > 0
                        ? bytesToMegabytes(memoryLimit)
                        : null,
                    rssUsagePercentage: memoryLimit > 0
                        ? Number(((rss / memoryLimit) * 100).toFixed(2))
                        : null,
                },
            },
            "Process memory sampled",
        );
    }, MEMORY_SAMPLE_INTERVAL_MS);

    interval.unref();

    return interval;
}
