// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config()

import { InteractionApp } from "./structures/InteractionApp";
import fs from "fs/promises"
import { client } from "./structures/Client";
import { DiscordEvent } from "./structures/DiscordEvent";
import { SlashCommand } from "./structures/SlashCommand";
import { MessageModal } from "./structures/MessageModal";
import { UserContextCommand } from "./structures/UserContextCommand";
import path from "path";

/**
 * Load a every js file in a folder recursively 
 */
async function loadRecurive(dir: string, cb: (x: string) => Promise<void>): Promise<any> {
     dir = path.resolve(dir)
     
     return Promise.all((await fs.readdir(dir)).map(async x => {
          const child = path.join(dir, x)

          if ((await fs.stat(child)).isDirectory()) return loadRecurive(child, cb)
          else if (x.endsWith(".js")) return await cb(`.${path.sep}${path.relative(__dirname, child)}`)
     }))
}

Promise.all([
     // Auto Import all Interactions from /interactions
     loadRecurive("./dist/interactions", async x => {
          const interaction = (await import(x)).default as InteractionApp<any>
          client.interactions.set(interaction.typeName, interaction)
     }),

     // Auto Import all SlashCommands from /commands
     loadRecurive("./dist/commands", async x => {
          const cmd = (await import(x)).default as SlashCommand<any>
          client.commands.set(cmd.name, cmd)
     }),

     // Auto Import all UserContext from /contexts/user
     loadRecurive("./dist/contexts/user", async x => {
          const interaction = (await import(x)).default as UserContextCommand
          client.contexts.user.set(interaction.name, interaction)
     }),

     // Auto Import all DiscordEvents from /events
     loadRecurive("./dist/events", async x => {
          const event = (await import(x)).default as DiscordEvent<any>
          client.on(event.eventName, event.handle)
     }),

     // Auto Import all Modals from /modals
     loadRecurive("./dist/modals", async x => {
          const cmd = (await import(x)).default as MessageModal<"">
          client.modals.set(cmd.custom_id, cmd)
     })]).then(() => client.login(process.env.DISCORD_TOKEN))

process.on("unhandledRejection", (reason) => {
     console.error(reason)
})