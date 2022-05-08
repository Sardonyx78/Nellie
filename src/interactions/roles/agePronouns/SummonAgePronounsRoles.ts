import { GuildMember, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { InteractionApp } from "../../../structures/InteractionApp";
import AgePronounsRolesInteraction from "./AgePronounsRoles";

const SummonAgePronounsRolesInteraction = new InteractionApp<MessageComponentInteraction<"present">>("SummonAgePronounsRolesInteraction")

export const agePronounsRolesMessage = {
     embeds: [new MessageEmbed({
          title: "Age and Pronoun",
          color: 0xc9eb7e,
          description: `Select the role you want below and acquire it. To remove it, just re-select it.`,
          fields: [{
               name: "Pronouns",
               value: `Tell the server how to address you (feel free to select multiple)!
🟥 - she/her
🟦 - he/him
🟩 - they/them
🟨 - neopronouns (You can add your pronouns via \`/editaboutme\`)
🟪 - any pronoun`
          }, {
               name: "Age",
               value: "To mark your age to other users (most important for minors who prefer not to speak to adults online):\n🔵 - Under-18\n🔴 - Over-18 (Includes if you are 18)"
          }]
     })],
     ephemeral: true
}

SummonAgePronounsRolesInteraction.handle = async (interaction) => {
     await interaction.reply({
          components: AgePronounsRolesInteraction.createInstance(interaction.member as GuildMember),
          nonce: interaction.id,
          ...agePronounsRolesMessage
     })
}

SummonAgePronounsRolesInteraction.createInstance = () => {
     return [new MessageActionRow().addComponents(new MessageButton().setCustomId("SummonAgePronounsRolesInteraction").setStyle(MessageButtonStyles.SECONDARY).setLabel("Show Age & Pronoun Roles Menu"))]
}

export default SummonAgePronounsRolesInteraction