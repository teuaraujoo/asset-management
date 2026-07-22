import AppError from "../../error/app-error";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { LoginBody, LoginResponse, loginUserSchema } from "./auth.schema";
import AuthRepository from "./auth.repositories";
import UserRepository from "../users/users.repositories";
export default class AuthSerivces {

    private static FIFTEEN_MINUTES = 15;
    private static SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

    static async login(body: LoginBody) {
        try {
            const data = loginUserSchema.parse(body);
            const user = await UserRepository.getUserByEmail(data.email);

            if (!user) throw new AppError("Senha ou email inválidos.", 401);

            const correctPassword = await bcrypt.compare(body.password, user.password_hash);

            if (!correctPassword) throw new AppError("Senha ou email incorretos!", 401);

            const accessToken = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: `${this.FIFTEEN_MINUTES}m` });
            const { refreshToken, tokenHash } = this.generateTokenHash();

            const refreshTokenData = {
                token_hash: tokenHash,
                expires_at: this.generateExpiresAt(),
                users: {
                    connect: {
                        id: user.id,
                    },
                },
            };

            const persistRefreshToken = await AuthRepository.persistRefreshToken(refreshTokenData);

            if (!persistRefreshToken) throw new AppError("Error ao armazenar token no banco.", 401);

            return {
                accessToken,
                refreshToken,
                user: {
                    name: user.name
                },
            };
        } catch (err) {
            throw err;
        };
    };

    static async logout(token: string) {
        try {
            const refreshToken = this.hashToken(token);

            const findToken = await AuthRepository.findTokenByHash(refreshToken);

            if (!findToken) throw new AppError("Token não encontrado.", 404);

            const revokedToken = await AuthRepository.revokedToken(findToken.id);

            if (!revokedToken) throw new AppError("Error ao revogar token.", 409);

            return revokedToken;

        } catch (err) {
            throw err;
        };
    };

    static async refresh(token: string) {
        try {
            const now = new Date();

            const refreshToken = this.hashToken(token);

            const findToken = await AuthRepository.findTokenByHash(refreshToken);

            if (!findToken) throw new AppError("Refresh token não encontrado.", 401);

            if (findToken.expires_at <= now) {
                await AuthRepository.revokedToken(findToken.id);

                throw new AppError("Refresh token já expirado", 401)
            };

            if (findToken.revoked_at) throw new AppError("Refresh token já revogado", 401);

            const user = await UserRepository.getUserById(findToken?.user_id);

            if (!user) throw new AppError("Nenhum usuário vinculado a esse token.", 401);

            const accessToken = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: `${this.FIFTEEN_MINUTES}m` });

            return { accessToken };
        } catch (err) {
            throw err;
        };
    };

    private static hashToken(token: string) {
        return crypto.createHash("sha256").update(token).digest("hex");
    };

    private static generateTokenHash() {
        const refreshToken = crypto.randomBytes(64).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
        return {
            refreshToken,
            tokenHash
        };
    };

    private static generateExpiresAt() {
        return new Date(Date.now() + this.SEVEN_DAYS);
    };
};