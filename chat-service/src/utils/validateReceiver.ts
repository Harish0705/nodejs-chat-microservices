import { NotFoundError, BadRequestError } from "../errors";
export const validateReceiver = async (senderId: string, receiverId: string) => {
  if (!receiverId) {
    throw new NotFoundError("Receiver ID is required.");
  }

  if (senderId == receiverId) {
    throw new BadRequestError("Sender and receiver cannot be the same.");
  }
};
