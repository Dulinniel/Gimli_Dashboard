import cors from "cors";
import { Router, Request, Response } from "express";
import axios from "axios";

import { IGuilds } from "../database/models/Guilds";
import { save } from "../database/service";
import { getCookies } from "../utils/utils";

import config from "../../environments.config";

import chalk from "chalk";

const discord = Router();

discord.get("/auth/discord", cors(), async (req: Request, res: Response) => {
	console.log(chalk.blue(`* [${chalk.bold("Redirection")}] Redirected to ${chalk.underline("/auth/discord")}`));

	res.locals.cookie = getCookies(req, res);
  const code = req.query.code as string;

  console.log(chalk.red(`* [${chalk.bold("Access Code")}] ${code}`));

  const params = new URLSearchParams({
		"client_id": config.CLIENT_ID as string,
  	"client_secret": config.SECRET as string,
   	"grant_type": 'authorization_code',
    "code": code,
   	"redirect_uri": config.REDIRECT_URI,
  });

 	const header = {
    headers: {
      "Content-Type": 'application/x-www-form-urlencoded'
     }
   };

  try {
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', params, header);
    console.log(chalk.red(`* [${chalk.bold("Access Token")}] ${chalk.bgRed(tokenRes.data.access_token)}`));
    const token = tokenRes.data.access_token;

    const userRes = await axios.get("https://discord.com/api/v9/users/@me", {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });

    const userGuild = await axios.get("https://discord.com/api/v9/users/@me/guilds", {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });

    console.log(chalk.magenta(`* [${chalk.bold("user info")}] username : ${chalk.underline(userRes.data.username)}`));
    console.log(chalk.magenta(`* [${chalk.bold("user info")}] discriminator : ${chalk.underline(userRes.data.discriminator)}`));
    console.log(chalk.magenta(`* [${chalk.bold("user info")}] id : ${chalk.underline(userRes.data.id)}`));

    console.log(chalk.magenta(`* [${chalk.bold("user info")}] ${chalk.underline(userRes.data.username)} is in : ${chalk.bold(userGuild.data.length)} guild(s)`));

    let guildData = userGuild.data;
    let userData = userRes.data;

    let basicsUserInfo: IGuilds = {
      guilds: [],
      username: userData.username,
      id: userData.id
    };

	  if ( res.locals.cookie == "" ) {

		  res.cookie("id", code, {
			  maxAge: 8500000,
			  sameSite: "none",
			  secure: true,
        path: "/"
			});

     basicsUserInfo.code = code;
     
		}

    guildData.forEach(g => {
      
      console.log(chalk.yellow(`* [${chalk.bold("guild info")}] found guild named : ${chalk.italic(g.name)}`));
      let guild = {
        id: g.id,
        name: g.name,
        owner: g.owner,
        permissions: g.permissions
      }

      basicsUserInfo.guilds.push(guild);

    });

    await save(basicsUserInfo);

    await res.redirect("http://localhost:8000/auth/api");

  } catch (err) {
    if ( err ) {
      res.send(err.response.data);
      console.log(chalk.redBright(`* [${chalk.bold("Error")}] in ${chalk.underline("/auth/discord")} -> ${chalk.italic(err)}`));
      console.log(chalk.redBright(`* [${chalk.bold("Description")}] in ${chalk.underline("/auth/discord")} -> ${chalk.italic(err.response.data.error_description)}`));
    }
 }	
});

export default discord;
