import express from "express";
import { Server } from "http";
import "express-async-errors";
import cookieParser from "cookie-parser";
import { Socket, Server as SocketIOServer } from "socket.io";
import config from "./config/config";
import { Message, connectDB } from "./database";
import { notFound } from "./middleware/notFound";
import { errorHandlerMiddleware } from "./middleware/errorHandler";
import { rabbitMQService } from "./services/RabbitMQService";
import messageRouter from "./routes/messageRoutes";

const app = express();

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// routes
app.use(messageRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

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
await connectDB();

server = app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});

const io = new SocketIOServer(server);
io.on("connection", (socket: Socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });

    socket.on("sendMessage", (message) => {
        io.emit("receiveMessage", message);
    });

    socket.on("sendMessage", async (data) => {
        const { senderId, receiverId, message } = data;
        const msg = new Message({ senderId, receiverId, message });
        await msg.save();

        io.to(receiverId).emit("receiveMessage", msg); // Assuming receiverId is socket ID of the receiver
    });
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
