import { model, Schema } from "mongoose";
import { IAuth } from "../../../interfaces/database/Auth"

const AuthSchema = new Schema({
  id: String,
  username: String,
});

export const Auth = model<IAuth>("Auth", AuthSchema);
