import axios, { AxiosError } from "axios";

import { Guilds } from '../../services/database/models/Guilds';
import { IGuild } from "../../interfaces/database/Guilds";

import { DatabaseService } from '../../services/database/database.service';

export class GuildService 
{
  private readonly _database: DatabaseService;

  constructor(database: DatabaseService)
  {
    this._database = database;
  }

  public async upsertGuilds(guildData: IGuild): Promise<IGuild> 
  {
    const existingIdentity = await this._database.GetInfo(Guilds, { userId: guildData.userId });

    if ( !existingIdentity ) return await this._database.CreateInfo(Guilds, guildData);
    
    await this._database.UpdateInfo(Guilds, guildData, { userId: guildData.userId });
    return { ...existingIdentity, ...guildData }; 
  }

}