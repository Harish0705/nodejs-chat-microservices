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

  /* I have generated the fcm token using a react client application:
  Refer FrontEnd Code in client-fcm folder  */
  // I have added a dumy token. You can create your token from firebase using by refering to the client-code and paste it here for testing it
  const fcmToken = "djhskjdhkjhdjkshdjkshkjdhj";
  await handleMessageReceived(
    name,
    email,
    receiverId,
    message,
    fcmToken
  );
  res
    .status(StatusCodes.OK)
    .json({ data: newMessage, message: "Message sent successfully!" });
};

export const getMessage = async (req: AuthRequest, res: Response) => {
  const { id: receiverId } = req.params;
  const senderId = req.user.id;

  const messages = await Message.find({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  });
  res
    .status(StatusCodes.OK)
    .json({ data: messages, message: "Message retrieved successfully!" });
};
