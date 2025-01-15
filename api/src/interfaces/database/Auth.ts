export interface IAuth {
  guilds: Array<DiscordGuild>,
  id: string,
  username: string,
};

export interface DiscordGuild {
  id: string,
  name: string,
  owner: boolean,
  permissions: string
};