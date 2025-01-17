export interface IGuild 
{
  guilds: Array<DiscordGuilds>
  userId: string
}

export interface DiscordGuilds 
{
  id: string;
  name: string;
  owner: boolean;
  permissions: string;
}
