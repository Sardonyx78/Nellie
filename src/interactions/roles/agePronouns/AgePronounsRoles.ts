import { GuildMember, MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import _ from "lodash";
import { Config } from "../../../structures/Config";
import { InteractionApp } from "../../../structures/InteractionApp";
import { agePronounsRolesMessage } from "./SummonAgePronounsRoles";

const AgePronounsRolesInteraction = new InteractionApp<MessageComponentInteraction<"present">, GuildMember>("AgePronounsRolesInteraction")

AgePronounsRolesInteraction.handle = async (interaction) => {
     const member = (interaction.member as GuildMember)
     const role = interaction.customId.split("-")[1]

     const components = AgePronounsRolesInteraction.createInstance(interaction.member as GuildMember)

     if (!member.roles.cache.has(role)) {
          await member.roles.add(role)

          components.flatMap(x => x.components as MessageButton[]).find(x => x.customId === interaction.customId).setStyle(MessageButtonStyles.SUCCESS)
     }
     else {
          await member.roles.remove(role)

          components.flatMap(x => x.components as MessageButton[]).find(x => x.customId === interaction.customId).setStyle(MessageButtonStyles.SECONDARY)
     }

     await interaction.update({...agePronounsRolesMessage, components})
}

AgePronounsRolesInteraction.createInstance = (member) => {
     const buttons = [{
          label: "she/her",
          value: Config.roles.pronouns.sheHer,
          emoji: "🟥"
     }, {
          label: "he/him",
          value: Config.roles.pronouns.heHim,
          emoji: "🟦"
     }, {
          label: "they/them",
          value: Config.roles.pronouns.theyThem,
          emoji: "🟩"
     }, {
          label: "Neopronouns",
          value: Config.roles.pronouns.neo,
          emoji: "🟨"
     }, {
          label: "Any pronouns",
          value: Config.roles.pronouns.any,
          emoji: "🟪"
     }, {
          label: "Under 18",
          value: Config.roles.age.minor,
          emoji: "🔵"
     }, {
          label: "Over 18",
          value: Config.roles.age.adult,
          emoji: "🔴"
     }].map(x => new MessageButton({
          customId: `AgePronounsRolesInteraction-${x.value}`,
          style: member.roles.cache.has(x.value) ? MessageButtonStyles.SUCCESS : MessageButtonStyles.SECONDARY,
          emoji: x.emoji,
          label: x.label
     }))

     return _.chunk(buttons, 5).map(x => new MessageActionRow().addComponents(x))
}

export default AgePronounsRolesInteraction