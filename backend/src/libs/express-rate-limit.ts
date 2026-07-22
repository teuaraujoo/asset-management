import { rateLimit } from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutos
    max: 5, // 5 vezes 
    message: { message: "Muitas tentativas de login. Tente novamente mais tarde." },
    legacyHeaders: false // Desativa cabeçalhos antigos com prefixo X-
});