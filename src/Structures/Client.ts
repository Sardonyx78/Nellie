import { Intents, Client, Guild, Collection } from "discord.js"
import { InteractionApp } from "./InteractionApp"
import { MessageModal } from "./MessageModal"
import { SlashCommand } from "./SlashCommand"

const intents = new Intents()
intents.add(Intents.FLAGS.GUILDS)
intents.add(Intents.FLAGS.GUILD_MESSAGES)

export const client = new Client({ intents: intents }) as Client & {
     guild: Guild,
     interactions: Collection<string, InteractionApp<any>>,
     commands: Collection<string, SlashCommand<any>>,
     modals: Collection<string, MessageModal>
}

// Declare the interactions and commands collection
client.interactions = new Collection()
client.commands = new Collection()
client.modals = new Collection()