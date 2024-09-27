import "dotenv/config";

const { MONGO_URI, PORT, JWT_SECRET, NODE_ENV, MESSAGE_BROKER_URL, JWT_LIFETIME } =
    process.env;

export default {
    MONGO_URI,
    PORT,
    JWT_SECRET,
    JWT_LIFETIME,
    env: NODE_ENV,
    msgBrokerURL: MESSAGE_BROKER_URL,
};