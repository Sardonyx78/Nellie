/* eslint-disable indent */
import { ApplicationCommandSubCommand, MessageEmbed, Permissions, TextBasedChannel } from "discord.js"
import CaseDeleteConfirmation from "../../interactions/moderation/CaseDeleteConfirmation"
import { client } from "../../structures/Client"
import { Config } from "../../structures/Config"
import { prisma } from "../../structures/Prisma"
import { SlashCommand } from "../../structures/SlashCommand"

const StrikeCommand = new SlashCommand("strike", {
     value: "Strike a person"
}, [{
     name: "action",
     type: "SUB_COMMAND_GROUP",
     description: "Edit or give a strike",
     options: [{
          name: "give",
          description: "Give a strike",
          type: "SUB_COMMAND",
          options: [{
               type: "USER",
               name: "user",
               description: "User to punish",
               required: true
          }, {
               type: "STRING",
               description: "Strike reason",
               name: "reason",
               required: true
          }, {
               type: "BOOLEAN",
               name: "hidden",
               description: "Should it be hidden from the chat",
               required: false
          }]
     }, {
          name: "edit",
          description: "Edit the description of a case",
          type: "SUB_COMMAND",
          options: [{
               type: "INTEGER",
               required: true,
               name: "case-id",
               description: "Case to modify"
          }, {
               type: "STRING",
               required: true,
               name: "reason",
               description: "Updated reason"
          }]
     }, {
          name: "delete",
          description: "Delete a case",
          type: "SUB_COMMAND",
          options: [{
               type: "INTEGER",
               required: true,
               name: "case-id",
               description: "Case to delete"
          }]
     }] as ApplicationCommandSubCommand[]
}] as const)

StrikeCommand.permissions = [Permissions.FLAGS.MODERATE_MEMBERS]

StrikeCommand.execute = async (_args, interaction) => {
     const cmd = interaction.options.getSubcommand()

     if (cmd === "give") {
          const user = interaction.options.getUser("user")
          const reason = interaction.options.getString("reason")

          const strike = await prisma.strikeCase.create({
               data: {
                    reason,
                    userId: BigInt(user.id),
                    timestamp: new Date()
               }
          })

          const embed = new MessageEmbed()
               .setAuthor({
                    name: `${interaction.user.tag} (${interaction.id})`,
                    iconURL: interaction.user.avatarURL({ dynamic: true })
               })
               .setThumbnail(user.avatarURL({ dynamic: true }))
               .setFooter({
                    text: `Case #${strike.id}`
               })
               .setDescription(`**Action:** Strike
**Member:** <@${user.id}> (${user.id})
**Reason:** ${reason}`)
               .setColor(0xFFBE76)
               .setTimestamp()

          interaction.reply({
               embeds: [embed],
               ephemeral: !!interaction.options.getBoolean("hidden", false)
          })

          await (<TextBasedChannel>client.channels.cache.get(Config.channels["admin-log"])).send({
               embeds: [embed]
          }).then(async msg => {
               await prisma.strikeCase.update({
                    where: {
                         id: strike.id
                    },
                    data: {
                         messageLink: msg.url
                    }
               })

               prisma.$disconnect()
          })
     } else if (cmd === "edit") {
          const strike = await prisma.strikeCase.update({
               where: {
                    id: interaction.options.getInteger("case-id")
               },
               data: {
                    reason: interaction.options.getString("reason")
               }
          }).catch(() => null)
          prisma.$disconnect()

          if (strike) {
               const user = await client.users.fetch(strike.userId.toString())
               const embed = new MessageEmbed()
                    .setAuthor({
                         name: `${interaction.user.tag} (${interaction.id})`,
                         iconURL: interaction.user.avatarURL({ dynamic: true })
                    })
                    .setThumbnail(user.avatarURL({ dynamic: true }))
                    .setFooter({
                         text: `Case #${strike.id}`
                    })
                    .setDescription(`**Action:** Strike
**Member:** <@${user.id}> (${user.id})
**Reason:** ${strike.reason}`)
                    .setColor(0xFFBE76)
                    .setTimestamp(strike.timestamp)
                    .setURL(strike.messageLink)


               interaction.reply({
                    ephemeral: true,
                    embeds: [embed]
               })

               await (<TextBasedChannel>client.channels.cache.get(Config.channels["admin-log"])).messages.fetch(strike.messageLink.split("/").pop()).then(x => {
                    x.edit({
                         embeds: [embed]
                    })
               }).catch(() => { })

          } else interaction.reply({
               ephemeral: true,
               embeds: [new MessageEmbed().setColor("RED").setDescription("Couldn't find the case.")]
          })
     } else if (cmd === "delete") {
          const strike = await prisma.strikeCase.findUnique({
               where: {
                    id: interaction.options.getInteger("case-id")
               }
          })

          if (strike) {
               const user = await client.users.fetch(strike.userId.toString())

               interaction.reply({
                    embeds: [new MessageEmbed()
                         .setTitle("❌ Delete this case?")
                         .setFooter({
                              text: `Case #${strike.id}`
                         })
                         .setDescription(`**Action:** Strike
     **Member:** <@${strike.userId}> (${strike.userId})
     **Reason:** ${strike.reason}`)
                         .setColor("RED")
                         .setThumbnail(user.avatarURL({ dynamic: true }))
                         .setTimestamp(strike.timestamp)],
                    ephemeral: true,
                    components: CaseDeleteConfirmation.createInstance(strike.id.toString())
               })
          } else interaction.reply({
               ephemeral: true,
               embeds: [new MessageEmbed().setColor("RED").setDescription("Couldn't find the case.")]
          })
     }


}

export default StrikeCommand