import { model, Schema } from "mongoose";
import { IGuild } from "../../../interfaces/database/Guilds"

const GuildSchema = new Schema({
  guilds: Array,
  userId: String
});

export const Guilds = model<IGuild>("Guilds", GuildSchema);
