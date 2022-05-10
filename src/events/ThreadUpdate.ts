import { client } from "../structures/Client";
import { DiscordEvent } from "../structures/DiscordEvent";
import {prisma} from "../structures/Prisma";
import {MessageActionRow, MessageButton, MessageEmbed, MessageEmbedOptions} from "discord.js";

const ThreadUpdate = new DiscordEvent("threadUpdate")

ThreadUpdate.handle = async (oldThread, newThread) => {
     if (oldThread.archived !== newThread.archived) {
          if (newThread.archived) {
               const ticket = await  prisma.ticket.update({
                    where: {
                         id: newThread.id
                    },
                    data: {
                         resolved: true
                    }
               })
               prisma.$disconnect()

               const user = await client.users.fetch(ticket.userId.toString())

               user.createDM(false).then(x => {
                    x.send({
                         embeds: [new MessageEmbed({
                              color: 0xc9eb7e,
                              description: "🔔 This ticket has been marked as resolved by moderators.",
                         } as MessageEmbedOptions)],
                         components: [new MessageActionRow().setComponents(
                              new MessageButton()
                                   .setLabel(`#${ticket.id}`)
                                   .setStyle("SECONDARY")
                                   .setDisabled(true)
                                   .setCustomId(".")
                                   .setEmoji("📭"))
                         ]
                    })
               })
          } else {
               const ticket = await  prisma.ticket.update({
                    where: {
                         id: newThread.id
                    },
                    data: {
                         resolved: false
                    }
               })
               prisma.$disconnect()

               const user = await client.users.fetch(ticket.userId.toString())

               user.createDM(false).then(x => {
                    x.send({
                         embeds: [new MessageEmbed({
                              color: 0xc9eb7e,
                              description: "🔔 This ticket has been marked as **unresolved** by moderators.",
                         } as MessageEmbedOptions)],
                         components: [new MessageActionRow().setComponents(
                              new MessageButton()
                                   .setLabel(`#${ticket.id}`)
                                   .setStyle("SECONDARY")
                                   .setDisabled(true)
                                   .setCustomId(".")
                                   .setEmoji("📭"))
                         ]
                    })
               })
          }
     }
}

export default ThreadUpdate