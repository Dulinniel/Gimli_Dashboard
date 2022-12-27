import { connect } from "mongoose";
import config from "../../environments.config";

import chalk from "chalk";

export const connectDatabase = async () => {
  await connect(config.MONGO_URI);
  console.log(chalk.greenBright(`* [${chalk.bold("Connection")}] Database is ready`));
}
