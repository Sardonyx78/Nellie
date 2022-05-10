import { GuildMember, MessageEmbed, Permissions } from "discord.js"
import { client } from "../structures/Client"
import { prisma } from "../structures/Prisma"
import { SlashCommand } from "../structures/SlashCommand"
import moment from "moment"

const AboutMeCommand = new SlashCommand("about", {
     value: "Get a person's info"
}, [{
     name: "user",
     type: "USER",
     description: "Person whose information you want",
     required: true
}] as const)

AboutMeCommand.permissions = [Permissions.FLAGS.SEND_MESSAGES]

AboutMeCommand.execute = async (args, interaction, ephemeral = false) => {
     const data = await prisma.aboutMe.findUnique({ where: { userId: BigInt(args[0].id) } })
     const strikes = await prisma.strikeCase.findMany({ where: { userId: BigInt(args[0].id), deleted: false } })
     prisma.$disconnect()

     const member = await client.guild.members.fetch(args[0])

     const embed = new MessageEmbed()
          .setColor(member.displayColor || 0xffffff)
          .setAuthor({
               name: member.user.tag,
               iconURL: member.avatarURL({ dynamic: true }) || member.user.avatarURL({ dynamic: true })
          })
          .setThumbnail(member.avatarURL({ dynamic: true }) || member.user.avatarURL({ dynamic: true })) 

     if (data) {
          if (data.pronouns.length > 0) {
               embed.addField("Pronouns", data.pronouns)
          }

          if (data.bio.length > 0) {
               embed.addField("About Me", data.bio)
          }
     }

     embed.addField("Joined", moment(member.joinedTimestamp).format("ddd, MMMM Do YYYY, h:mm:ss a"), true)
     embed.addField("Registered", moment(member.user.createdAt).format("ddd, MMMM Do YYYY, h:mm:ss a"), true)

     embed.addField(`Roles [${member.roles.cache.size - 1}]`, member.roles.cache.filter(x => x.id !== client.guild.id).map(x => `<@&${x.id}>`).join(" "), false)

     if (strikes.length > 0 && (interaction.member as GuildMember).permissions.has("MODERATE_MEMBERS")) {
          embed.addField(`Strikes [${strikes.length}]`, strikes.map(x => `• **${x.reason}** \`${moment(x.createdAt).fromNow()}\` [(#${x.id})](${x.messageLink})`).join("\n"))
     }

     embed.setFooter({
          text: `ID: ${member.user.id}`
     })

     embed.setTimestamp()

     interaction.reply({
          embeds: [embed],
          ephemeral: ephemeral || (interaction.member as GuildMember).permissions.has("MODERATE_MEMBERS")
     })
}

export default AboutMeCommand