import { Router, Request, Response } from "express";

import { GuildService } from "./guild/guild.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { DatabaseService } from "../services/database/database.service";
import { Guilds } from "../services/database/models/Guilds";
import { AuthenticatedRequest } from "../interfaces/express/Request";

const GuildController = Router();
const databaseService = new DatabaseService();
const guildService = new GuildService(databaseService);

GuildController.get("/list", authMiddleware, async (request: AuthenticatedRequest, response: Response) => {
  try {
    const userId = request.user?.id;
    
    if ( !userId ) 
    {
      response.status(401).send({ error: "Unauthorized" });
      return;
    }
    const userInfo = await databaseService.GetInfo(Guilds, { userId: userId });

    if ( !userInfo ) 
    {
      response.status(404).send({ error: "User not found" });
      return;
    }

    response.status(200).send({ guilds: userInfo.guilds });
  } catch (err) {
    console.error(err);
    response.status(500).send({ error: "Internal Server Error" });
  }
});


GuildController.get("/:id", authMiddleware, async (request: AuthenticatedRequest, response: Response) => {
  try {
    const userId = request.user?.id;
    const guildId = request.params.id;

    if ( !userId ) 
    {
      response.status(401).send({ error: "Unauthorized" });
      return
    }

    const userInfo = await databaseService.GetInfo(Guilds, { userId: userId });

    if ( !userInfo ) 
    {
      response.status(404).send({ error: "User not found" });
      return;
    }

    const selectedGuild = userInfo.guilds.find((guild) => guild.id === guildId);

    if (!selectedGuild) 
    {
      response.status(404).send({ error: "Guild not found" });
      return;
    }

    response.status(200).send({ selectedGuild });
  } catch (err) {
    console.error(err);
    response.status(500).send({ error: "Internal Server Error" });
  }
});


export { GuildController };
