import { Router, Request, Response } from "express";
import chalk from "chalk";

const root = Router();

root.get("/", (req: Request, res: Response) => {
  console.log(chalk.blue(`* [${chalk.bold("Redirection")}] Redirected to ${chalk.underline("/")}`));
  res.send({ message: "Express is working" });
});

export default root;
