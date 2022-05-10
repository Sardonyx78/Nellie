import { MessageEmbed, MessageOptions, Permissions } from "discord.js"
import SummonAgePronounsRolesInteraction from "../interactions/roles/agePronouns/SummonAgePronounsRoles"
import SummonSpecificRolesInteraction from "../interactions/roles/specific/SummonSpecificRoles"
import { SlashCommand } from "../structures/SlashCommand"
import SummonPingRolesInteraction from "../interactions/roles/ping/SummonPingRoles";

const choices: Record<string, { name: string, message: MessageOptions }> = {
     specialRoles: {
          name: "Roles",
          message: {
               components: [...SummonSpecificRolesInteraction.createInstance(), ...SummonAgePronounsRolesInteraction.createInstance(), ...SummonPingRolesInteraction.createInstance()],
               embeds: [new MessageEmbed({
                    description: "Click the one of the buttons below to open the roles menu",
                    color: 0xc9eb7e
               })]
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