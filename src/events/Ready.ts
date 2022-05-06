import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { ChatInputApplicationCommandData } from "discord.js";
import _ from "lodash";
import { client } from "../Structures/Client";
import { DiscordEvent } from "../Structures/DiscordEvent";
import { Localization } from "../Structures/SlashCommand";

const ReadyEvent = new DiscordEvent("ready")

ReadyEvent.handle = async () => {
     console.log("Ready!")
     client.guild = client.guilds.cache.first()

     const rest = new REST({ version: "9" }).setToken(client.token)

     const commandsList = await rest.get(Routes.applicationGuildCommands(client.user.id, client.guild.id)) as (ChatInputApplicationCommandData & { description_localizations?: Localization, id: string })[]
     const commands: Record<string, ChatInputApplicationCommandData & { description_localizations?: Localization, id: string }> = {}

     for (const cmd of commandsList) {
          commands[cmd.name] = cmd
     }

     const updateData: any[] = []
     const checked: string[] = []

     client.commands.forEach(x => {
          updateData.push(x.serialize())

          if (commands[x.name]) checked.push(x.name)
     })
     
     const deletionQueue: string[] = []
     _.difference(Object.keys(commands), checked).forEach(x => deletionQueue.push(commands[x].id))

     await rest.put(Routes.applicationGuildCommands(client.user.id, client.guild.id), {
          body: updateData
     })

     deletionQueue.forEach(x => rest.delete(Routes.applicationGuildCommand(client.user.id, client.guild.id, x)))
}

export default ReadyEvent