import { Router, Request, Response } from "express";

import config from "../../environments.config";

import chalk from "chalk";

const auth = Router();

auth.get("/auth", (req: Request, res: Response) => {

  console.log(chalk.blue(`* [${chalk.bold("Redirection")}] Redirected to ${chalk.underline("/auth")}`));
  res.redirect(config.OAUTH);

});

export default auth;
