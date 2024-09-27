import { Router } from "express";
import { sendMessage, getMessage } from "../controllers/MessageController";
import { authUserMiddleware } from "../middleware/authUserMiddleware";

const messageRouter = Router();
// @ts-ignore
messageRouter.route("/send").post(authUserMiddleware, sendMessage);
// @ts-ignore
messageRouter.route("/get/:id").get(authUserMiddleware, getMessage);

export default messageRouter;
