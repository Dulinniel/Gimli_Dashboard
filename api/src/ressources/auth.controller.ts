import express, { Router, Request, Response } from "express";
import { AuthService } from "./auth/auth.service";
import { JwtService } from "../services/jwt/jwt.service";

import { DatabaseService } from "../services/database/database.service";
import { IAuth, DiscordGuild } from "../interfaces/database/Auth";

import { getCookies } from "../utils/cookie";

import config from "../../environments.config";
import chalk from "chalk";

const AuthController = Router();
const databaseService = new DatabaseService();
const authService = new AuthService(databaseService, config);
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
    const userGuild = await authService.getUserGuild(token);

    console.log(chalk.green(`* [User] ${userInfo.data.username} (${userInfo.data.id}) connected`));

    const userData: IAuth = {
      id: userInfo.data.id,
      username: userInfo.data.username,
      guilds: userGuild.data.map(item => ({
        id: item.id,
        name: item.name,
        owner: item.owner,
        permissions: item.permissions
      } as DiscordGuild))
    };

    await authService.upsertIdentity(userData);

    // Generate JWT
    const jwt = jwtService.generateToken({
      id: userInfo.data.id,
      username: userInfo.data.username
    });

    // Send JWT to client
    response.cookie("auth_token", jwt, {
      httpOnly: true, // No JavaScript
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600 * 1000 
    });

    response.status(307).redirect("http://localhost:8000/auth/api");
    return;
  } catch (err: any) {
    console.error(chalk.redBright(`* [Error] ${err.message}`));
    response.status(500);
    return;
  }
});

export { AuthController }