import { Router, Request, Response } from "express";

import { getCookies } from "../utils/utils";
import { get } from "../database/service";
import config from "../../environments.config";

import chalk from 'chalk';

const api = Router();

api.get("/auth/api", async ( req: Request, res: Response )  => {
	console.log(chalk.blue(`* [${chalk.bold("Redirection")}] Redirected to ${chalk.underline("/auth/api")}`));

  let code = getCookies(req, res);
  const guild = await get(code["id"]);
  res.send({ guild: guild["guilds"] });
});

export default api
