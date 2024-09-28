import express from "express";
import "express-async-errors";
import { Server } from "http";
import { errorHandlerMiddleware } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import config from "./config/config";
import { rabbitMQService } from "./services/RabbitMQService";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandlerMiddleware);
app.use(notFound);

const initializeRabbitMQClient = async () => {
    try {
        await rabbitMQService.init();
        console.log("RabbitMQ client initialized and listening for messages.");
    } catch (err) {
        console.error("Failed to initialize RabbitMQ client:", err);
    }
};

initializeRabbitMQClient();

let server: Server;
server = app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
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