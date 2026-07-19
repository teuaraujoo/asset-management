import express from "express";
import "dotenv/config"

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.listen(PORT, () => {
    console.log("SERVIDOR RODANDO NA PORTA", PORT)
});