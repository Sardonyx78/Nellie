import { client } from "../structures/Client";
import { DiscordEvent } from "../structures/DiscordEvent";
import {prisma} from "../structures/Prisma";
import {
     Message,
     MessageActionRow,
     MessageButton,
     MessageEmbed,
     MessageEmbedOptions,
     TextChannel,
     ThreadChannel
} from "discord.js";
import TicketControls from "../interactions/tickets/TicketControls";

const MessageCreate = new DiscordEvent("messageCreate")

MessageCreate.handle = async (message) => {
     if (message.author.bot || message.content.length === 0) return

     if (message.channel.type === "DM") {
          let ticket = await prisma.ticket.findFirst({
               where: {
                    userId: BigInt(message.author.id),
                    resolved: false
               }
          })

          let thread: ThreadChannel = null

          if (!ticket) {
               const res = await message.channel.send({
                    embeds: [new MessageEmbed({
                         color: 0xc9eb7e,
                         description: "✅ Your ticket has been created. Please wait until the moderators contact you.",
                         footer: {
                              text: "Please when sending images send them as links. You can use imgur or just re-send the picture by copying the link."
                         }
                    } as MessageEmbedOptions)]
               }).catch(() => null) as Message | null

               if (!res) return

               const ticketsChannel = client.channels.cache.get("973470416637136916") as TextChannel

               thread = await ticketsChannel.threads.create({
                    name: message.author.tag,
                    autoArchiveDuration: "MAX",
                    type: "GUILD_PUBLIC_THREAD"
               })

               ticket = await prisma.ticket.create({
                    data: {
                         userId: BigInt(message.author.id),
                         resolved: false,
                         id: thread.id,
                         topic: "Unnamed Ticket"
                    }
               })
               prisma.$disconnect()

               res.edit({
                    components: [new MessageActionRow().setComponents(
                         new MessageButton()
                              .setLabel(`#${ticket.id}`)
                              .setStyle("SECONDARY")
                              .setDisabled(true)
                              .setCustomId(".")
                              .setEmoji("📭"))
                    ]
               })

               const member = await client.guild.members.fetch(message.author)

               await thread.send({
                    components: TicketControls.createInstance(thread.id),
                    embeds: [new MessageEmbed({
                         color: 0x2f3136,
                         title: `${message.author.tag}`,
                         description: member.nickname ? `Also known as: ${member.nickname}` : undefined,
                         thumbnail: member.avatarURL() || message.author.avatarURL(),
                         author: {
                              name: `ID: ${message.author.id}`
                         },
                         timestamp: Date.now()
                    } as MessageEmbedOptions)]
               })
          } else thread = client.channels.cache.get(ticket.id) as ThreadChannel

          thread.send({
               embeds: [new MessageEmbed({
                    color: 0x2f3136,
                    author: {
                         iconURL: message.author.avatarURL(),
                         name: message.author.tag
                    },
                    description: message.content
               } as MessageEmbedOptions)]
          })
     } else if (message.channel.type === "GUILD_PUBLIC_THREAD") {
          const ticket = await prisma.ticket.findFirst({
               where: {
                    id: message.channel.id,
                    resolved: false
               }
          })

          if (ticket) {
               (await client.users.fetch(ticket.userId.toString())).createDM(false).then(x => {
                    x.send(message.content)
               })
          }
     }
}

export default MessageCreate