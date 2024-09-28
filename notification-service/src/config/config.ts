import "dotenv/config";

const { PORT, NODE_ENV, MESSAGE_BROKER_URL, ETHEREAL_USER,ETHEREAL_PWD } =
    process.env;
    
const queue = { notifications: "NOTIFICATIONS" };

export default {
    PORT,
    env: NODE_ENV,
    msgBrokerURL: MESSAGE_BROKER_URL,
    queue,
    ETHEREAL_USER,
    ETHEREAL_PWD
};