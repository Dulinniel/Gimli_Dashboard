import express  from "express";
import cors from "cors";
import chalk from "chalk";
import config from "../environments.config";

import { root, auth, discord, api } from "./router";
import { connectDatabase } from "./database/connectDatabase";

const app = express();
const port: string = config.PORT;

app.use(express.json());
app.use(cors());

app.use(root);
app.use(auth);
app.use(discord);
app.use(api);

app.listen(port, () => {
    console.log(chalk.green(`* [${chalk.bold(port)}] server running at ${chalk.underline(`http://localhost:${port}`)}`));
});

connectDatabase();
