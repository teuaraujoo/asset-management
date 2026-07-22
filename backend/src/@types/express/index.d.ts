import { JwtPayload } from "jsonwebtoken";

interface AuthUser {
    sub: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user: AuthUser;
            refreshToken: string;
        }
    }
}

export { };