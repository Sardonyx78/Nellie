import { MessageOptions, Permissions } from "discord.js"
import SummonAgePronounsRolesInteraction from "../interactions/SummonAgePronounsRoles"
import SummonSpecificRolesInteraction from "../interactions/SummonSpecificRoles"
import { SlashCommand } from "../structures/SlashCommand"

const choices: Record<string, { name: string, message: MessageOptions }> = {
     specialRoles: {
          name: "Special Roles",
          message: {
               components: SummonSpecificRolesInteraction.createInstance(),
               content: "­"
          }
     },
     agePronounsRoles: {
          name: "Age & Pronoun Roles",
          message: {
               components: SummonAgePronounsRolesInteraction.createInstance(),
               content: "­"
          }
     }
}

const SpawnMessageCommand = new SlashCommand("spawnmessage", {
     value: "Spawn a message"
}, [{
     type: "STRING",
     choices: Object.keys(choices).map(x => ({ name: choices[x].name, value: x })),
     name: "message",
     description: "Message you want to spawn"
}] as const)

SpawnMessageCommand.execute = async (args, interaction) => {
     interaction.channel.send(choices[args[0]].message)
     interaction.reply({
          content: "Done!",
          ephemeral: true
     })
}

SpawnMessageCommand.permissions = [Permissions.FLAGS.ADMINISTRATOR]

export default SpawnMessageCommand