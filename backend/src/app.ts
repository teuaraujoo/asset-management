import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import errorHandler from "./middlewares/error.middleware";
import AuthRoutes from "./modules/auth/auth.routes";
import UserRoutes from "./modules/users/users.routes";
import { filesRoutes, projectsRoutes, publicRoutes } from "./composition-root";
import loggerMiddleware from "./middlewares/logger.middleware";

const app = express();
const apiVersion = "/api/v1";
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "ams-teuaraujo.vercel.app",
    "ams-teuaraujo.netlify.app"
];

if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);

app.disable("x-powered-by");
app.use(loggerMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.use(apiVersion, AuthRoutes);
app.use(apiVersion, UserRoutes);
app.use(apiVersion, projectsRoutes);
app.use(apiVersion, filesRoutes);
app.use(apiVersion, publicRoutes);
app.use(errorHandler);

export default app;
