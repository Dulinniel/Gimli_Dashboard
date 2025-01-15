import axios, { AxiosError } from "axios";

import { Auth } from '../../services/database/models/Auth';
import { IAuth } from "../../interfaces/database/Auth";
import { Config } from "../../interfaces/Config";
import { DatabaseService } from '../../services/database/database.service';

export class AuthService 
{
  private readonly _database: DatabaseService;
  private readonly _config: Config;

  constructor(database: DatabaseService, config: Config) 
  {
    this._database = database;
    this._config = config
  }

  // Récupère l'identité d'un utilisateur via son ID Discord
  public async getIdentity(discordId: string): Promise<IAuth | null> 
  {
    return await this._database.GetInfo(Auth, { id: discordId });
  }

  // Crée ou met à jour l'identité d'un utilisateur
  public async upsertIdentity(identityData: IAuth): Promise<IAuth> 
  {
    const existingIdentity = await this._database.GetInfo(Auth, { id: identityData.id });

    // Si l'utilisateur n'existe pas, on le crée
    if ( !existingIdentity ) return await this._database.CreateInfo(Auth, identityData);
    
    // Si l'utilisateur existe, on met à jour ses infos
    await this._database.UpdateInfo(Auth, identityData, { id: identityData.id });
    return { ...existingIdentity, ...identityData }; 
  }

  // Supprime l'identité d'un utilisateur
  public async removeIdentity(discordId: string): Promise<void> 
  {
    const existingIdentity = await this._database.GetInfo(Auth, { id: discordId });
    if (existingIdentity) await this._database.RemoveInfo(Auth, { id: discordId });
  }

  public async exchangeCodeForToken(code: string): Promise<string> 
  {
    const params = new URLSearchParams({
      client_id: this._config.CLIENT_ID,
      client_secret: this._config.SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: this._config.REDIRECT_URI,
    });

    try {
      const tokenResponse = await axios.post("https://discord.com/api/oauth2/token", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      return tokenResponse.data.access_token;
    } catch (err) {
      this.handleError(err, "Error exchanging code for token");
      throw new Error("Failed to exchange code for token");
    }
  }

  public async getUserInfo(token: string): Promise<any> 
  {
    return await this.fetchFromDiscord("https://discord.com/api/v9/users/@me", token);
  }

  public async getUserGuild(token: string): Promise<any> 
  {
    return await this.fetchFromDiscord("https://discord.com/api/v9/users/@me/guilds", token);
  }

  private async fetchFromDiscord(url: string, token: string): Promise<any> 
  {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      this.handleError(err, `Error fetching data from ${url}`);
      throw new Error("Failed to fetch data from Discord");
    }
  }

  private handleError(err: AxiosError, message: string): void 
  {
    if (err.response) 
    {
      console.error(`${message}: ${err.response.status} - ${err.response.statusText}`);
      console.error(`Response data: ${JSON.stringify(err.response.data)}`);
    } else 
    {
      console.error(`${message}: ${err.message}`);
    }
  }


}
