import dotenv from "dotenv";

dotenv.config();

export default {
    PORT: process.env.PORT,
    CLIENT_ID: process.env.CLIENT_ID,
    SECRET: process.env.SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI,
    OAUTH: process.env.OAUTH,
    MONGO_URI: process.env.MONGO_URI
}
