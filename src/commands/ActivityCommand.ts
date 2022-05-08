import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { GuildMember, MessageActionRow, MessageButton } from "discord.js"
import { client } from "../structures/Client"
import { SlashCommand } from "../structures/SlashCommand"

const activities = [{ name: "Watch Together", value: "880218394199220334" }, { name: "Word Snacks", value: "879863976006127627" }, { name: "Sketch Heads", value: "902271654783242291" }, { name: "Poker Night", value: "755827207812677713" }, { name: "Chess In The Park", value: "832012774040141894" }, { name: "Letter League", value: "879863686565621790" }, { name: "SpellCast", value: "852509694341283871" }, { name: "Checkers In The Park", value: "832013003968348200" }, { name: "Blazing 8s", value: "832025144389533716" }, { name: "Land-io", value: "903769130790969345" }, { name: "Putt Party", value: "945737671223947305" }]

const ActivityCommand = new SlashCommand("activity", {
     value: "Start an activity in the voice chat"
}, [{
     type: "STRING",
     name: "type",
     description: "The activity you want to play",
     choices: activities
}] as const)

ActivityCommand.execute = async (args, interaction) => {
     if (!(interaction.member as GuildMember).voice) {
          return interaction.reply({
               ephemeral: true,
               embeds: [{
                    color: "RED",
                    description: "❌ You have to be in a voice chat to perform this action."
               }]
          })
     }

     const rest = new REST({ version: "9" }).setToken(client.token)
     const channelId = (interaction.member as GuildMember).voice.channelId

     rest.post(Routes.channelInvites(channelId), {
          body: {
               target_application_id: args[0],
               target_type: 2,
               temporary: false,
               validate: null,
               max_uses: 0,
               max_age: 86400
          }
     }).then((x: any) => {
          interaction.reply({
               embeds: [{
                    author: {
                         name: interaction.user.tag,
                         iconURL: interaction.user.avatarURL()
                    },
                    title: `🚀 Activity Started ✨`,
                    description: `<@${interaction.user.id}> just started **${activities.find(x => x.value === args[0]).name}** in <#${channelId}>`,
                    color: "GREEN"
               }],
               components: [new MessageActionRow().setComponents(new MessageButton({
                    url: `https://discord.com/invite/${x.code}`,
                    label: "Join the activity",
                    style: "LINK"
               }))]
          })
     })
}

export default ActivityCommand