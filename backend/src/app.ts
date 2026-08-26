import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import errorHandler from "./middlewares/error.middleware";
import AuthRoutes from "./modules/auth/auth.routes";
import UserRoutes from "./modules/users/users.routes";
import { filesRoutes, projectsRoutes } from "./composition-root";

const app = express();
const apiVersion = "/api/v1";
const allowedOrigins = [
    "http://localhost:5173",
    "https://ams-teuaraujo.netlify.app"
];

if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);

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
app.use(errorHandler);

export default app; 