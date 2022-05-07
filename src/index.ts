// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config()

import { InteractionApp } from "./structures/InteractionApp";
import fs from "fs"
import { client } from "./structures/Client";
import { DiscordEvent } from "./structures/DiscordEvent";
import { SlashCommand } from "./structures/SlashCommand";
import { MessageModal } from "./structures/MessageModal";
import { UserContextCommand } from "./structures/UserContextCommand";

Promise.all([
     // Auto Import all Interactions from /interactions
     fs.readdirSync("./dist/interactions").filter(x => x.endsWith(".js")).forEach(async x => {
          const interaction = (await import(`./interactions/${x}`)).default as InteractionApp<any>
          client.interactions.set(interaction.typeName, interaction)
     }),

     // Auto Import all SlashCommands from /commands
     fs.readdirSync("./dist/commands").filter(x => x.endsWith(".js")).map(async x => {
          const cmd = (await import(`./commands/${x}`)).default as SlashCommand<any>
          client.commands.set(cmd.name, cmd)
     }),

     // Auto Import all UserContext from /contexts/user
     fs.readdirSync("./dist/contexts/user").filter(x => x.endsWith(".js")).forEach(async x => {
          const interaction = (await import(`./contexts/user/${x}`)).default as UserContextCommand
          client.contexts.user.set(interaction.name, interaction)
     }),

     // Auto Import all DiscordEvents from /events
     fs.readdirSync("./dist/events").filter(x => x.endsWith(".js")).map(async x => {
          const event = (await import(`./events/${x}`)).default as DiscordEvent<any>
          client.on(event.eventName, event.handle)
     }),

     // Auto Import all Modals from /modals
     fs.readdirSync("./dist/modals").filter(x => x.endsWith(".js")).map(async x => {
          const cmd = (await import(`./modals/${x}`)).default as MessageModal<"">
          client.modals.set(cmd.custom_id, cmd)
     })]).then(() => client.login(process.env.TOKEN))

process.on("unhandledRejection", (reason) => {
     console.error(reason)
})