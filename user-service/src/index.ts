import express from "express";
import "express-async-errors"; // handle errors
import cookieParser from "cookie-parser";
import config from "./config/config";
import { connectDB } from "./database";
import { notFound } from "./middleware/notFound";
import { errorHandlerMiddleware } from "./middleware/errorHandler";
import authRouter from "./routes/authRoutes";
import { rabbitMQService } from "./services/RabbitMQService";

const app = express();

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// routes
app.use(authRouter);

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

const start = async () => {
  try {
    await connectDB();
    app.listen(config.PORT, () =>
      console.log(`Server is listening on port ${config.PORT}...`)
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
      console.log('there was an error....');
    }
  }
};

start();
