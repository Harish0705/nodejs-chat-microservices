import express from "express";
import proxy from "express-http-proxy";
import "dotenv/config";
import "express-async-errors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const auth = proxy("http://localhost:4000");
const messages = proxy("http://localhost:3000");
const notifications = proxy("http://localhost:7000");

app.use("/api/v1/auth", auth);
app.use("/api/v1/message", messages);
app.use("/api/notifications", notifications);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`Gateway is Listening to Port ${port}`);
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info("Server closed");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);