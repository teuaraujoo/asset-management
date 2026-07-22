import "dotenv/config"
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import errorHandler from "./middlewares/error.middleware";
import AuthRoutes from "./modules/auth/auth.routes";

const app = express();
const apiVersion = "/api/v1";

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.use(errorHandler);
app.use(apiVersion, AuthRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("SERVIDOR RODANDO NA PORTA", PORT)
});