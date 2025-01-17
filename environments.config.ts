import dotenv from "dotenv";

dotenv.config();

export default {
    PORT: process.env.PORT as string,
    CLIENT_ID: process.env.CLIENT_ID as string,
    SECRET: process.env.SECRET as string,
    REDIRECT_URI: process.env.REDIRECT_URI as string,
    OAUTH: process.env.OAUTH as string,
    MONGO_URI: process.env.MONGO_URI as string,
    NODE_ENV: process.env.NODE_ENV as string,
    JWT_SECRET: process.env.JWT_SECRET as string
}
