import { Response } from "express";
import { AuthRequest } from "../middleware/authUserMiddleware";
import { StatusCodes } from "http-status-codes";
import { Message } from "../database";
import { handleMessageReceived, validateReceiver } from "../utils";

export const sendMessage = async (req: AuthRequest, res: Response) => {
  const { receiverId, message } = req.body;
  const { id: senderId, name, email } = req.user;

  await validateReceiver(senderId, receiverId);

  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });

  await handleMessageReceived(name, email, receiverId, message);
  res
    .status(StatusCodes.OK)
    .json({ data: newMessage, message: "Message sent successfully!" });
};

export const getMessage = async (req: AuthRequest, res: Response) => {
  const { id: receiverId } = req.params;
  const senderId = req.user.id;
  console.log(receiverId);
  console.log(senderId);

  const messages = await Message.find({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  });
  console.dir(messages);
  res
    .status(StatusCodes.OK)
    .json({ data: messages, message: "Message retrieved successfully!" });
};
