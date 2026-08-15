import "dotenv/config"
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import errorHandler from "./middlewares/error.middleware";
import AuthRoutes from "./modules/auth/auth.routes";
import UserRoutes from "./modules/users/users.routes";
import ProjectRoutes from "./modules/projects/projects.routes";
import FilesRoutes from "./modules/files/files.routes";

const app = express();
const apiVersion = "/api/v1";
const allowedOrigins = [
    "http://localhost:5173",
    "https://ams-teuaraujo.netlify.app"
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

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
app.use(apiVersion, ProjectRoutes);
app.use(apiVersion, FilesRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("SERVIDOR RODANDO NA PORTA", PORT)
});