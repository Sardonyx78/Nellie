import { Intents, Client, Guild, Collection } from "discord.js"
import { InteractionApp } from "./InteractionApp"
import { MessageModal } from "./MessageModal"
import { SlashCommand } from "./SlashCommand"
import { UserContextCommand } from "./UserContextCommand"

const intents = new Intents()
intents.add(Intents.FLAGS.GUILDS)
intents.add(Intents.FLAGS.GUILD_MESSAGES)
intents.add(Intents.FLAGS.GUILD_MEMBERS)
intents.add(Intents.FLAGS.GUILD_BANS)
intents.add(Intents.FLAGS.GUILD_INVITES)
intents.add(Intents.FLAGS.GUILD_VOICE_STATES)
intents.add(Intents.FLAGS.DIRECT_MESSAGES)

export const client = new Client({ intents: intents }) as Client & {
     guild: Guild,
     interactions: Collection<string, InteractionApp<any>>,
     commands: Collection<string, SlashCommand<any>>,
     modals: Collection<string, MessageModal<any>>,
     contexts: {
          user: Collection<string, UserContextCommand>
     }
}

// Declare the interactions and commands collection
client.interactions = new Collection()
client.commands = new Collection()
client.modals = new Collection()
client.contexts = {
     user: new Collection()
}