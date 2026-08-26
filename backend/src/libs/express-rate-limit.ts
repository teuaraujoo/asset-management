import type { Request } from "express";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";

const MINUTE_IN_MILLISECONDS = 60 * 1000;
const HOUR_IN_MILLISECONDS = 60 * MINUTE_IN_MILLISECONDS;

const defaultOptions = {
    standardHeaders: "draft-8" as const,
    legacyHeaders: false,
};

function authenticatedUserKey(req: Request): string {
    const clientIp = req.ip ?? req.socket.remoteAddress ?? "unknown";

    return req.user?.sub ?? ipKeyGenerator(clientIp);
}

export const loginLimiter = rateLimit({
    ...defaultOptions,
    identifier: "auth-login",
    windowMs: 3 * MINUTE_IN_MILLISECONDS,
    limit: 5,
    skipSuccessfulRequests: true,
    message: {
        message: "Muitas tentativas de login. Tente novamente mais tarde.",
    },
});

export const refreshTokenLimiter = rateLimit({
    ...defaultOptions,
    identifier: "auth-refresh",
    windowMs: 15 * MINUTE_IN_MILLISECONDS,
    limit: 30,
    message: {
        message: "Muitas tentativas de renovar a sessão. Tente novamente mais tarde.",
    },
});

export const sessionMutationLimiter = rateLimit({
    ...defaultOptions,
    identifier: "auth-session-mutation",
    windowMs: 15 * MINUTE_IN_MILLISECONDS,
    limit: 20,
    message: {
        message: "Muitas operações de sessão. Tente novamente mais tarde.",
    },
});

export const authenticatedReadLimiter = rateLimit({
    ...defaultOptions,
    identifier: "authenticated-read",
    windowMs: MINUTE_IN_MILLISECONDS,
    limit: 120,
    keyGenerator: authenticatedUserKey,
    message: {
        message: "Muitas consultas. Tente novamente em instantes.",
    },
});

export const prepareUploadLimiter = rateLimit({
    ...defaultOptions,
    identifier: "file-prepare-upload",
    windowMs: HOUR_IN_MILLISECONDS,
    limit: 30,
    keyGenerator: authenticatedUserKey,
    message: {
        message: "Muitas solicitações de upload. Tente novamente mais tarde.",
    },
});

export const completeUploadLimiter = rateLimit({
    ...defaultOptions,
    identifier: "file-complete-upload",
    windowMs: HOUR_IN_MILLISECONDS,
    limit: 60,
    keyGenerator: authenticatedUserKey,
    message: {
        message: "Muitas confirmações de upload. Tente novamente mais tarde.",
    },
});

export const fileMutationLimiter = rateLimit({
    ...defaultOptions,
    identifier: "file-mutation",
    windowMs: 15 * MINUTE_IN_MILLISECONDS,
    limit: 30,
    keyGenerator: authenticatedUserKey,
    message: {
        message: "Muitas alterações em arquivos. Tente novamente mais tarde.",
    },
});

export const createProjectLimiter = rateLimit({
    ...defaultOptions,
    identifier: "project-create",
    windowMs: HOUR_IN_MILLISECONDS,
    limit: 10,
    keyGenerator: authenticatedUserKey,
    message: {
        message: "Muitas tentativas de criar projeto. Tente novamente mais tarde.",
    },
});

export const projectMutationLimiter = rateLimit({
    ...defaultOptions,
    identifier: "project-mutation",
    windowMs: 15 * MINUTE_IN_MILLISECONDS,
    limit: 30,
    keyGenerator: authenticatedUserKey,
    message: {
        message: "Muitas alterações em projetos. Tente novamente mais tarde.",
    },
});
