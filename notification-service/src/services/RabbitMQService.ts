import amqp, { Channel } from "amqplib";
import config from "../config/config";
import { sendEmail } from "../utils/email";
import { FCMService } from "../utils/fcm";

class RabbitMQService {
  private channel!: Channel;
  private fcmService = new FCMService();

  constructor() {
    this.init();
  }

  async init() {
    const connection = await amqp.connect(config.msgBrokerURL!);
    this.channel = await connection.createChannel();
    await this.consumeNotification();
  }

  async consumeNotification() {
    await this.channel.assertQueue(config.queue.notifications);
    this.channel.consume(config.queue.notifications, async (msg) => {
      if (msg) {
        const {
          type,
          message,
          userEmail,
          fcmToken,
          fromName,
        } = JSON.parse(msg.content.toString());

        if (type === "MESSAGE_RECEIVED") {
          await sendEmail(
            userEmail, //to
            `New Message from ${fromName}`, //subject
            message //html
          );
          await this.fcmService.sendPushNotification(fcmToken, message);
        }

        this.channel.ack(msg); // Acknowledge the message after processing
      }
    });
  }
}

export const rabbitMQService = new RabbitMQService();
