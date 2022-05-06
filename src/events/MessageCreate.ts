import { MessageActionRow, MessageEmbed } from "discord.js";
import RolesInteraction from "../interactions/AgePronounsRoles";
import SpecificRolesInteraction from "../interactions/SpecificRoles";
import { DiscordEvent } from "../Structures/DiscordEvent";

const MessageCreate = new DiscordEvent("messageCreate")

MessageCreate.handle = (msg) => {
     if (msg.content === "!roles") {
          msg.channel.send({
               embeds: [new MessageEmbed({
                    title: "Age and Pronoun",
                    color: 0xc9eb7e,
                    description: `Select the role you want below and acquire it. To remove it, just re-selected.`,
                    fields: [{
                         name: "Pronouns",
                         value: `Tell the server how to address you (feel free to select multiple)!
🟥 - she/her
🟦 - he/him
🟩 - they/them
🟨 - neopronoun
🟪 - any pronoun`
                    }, {
                         name: "Age",
                         value: "To mark your age to other users (most important for minors who prefer not to speak to adults online):\n🔵 - Under-18\n🔴 - Over-18 (Includes if you are 18)"
                    }]
               })],
               components: [new MessageActionRow({
                    components: [RolesInteraction.createInstance()]
               })]
          })
     } else if (msg.content === "!roles2") {
          msg.channel.send({
               embeds: [new MessageEmbed({
                    title: "Specific Roles",
                    color: 0xc9eb7e,
                    description: `👀 - okay with spoilers (access to <#482881827779117056>)
🌿 - Heartstopper
🌧 - Solitaire
🎄 - This Winter
☀ - Nick and Charlie
📻 - Radio Silence
🎸 - I Was Born For This
🎭 - Access to LOVELESS chat`
               })],
               components: [new MessageActionRow({
                    components: [SpecificRolesInteraction.createInstance()]
               })]
          })
     }
}

export default MessageCreate