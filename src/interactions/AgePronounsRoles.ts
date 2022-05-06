import { GuildMember, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { client } from "../Structures/Client";
import { Config } from "../Structures/Config";
import { InteractionApp } from "../Structures/InteractionApp";

const AgePronounsRolesInteraction = new InteractionApp<SelectMenuInteraction<"present">>("AgePronounsRolesInteraction")

AgePronounsRolesInteraction.handle = (interaction) => {
     const member = (interaction.member as GuildMember)
     const role = interaction.values[0]

     if (!member.roles.cache.has(role)) {
          member.roles.add(role)

          interaction.reply({
               ephemeral: true,
               content: `I gave you the role <@&${role}>! Woof-woof!`
          })
     }
     else {
          member.roles.remove(role)

          interaction.reply({
               ephemeral: true,
               content: `I took the role <@&${role}> from you! Woof-woof!`
          })
     }

     
}

AgePronounsRolesInteraction.createInstance = () => {
     return new MessageSelectMenu().addOptions([{
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
     }].map(x => ({...x, description: "Click this role to give yourself"})))
}

export default AgePronounsRolesInteraction