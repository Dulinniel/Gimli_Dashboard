import { Guilds, IGuilds } from "./models/Guilds";

import chalk from "chalk";

export const save = async (guild: IGuilds) => {
  const userGuilds = await Guilds.findOne({ id: guild.id });

  if ( !userGuilds ) {
    try {
      await Guilds.create(guild);
      console.log(chalk.cyan(`* [${chalk.bold("Saved")}] New user saved : ${chalk.italic(guild.username)} with ${chalk.bold(guild.guilds.length)} guilds`));
    } catch (err) {
      if ( err ) {
        console.log(chalk.redBright(`* [${chalk.bold("Error")}] during ${chalk.underline("Save")} -> ${chalk.italic(err)}`));
      }
    }
  } else {
    if ( userGuilds.guilds != guild.guilds ) {
      try {
        await userGuilds.updateOne(guild);
        console.log(chalk.hex("#FF8800")`* [${chalk.bold("Updated")}] Guild updates for : ${chalk.italic(guild.username)}`);
      } catch (err) {
        if ( err ) {
          console.log(chalk.redBright(`* [${chalk.bold("Error")}] during ${chalk.underline("Update")} -> ${chalk.italic(err)}`));
        }
      }
    } else console.log(`* [${chalk.bold("Updated")}] ${chalk.hex("#DC143C")} ${chalk.underline('Nothing to update')}`);
  }
}

export const get = async (code: string) => {
  try {
    const userData = await Guilds.findOne({ code: code });
    if ( userData ) {
      console.log(chalk.hex("7F00FF")`* [${chalk.bold("Get")}] Got user Data for : ${userData.username}`);
      return userData;
    } else {
      console.log(chalk.hex("DC143C") `* [${chalk.bold("Get")}] Nothing to return`);
      return {};
    }
  } catch ( error ) {
    if ( error ) {
      console.log(chalk.redBright(`* [${chalk.bold("Error")}] during ${chalk.underline("Get")} -> ${chalk.italic(error)}`));
    }
  }

}
