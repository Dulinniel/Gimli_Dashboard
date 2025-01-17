import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

import chalk from "chalk";

import { AuthService } from "./auth/auth.service";
import { GuildService } from "./guild/guild.service";
import { JwtService } from "../services/jwt/jwt.service";
import { DatabaseService } from "../services/database/database.service";

import { IAuth } from "../interfaces/database/Auth";
import { DiscordGuilds } from "../interfaces/database/Guilds";
import { AuthenticatedRequest } from "../interfaces/express/Request";

import config from "../../environments.config";

const AuthController = Router();
const databaseService = new DatabaseService();
const authService = new AuthService(databaseService, config);
const guildService = new GuildService(databaseService);
const jwtService = new JwtService();

AuthController.get("/", ( _request: Request, response: Response ) => {
  console.log(chalk.blue(`* [Redirection] Redirected to /auth`));
  return response.status(307).redirect(config.OAUTH as string);
});

AuthController.get("/discord", async ( request: Request, response: Response ) => {
  try {
    const code: string = request.query.code as string;

    if ( !code ) 
    {
      response.status(400).send({ error: "Authorization code missing" });
      return;
    }
    const token: string = await authService.exchangeCodeForToken(code);
    const userInfo = await authService.getUserInfo(token);
    const userGuilds = await authService.getGuildList(token)

    console.log(chalk.green(`* [User] ${userInfo.username} (${userInfo.id}) connected`));

    const userData: IAuth = {
      id: userInfo.id,
      username: userInfo.username
    };

    const MANAGE_SERVER_PERMISSION: number = 1 << 5;
    const filteredGuilds = userGuilds.filter(item => item.owner || ( item.permissions & MANAGE_SERVER_PERMISSION ) == MANAGE_SERVER_PERMISSION)
      .map(item => ({
        id: item.id,
        name: item.name,
        owner: item.owner,
        permissions: item.permissions
      } as DiscordGuilds ));

    await authService.upsertIdentity(userData);

    await guildService.upsertGuilds({
      guilds: filteredGuilds,
      userId: userInfo.id
    });

    // Generate JWT
    const jwt = jwtService.generateToken({
      id: userInfo.id,
      username: userInfo.username
    });

    // Send JWT to client
    response.cookie("auth_token", jwt, {
      httpOnly: true, // No JavaScript
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3.6e6 
    });

    response.redirect("http://localhost:8000/guilds/list");
    return;
  } catch (err: any) 
  {
    console.error(chalk.redBright(`* [Error] ${err.message}`));
    response.status(500);
    return;
  }
});

AuthController.get("/check", authMiddleware, (request: AuthenticatedRequest, response: Response) => {
  response.status(200).send({ message: "User authenticated", user: request.user });
});

AuthController.post("/logout", (_request: Request, response: Response) => {
  response.clearCookie("auth_token");
  response.status(200).send({ message: "Logged out successfully" });
});


export { AuthController }