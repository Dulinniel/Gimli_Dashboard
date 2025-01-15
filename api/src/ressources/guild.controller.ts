import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { DatabaseService } from "../services/database/database.service";
import { Guilds } from "../services/database/models/Guilds";

const GuildController = Router();
const databaseService = new DatabaseService();

// Protected route
GuildController.get("/guilds", authMiddleware, async ( request: Request, response: Response ) => {
  try {
    const userId = request.user.id;
    const userInfo = await databaseService.GetInfo(Guilds, { id: userId });

    if (!userInfo) 
    {
      response.status(404).send({ error: "User not found" });
      return;
    }

    response.status(200).send({ guilds: userInfo.guilds });
    return;
  } catch (err) {
    console.error(err);
    response.status(500).send({ error: "Internal Server Error" });
    return;
  }
});

export { GuildController };
