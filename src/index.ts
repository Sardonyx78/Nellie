import dotenv from "dotenv"

if (process.env.NODE_ENV === "development") dotenv.config({ path: "./dev.env" })
else dotenv.config()

import { InteractionApp } from "./Structures/InteractionApp";
import fs from "fs"
import { client } from "./Structures/Client";
import { DiscordEvent } from "./Structures/DiscordEvent";
import { SlashCommand } from "./Structures/SlashCommand";
import { MessageModal } from "./Structures/MessageModal";

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

     // Auto Import all DiscordEvents from /events
     fs.readdirSync("./dist/events").filter(x => x.endsWith(".js")).map(async x => {
          const event = (await import(`./events/${x}`)).default as DiscordEvent<any>
          client.on(event.eventName, event.handle)
     }),

     // Auto Import all Modals from /modals
     fs.readdirSync("./dist/modals").filter(x => x.endsWith(".js")).map(async x => {
          const cmd = (await import(`./modals/${x}`)).default as MessageModal
          client.modals.set(cmd.custom_id, cmd)
     })]).then(() => client.login(process.env.TOKEN))