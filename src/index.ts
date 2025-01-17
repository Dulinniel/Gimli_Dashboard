import express, { Request, Response } from "express";
import cors from "cors";
import chalk from "chalk";

import { UnknownRoutesHandler } from "./middlewares/unknownRoute.handler";

import { AuthController } from "./ressources/auth.controller";
import { GuildController } from "./ressources/guild.controller";

import { DatabaseService } from "./services/database/database.service";

import config from "../environments.config";

const app = express();
const port: string = config.PORT as string | "8080";

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
  })
);

app.use('/auth', AuthController);
app.use('/guilds', GuildController);

app.use('/', ( request: Request, response: Response ) => {
  console.log(chalk.blue(`* [${chalk.bold("Redirection")}] Redirected to ${chalk.underline("/")}`));
  response.status(200).send({ message: "Ok" });
});

app.all('*', UnknownRoutesHandler)

app.listen(port, () => {
  console.log(chalk.green(`* [${chalk.bold(port)}] server running at ${chalk.underline(`http://localhost:${port}`)}`));
});

const databaseService = new DatabaseService();
databaseService.openDatabase(config.MONGO_URI as string);
