import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed, TextBasedChannel } from "discord.js"
import { client } from "../../structures/Client"
import { Config } from "../../structures/Config"
import { InteractionApp } from "../../structures/InteractionApp"
import { prisma } from "../../structures/Prisma"

const CaseDeleteConfirmation = new InteractionApp<MessageComponentInteraction<"present">, string>("CaseDeleteConfirmationInteraction")

CaseDeleteConfirmation.handle = async (interaction) => {
     const cmd = interaction.customId.split("-")[1]

     if (cmd === "no") {
          await interaction.update({
               embeds: [new MessageEmbed().setDescription("Cancelled").setColor(0x2f3136)],
               components: []
          })
     } else if (cmd === "delete") {
          await interaction.update({
               embeds: [new MessageEmbed().setDescription("Deleted").setColor(0x6AB04C)],
               components: []
          })

          const strike = await prisma.strikeCase.update({
               where: {
                    id: parseInt(interaction.customId.split("-")[2])
               },
               data: {
                    deleted: true
               }
          })

          prisma.$disconnect()

          await (<TextBasedChannel>client.channels.cache.get(Config.channels["admin-log"])).messages.fetch(strike.messageLink.split("/").pop()).then(x => {
               x.delete()
          }).catch(() => { })
     }
}

CaseDeleteConfirmation.createInstance = (id) => {
     return [new MessageActionRow().setComponents(
          new MessageButton()
               .setCustomId(`CaseDeleteConfirmationInteraction-no-${id}`)
               .setLabel("No")
               .setStyle("SECONDARY"),
          new MessageButton()
               .setCustomId(`CaseDeleteConfirmationInteraction-delete-${id}`)
               .setLabel("Yes, delete")
               .setStyle("DANGER"))]
}

export default CaseDeleteConfirmation