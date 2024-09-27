import express from "express";
import "express-async-errors"; // handle errors
import cookieParser from "cookie-parser";
import config from "./config/config";
import { connectDB } from "./database";
import { notFound } from "./middleware/notFound";
import { errorHandlerMiddleware } from "./middleware/errorHandler";
import authRouter from "./routes/authRoutes";

const app = express();

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// routes
app.use("/api/v1/auth", authRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);


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
