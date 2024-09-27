import { rabbitMQService } from "../services/RabbitMQService";


export const handleMessageReceived = async (
    senderName: string,
    senderEmail: string,
    receiverId: string,
    messageContent: string
) => {

    await rabbitMQService.notifyReceiver(
        receiverId,
        messageContent,
        senderEmail,
        senderName
    );
};